import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import {
  getChannel,
  int,
  jsonResponse,
  nobedsGet,
  num,
  pick,
  recordSync,
  serviceClient,
  str,
  toArray,
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

    const hotels = toArray(await nobedsGet(channel.api_token, "Hotels"));
    let propertyCount = 0;
    const propertyIdByExternal = new Map<number, string>();

    for (const hotel of hotels) {
      const externalId = int(pick(hotel, ["hotel_id", "id", "hotelId"]));
      if (externalId === null) continue;
      const { data, error } = await supabase
        .from("properties")
        .upsert(
          {
            channel_id: channelId,
            external_id: externalId,
            name: str(pick(hotel, ["name", "hotel_name", "title"])),
            email: str(pick(hotel, ["email"])),
            country: str(pick(hotel, ["country"])),
            city: str(pick(hotel, ["city", "town"])),
            address: str(pick(hotel, ["address"])),
            phone: str(pick(hotel, ["phone", "telephone"])),
            currency: str(pick(hotel, ["currency"])),
            website: str(pick(hotel, ["website", "url"])),
            coordinates: str(pick(hotel, ["coordinates", "coords", "location"])),
            raw_data: hotel,
          },
          { onConflict: "channel_id,external_id" },
        )
        .select("id, external_id")
        .single();
      if (error) throw new Error(error.message);
      propertyIdByExternal.set(externalId, data.id);
      propertyCount++;
    }

    // Fall back to already-synced properties so rooms can still be linked.
    if (propertyIdByExternal.size === 0) {
      const { data } = await supabase
        .from("properties")
        .select("id, external_id")
        .eq("channel_id", channelId);
      for (const row of data ?? []) propertyIdByExternal.set(row.external_id, row.id);
    }

    const rentals = toArray(await nobedsGet(channel.api_token, "Rentals"));
    let roomCount = 0;

    for (const rental of rentals) {
      const externalId = int(pick(rental, ["room_id", "id", "rental_id"]));
      const hotelExternalId = int(pick(rental, ["hotel_id", "hotelId"]));
      if (externalId === null) continue;
      const propertyId = hotelExternalId !== null
        ? propertyIdByExternal.get(hotelExternalId)
        : propertyIdByExternal.values().next().value;
      if (!propertyId) continue;

      const { error } = await supabase.from("rooms").upsert(
        {
          property_id: propertyId,
          external_id: externalId,
          name: str(pick(rental, ["name", "room_name", "title"])),
          capacity: int(pick(rental, ["capacity", "max_people", "persons", "guests"])),
          base_price: num(pick(rental, ["base_price", "price", "default_price"])),
          raw_data: rental,
        },
        { onConflict: "property_id,external_id" },
      );
      if (error) throw new Error(error.message);
      roomCount++;
    }

    await recordSync(supabase, channelId, null);
    return jsonResponse({ success: true, properties: propertyCount, rooms: roomCount }, corsHeaders);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (channelId) await recordSync(supabase, channelId, message);
    return jsonResponse({ success: false, error: message }, corsHeaders, 200);
  }
});
