import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import {
  getChannel,
  int,
  jsonResponse,
  nobedsGet,
  num,
  pick,
  recordSync,
  resolveChannelSource,
  serviceClient,
  str,
  toArray,
  toIso,
} from "../_shared/nobeds.ts";

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = serviceClient();
  let channelId: string | null = null;

  try {
    const body = await req.json().catch(() => ({}));
    channelId = typeof body?.channel_id === "string" ? body.channel_id : null;
    if (!channelId) throw new Error("channel_id is required");

    const now = new Date();
    const past = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const fromDate = str(body?.from_date) ?? isoDate(past);
    const toDate = str(body?.to_date) ?? isoDate(new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000));

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

    const { data: rooms } = await supabase
      .from("rooms")
      .select("id, external_id, property_id")
      .in("property_id", properties.map((p) => p.id));
    const roomByExternal = new Map<number, string>(
      (rooms ?? []).map((r) => [r.external_id as number, r.id as string]),
    );

    const payload = await nobedsGet(channel.api_token, "Bookings", {
      fromdate: fromDate,
      todate: toDate,
    });

    let synced = 0;
    for (const booking of toArray(payload)) {
      const externalId = int(pick(booking, ["order_id", "id", "booking_id"]));
      const checkin = toIso(pick(booking, ["checkin", "check_in", "date_from", "arrival"]));
      const checkout = toIso(pick(booking, ["checkout", "check_out", "date_to", "departure"]));
      if (externalId === null || !checkin || !checkout) continue;

      const hotelExternalId = int(pick(booking, ["hotel_id", "hotelId"]));
      const propertyId = (hotelExternalId !== null && propertyByExternal.get(hotelExternalId)) ||
        defaultPropertyId;
      const roomExternalId = int(pick(booking, ["room_id", "rental_id"]));
      const roomId = roomExternalId !== null ? roomByExternal.get(roomExternalId) ?? null : null;

      const referral = str(pick(booking, ["referral_order_id", "referral", "external_order_id"]));
      const nights = int(pick(booking, ["nights", "days"])) ??
        Math.max(
          1,
          Math.round(
            (new Date(checkout).getTime() - new Date(checkin).getTime()) / (24 * 60 * 60 * 1000),
          ),
        );

      const { error } = await supabase.from("bookings").upsert(
        {
          property_id: propertyId,
          room_id: roomId,
          external_id: externalId,
          channel_source: resolveChannelSource(referral),
          referral_order_id: referral,
          guest_name: str(pick(booking, ["guest_name", "name", "client_name", "customer"])),
          guest_email: str(pick(booking, ["guest_email", "email"])),
          guest_phone: str(pick(booking, ["guest_phone", "phone", "telephone"])),
          guest_country: str(pick(booking, ["guest_country", "country"])),
          guests_count: int(pick(booking, ["guests", "guests_count", "adults", "people"])),
          children_count: int(pick(booking, ["children", "children_count", "kids"])),
          checkin,
          checkout,
          nights,
          price: num(pick(booking, ["price"])),
          total: num(pick(booking, ["total", "total_price", "amount"])),
          taxes: num(pick(booking, ["taxes", "tax"])),
          commission: num(pick(booking, ["commission"])),
          balance: num(pick(booking, ["balance", "due"])),
          status: str(pick(booking, ["status", "state"])),
          comment: str(pick(booking, ["comment", "notes", "remarks"])),
          raw_data: booking,
          synced_at: new Date().toISOString(),
        },
        { onConflict: "property_id,external_id" },
      );
      if (error) throw new Error(error.message);
      synced++;
    }

    await recordSync(supabase, channelId, null);
    return jsonResponse({ success: true, bookings_synced: synced }, corsHeaders);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (channelId) await recordSync(supabase, channelId, message);
    return jsonResponse({ success: false, error: message }, corsHeaders, 200);
  }
});
