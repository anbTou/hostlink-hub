import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import {
  getChannel,
  jsonResponse,
  NOBEDS_BASE_URL,
  serviceClient,
} from "../_shared/nobeds.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = serviceClient();

  try {
    const body = await req.json().catch(() => ({}));
    const channelId = typeof body?.channel_id === "string" ? body.channel_id : null;
    const bookingExternalId = Number(body?.booking_external_id);
    const reply = typeof body?.reply === "string" ? body.reply.trim() : "";

    if (!channelId) throw new Error("channel_id is required");
    if (!Number.isFinite(bookingExternalId)) throw new Error("booking_external_id is required");
    if (!reply) throw new Error("reply text is required");

    const channel = await getChannel(supabase, channelId);

    const res = await fetch(`${NOBEDS_BASE_URL}/Messages/${channel.api_token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ rid: bookingExternalId, reply }),
    });
    const text = await res.text();

    if (res.status === 401 || res.status === 403) {
      return jsonResponse(
        {
          success: false,
          demo_mode: true,
          error: "Demo mode — sending messages is not available with a read-only token.",
        },
        corsHeaders,
      );
    }

    if (!res.ok) {
      return jsonResponse(
        { success: false, error: `NoBeds responded ${res.status}: ${text.slice(0, 300)}` },
        corsHeaders,
      );
    }

    // Store the reply locally on the matching message row.
    const { data: booking } = await supabase
      .from("bookings")
      .select("id, property_id")
      .eq("external_id", bookingExternalId)
      .maybeSingle();

    if (booking) {
      const { data: existing } = await supabase
        .from("messages")
        .select("id")
        .eq("booking_id", booking.id)
        .is("host_reply", null)
        .order("sent_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("messages")
          .update({ host_reply: reply, is_read: true })
          .eq("id", existing.id);
      } else {
        await supabase.from("messages").insert({
          property_id: booking.property_id,
          booking_id: booking.id,
          external_id: Math.floor(Date.now() / 1000),
          host_reply: reply,
          sent_at: new Date().toISOString(),
          is_read: true,
          raw_data: { local: true },
        });
      }
    }

    return jsonResponse({ success: true }, corsHeaders);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return jsonResponse({ success: false, error: message }, corsHeaders, 200);
  }
});
