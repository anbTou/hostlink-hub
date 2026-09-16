# NoBeds integration (first real channel connection)

Connect the app to NoBeds so real properties, rooms, bookings and guest messages flow into it, with a new Integrations page to manage the connection and a Inbox that shows the real messages.

## Decisions taken

- No login yet: one shared workspace. Everyone with the link sees the same connected channels and synced data. The NoBeds token itself is never sent to the browser — it stays server-side.
- The free read-only NoBeds demo token is used for testing. Sending a reply will be refused by NoBeds in demo mode; the app shows "Demo mode — sending messages is not available" instead of an error.
- The main Inbox switches to real synced messages once a channel is connected; mock conversations remain as a fallback when nothing is synced yet.

## Part 1 — Database

Five new tables, exactly as specified:

- `connected_channels` — provider, api token, label, active flag, last sync time, last sync error.
- `properties` — one row per NoBeds hotel, linked to a channel, unique per channel + external id.
- `rooms` — units per property, unique per property + external id.
- `bookings` — guest details, dates, nights, money fields, status, channel source, unique per property + external id.
- `messages` — guest message + host reply per record, linked to a booking when possible, unique per property + external id.

Every table keeps the full provider response in a `raw_data` field so extra fields stay available without schema changes. `organization_id` on `connected_channels` is kept as a nullable column so adding accounts later is a small change, not a rebuild.

Access rules for the shared-workspace mode: all five tables get row-level security enabled with open read/write policies, and the api token column is never selected by the browser — the connection list is read through a view/selection that excludes it. When login is added later, these policies get replaced with organisation-scoped ones.

## Part 2 — Server functions

Four server-side functions, each taking a `channel_id` and reading the token from the database (never from the browser):

1. `nobeds-sync-properties` — fetches Hotels then Rentals, upserts properties and rooms, updates last sync time, records any error.
2. `nobeds-sync-bookings` — fetches Bookings for a date range (default: last 90 days), maps the originating channel from the referral order id, links to the internal room when known, upserts bookings.
3. `nobeds-sync-messages` — fetches Messages, links each to its booking via the `rid` field, upserts messages.
4. `nobeds-send-reply` — posts a reply to NoBeds for one booking; on success stores the reply locally, on a demo-mode refusal returns a clear "demo mode" result instead of a raw error.

Channel-prefix mapping (BDC → Booking.com, AIR/HM → Airbnb, EXP → Expedia, AGO → Agoda, TRIP → Trip.com, otherwise direct) lives in one shared constant used by all functions, so it can be adjusted in a single place.

All functions answer browser preflight requests and return the same headers on success and error responses.

## Part 3 — Integrations page

New page at `/settings/channels`, added to the menu under Settings:

- **Connect a channel**: provider dropdown (NoBeds only for now), masked token field, friendly label, Connect button. On submit it saves the channel and immediately runs the property sync.
- **Connection status**: each connected channel with provider, label, last sync time, active/error state, a "Sync now" button that runs properties → bookings → messages in order with a progress indicator, and the last error in red when present.
- **Bookings view**: table of synced bookings — guest, channel badge (colour per channel), check-in, check-out, nights, total, status — with channel and status filters, newest check-in first.
- **Messages view**: conversations grouped by booking/guest showing guest name, channel and date; clicking one opens a side panel with the guest messages and host replies laid out as a timeline, plus a reply box that calls the send function.

## Part 4 — Main Inbox

Once messages are synced, the main Inbox reads them from the database instead of the mock list: each booking becomes a conversation with the guest's name, channel, property and booking dates, and the message timeline rebuilt from the guest/reply pairs ordered by time. Replies from the Inbox go through the same send function and show the demo-mode notice when applicable. Layout, filters, keyboard shortcuts and the compose area stay as they are.

## Technical notes

- Token stored in `connected_channels.api_token`, read only inside edge functions; the demo token is also saved as the secret `NOBEDS_DEMO_TOKEN` for seeding.
- NoBeds puts the token in the URL path (`/api/Bookings/{token}`), not a header — functions build the path accordingly.
- All upserts match on the unique pairs above, so repeated syncs are idempotent.
- Sync is manual (button) in this step; scheduling can be added later.
- Generated database types are refreshed after the migration, before the frontend work.

## Out of scope for now

- Accounts, organisations and per-organisation access rules.
- Automatic/scheduled syncing.
- Other providers (BookingSync, Beds24).
