import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import {
  getChannel,
  int,
  jsonResponse,
  nobedsGet,
  pick,
  recordSync,
  serviceClient,
  str,
  toArray,
  toIso,
} from "../_shared/nobeds.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = serviceClient();
  let channelId: string | null = null;

  try {
    const body = await req.json().catch(() => ({}));
    channelId = typeof body?.channel_id === "string" ? body.channel_id : null;
    if (!channelId) throw new Error("channel_id is required");

    const channel = await getChannel(supabase, channelId);

    const { data: properties, error: propError } = await supabase
      .from("properties")
      .select("id, external_id")
      .eq("channel_id", channelId);
    if (propError) throw new Error(propError.message);
    if (!properties?.length) throw new Error("No properties synced yet — run the property sync first");

    const propertyByExternal = new Map<number, string>(
      properties.map((p) => [p.external_id as number, p.id as string]),
    );
    const defaultPropertyId = properties[0].id as string;

    const { data: bookings } = await supabase
      .from("bookings")
      .select("id, external_id, channel_source, property_id")
      .in("property_id", properties.map((p) => p.id));
    const bookingByExternal = new Map(
      (bookings ?? []).map((b) => [b.external_id as number, b]),
    );

    const payload = await nobedsGet(channel.api_token, "Messages");

    let synced = 0;
    for (const message of toArray(payload)) {
      const externalId = int(pick(message, ["id", "message_id"]));
      if (externalId === null) continue;

      const rid = int(pick(message, ["rid", "order_id", "booking_id"]));
      const booking = rid !== null ? bookingByExternal.get(rid) : undefined;
      const hotelExternalId = int(pick(message, ["hotel_id", "hotelId"]));
      const propertyId = booking?.property_id ??
        (hotelExternalId !== null ? propertyByExternal.get(hotelExternalId) : undefined) ??
        defaultPropertyId;

      const { error } = await supabase.from("messages").upsert(
        {
          property_id: propertyId,
          booking_id: booking?.id ?? null,
          external_id: externalId,
          guest_message: str(pick(message, ["message", "guest_message", "text", "body"])),
          host_reply: str(pick(message, ["reply", "host_reply", "answer"])),
          channel_source: booking?.channel_source ?? null,
          sent_at: toIso(pick(message, ["created_at", "date", "sent_at", "created"])),
          raw_data: message,
        },
        { onConflict: "property_id,external_id" },
      );
      if (error) throw new Error(error.message);
      synced++;
    }

    await recordSync(supabase, channelId, null);
    return jsonResponse({ success: true, messages_synced: synced }, corsHeaders);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (channelId) await recordSync(supabase, channelId, message);
    return jsonResponse({ success: false, error: message }, corsHeaders, 200);
  }
});
