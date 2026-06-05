# Data Architecture Plan — Hostsy Unified Inbox (Supabase)

Plan only. No code, no migrations, no deploy. This describes the target normalized schema, relationships, threading strategy, the channel-adapter layer, and where the scoped Knowledge Base plugs in.

## Design principles

- One **conversation** = one thread with one guest about one property; it aggregates messages from multiple channels.
- Channel-specific quirks live in an **adapter layer** (config + identity mapping), never in core tables.
- Everything user/agent-owned is protected by RLS; the Knowledge Base is layered by scope and resolved at read time.
- Standard fields on every table: `id uuid pk default gen_random_uuid()`, `created_at`, `updated_at` (trigger-maintained). These are omitted from the field lists below.

---

## Core tables

### 1. properties
Descriptive data synced from the PMS/Channel Manager (read-mostly).
- `name`, `internal_code`
- `type` (villa/apartment/studio/cabin/house…) — used by KB scoping
- `country` (ISO or name) — used by KB scoping
- `address`, `city`, `timezone`
- `status` (active/inactive)
- `pms_provider`, `pms_external_id` — link back to source system
- `last_synced_at`

### 2. guests
A person, deduplicated across channels.
- `display_name`, `email`, `phone`
- `preferred_language`
- `vip_status`, `total_stays`, `total_spent`, `member_since`
- `notes`

Because the same person appears under different identities per channel (Airbnb alias, Booking email, WhatsApp number), guest identities are normalized in a separate table:

### 3. guest_channel_identities  (threading key)
Maps an external channel handle to a single guest.
- `guest_id` → guests
- `channel` (enum: email, booking, airbnb, whatsapp, vrbo, expedia, sms…)
- `external_id` (the channel's user/thread identifier: email address, Airbnb thread user, phone number)
- `display_handle`
- UNIQUE (`channel`, `external_id`)
- Relationship: many identities → one guest. This is what lets messages from different channels resolve to the same guest.

### 4. bookings
- `property_id` → properties
- `guest_id` → guests
- `reservation_code`, `channel` (source OTA)
- `check_in`, `check_out`, `status` (upcoming/current/past/cancelled)
- `total_amount`, `currency`
- `pms_external_id`

### 5. conversations
The multi-channel thread.
- `guest_id` → guests
- `property_id` → properties (nullable until matched)
- `booking_id` → bookings (nullable, the linked reservation)
- `source_channel` (the channel the thread originated / primary channel)
- `assigned_agent_id` → team_members (nullable)
- `status` (enum: open / snoozed / resolved)
- `snoozed_until` (nullable)
- `priority` (low/medium/high/urgent)
- `last_activity_at`
- `subject` (optional, for email-style channels)
- `inbox_type` (main/private)
- `unread_count`
- Relationships: belongs to one guest; optionally one property + booking; optionally one assigned agent. Has many messages, has many tags (via join), has many assignment history rows.

### 6. messages
- `conversation_id` → conversations
- `direction` (enum: inbound / outbound)
- `channel` (the channel this specific message came in/went out on — can differ from conversation.source_channel)
- `sender_type` (guest / agent / ai / system)
- `sender_agent_id` → team_members (nullable, for outbound)
- `body` (text)
- `delivery_status` (enum: queued / sent / delivered / read / failed)
- `external_message_id` (channel's message id, for idempotency/sync)
- `sent_at` (channel timestamp), `received_at`
- `is_read`
- `original_language`, `translated_body` (nullable)
- Relationship: belongs to one conversation. Has many attachments.

### 7. attachments
- `message_id` → messages
- `name`, `mime_type`, `kind` (image/document/video), `url` (storage path), `size_bytes`

### 8. conversation_tags + tags  (optional normalization)
- `tags`: `name`, `color`
- `conversation_tags`: (`conversation_id`, `tag_id`) join, PK both.

---

## Team / scheduling tables

### 9. team_members
Profile data tied to an auth user (never FK directly into auth.users for app data; store `user_id uuid`).
- `user_id` (references the auth user id)
- `full_name`, `email`, `avatar_url`
- `role` (senior / support) — **note:** authorization roles for privilege checks should live in a separate `user_roles` table (see Security), not here
- `status` (active/inactive)
- `max_concurrent` (round-robin capacity)

### 10. shifts
- `team_member_id` → team_members
- `starts_at`, `ends_at`
- `shift_type` (day/night/on-call)
- `notes`

### 11. assignments
History/audit of who handled a conversation (the *current* assignee is denormalized onto `conversations.assigned_agent_id` for fast querying; this table is the log + supports round-robin).
- `conversation_id` → conversations
- `team_member_id` → team_members
- `assigned_by` (agent id or 'system' for round-robin)
- `assigned_at`, `unassigned_at` (nullable)
- `reason` (manual / round_robin / escalation / reassignment)

---

## Knowledge Base tables (scoped, consulted from a conversation)

### 12. knowledge_blocks
Mirrors the existing layered model (company → country → property-type → property).
- `title`, `category` (general/checkin/cancellation/extras/country/property-type)
- `scope_type` (enum: company / country / property-type / property)
- `scope_ref` (nullable): country name, property type, or `property_id` depending on scope_type
- `content` (rich text)
- `structured_data` (jsonb: checkin / cancellation / extras payloads)
- `overrides_id` → knowledge_blocks (self-FK, the parent this exception supersedes)
- `status` (active/draft/archived)
- `tags` (text[])

**How it connects to a conversation:** given a conversation's `property_id`, resolve the property's `type` and `country`, then select knowledge_blocks where:
`scope_type='company'` OR (`scope_type='country'` AND scope_ref=property.country) OR (`scope_type='property-type'` AND scope_ref=property.type) OR (`scope_type='property'` AND scope_ref=property.id),
filtered to `status='active'`, with the inheritance/override resolution (most-specific scope and `overrides_id` win). This is the existing `compileForProperty` logic, now backed by SQL instead of mock data. A DB view or RPC `kb_for_property(property_id)` can encapsulate it for the in-conversation side panel.

### 13. templates
Reusable canned replies.
- `name`, `body`, `category`
- `channel` (nullable — restrict to a channel or null for any)
- `scope_type` + `scope_ref` (optional, same scoping pattern as KB so templates can be company- or property-specific)
- `language`
- `variables` (jsonb: placeholders like {{guest_name}})

---

## Channel adapter layer (extensibility without touching core)

Goal: connecting a new OTA / channel manager later = inserting an adapter config row + an integration row, with zero changes to `conversations`/`messages`.

### 14. channels  (catalog)
- `key` (email, airbnb, booking, whatsapp, vrbo, expedia…)
- `display_name`, `icon`
- `supports_attachments`, `supports_read_receipts`, `direction_model` (two-way / inbound-only)

### 15. channel_accounts  (per-connected-integration)
- `channel_id` → channels
- `property_id` → properties (nullable; some accounts are global)
- `display_name` (e.g. "Airbnb – Lisbon portfolio")
- `status` (connected/disconnected/error)
- `adapter_config` (jsonb: endpoints, mailbox address, listing ids, webhook routing — channel-specific, opaque to core)
- `credentials_secret_ref` (name of the secret holding tokens — secrets never stored in the table)
- `last_sync_at`

**Adapter responsibilities (edge functions later, one per channel, sharing one interface):**
- Inbound: receive webhook/poll → normalize into `messages` (direction=inbound) + ensure a `guest_channel_identities` row → resolve/create the `conversation`.
- Outbound: take an internal `messages` row (direction=outbound, status=queued) → translate to the channel API → update `delivery_status` + `external_message_id`.
- The core app only ever reads/writes the normalized tables; each adapter implements the same contract. Adding a channel = new `channels` + `channel_accounts` rows + one adapter function.

---

## Threading strategy (different channels → one conversation)

On every inbound message:
1. Look up `guest_channel_identities` by (`channel`, `external_id`).
   - Found → use its `guest_id`. Not found → match by email/phone to an existing guest, else create a guest; then create the identity row.
2. Find an **open/snoozed** conversation for that `guest_id` + `property_id` (property derived from the channel account / booking).
   - Found → append the message (keeping the message's own `channel`).
   - Not found → create a new conversation (`source_channel` = this channel).
3. Optionally link `booking_id` by matching reservation code / dates.

Result: a single conversation can contain messages with mixed `channel` values, all tied to one guest, while each message preserves the channel it actually traveled on.

```text
guests ─< guest_channel_identities (channel,external_id)  ← threading key
  │
  └─< conversations >─ property ─(type,country)─> knowledge_blocks (scoped resolve)
        │   └─ booking
        └─< messages (direction, channel, delivery_status) ─< attachments
channels ─< channel_accounts (adapter_config, credentials_secret_ref)  → adapters write messages
team_members ─< shifts          team_members ─< assignments >─ conversations
```

---

## Relationships summary

- guests 1─* guest_channel_identities; guests 1─* conversations; guests 1─* bookings
- properties 1─* conversations; properties 1─* bookings; properties 1─* channel_accounts
- conversations 1─* messages; conversations *─1 bookings; conversations *─1 team_members (assignee); conversations 1─* assignments; conversations *─* tags
- messages 1─* attachments
- channels 1─* channel_accounts
- team_members 1─* shifts; team_members 1─* assignments
- knowledge_blocks self-ref via overrides_id; resolved against properties by scope
- templates scoped like knowledge_blocks

---

## Technical / security notes (for later implementation phase)

- **Auth & roles:** add a separate `app_role` enum + `user_roles` table with a `has_role()` security-definer function. Do NOT put authorization roles on `team_members`/profiles (privilege-escalation risk).
- **RLS:** enable on every table; authenticated team members read/write operational tables; KB readable by authenticated team; service_role for adapter edge functions.
- **GRANTs:** every new public table needs explicit GRANTs (anon excluded for this internal tool).
- **Enums:** model `conversation_status`, `message_direction`, `delivery_status`, `channel`, `scope_type`, `app_role` as Postgres enums for integrity.
- **Indexes:** `guest_channel_identities(channel, external_id)` unique; `messages(conversation_id, sent_at)`; `conversations(status, assigned_agent_id, last_activity_at)`; `messages(external_message_id)` for sync idempotency.
- **Realtime:** add `messages` and `conversations` to the realtime publication for live inbox updates.
- **Migration of mock data:** existing `mockProperties`, `mockKnowledge`, inbox mocks map cleanly onto these tables; the KB `compileForProperty` logic becomes an RPC/view.

This is the proposed model only — no schema has been created. On approval I can turn each table into migrations (with enums, RLS, GRANTs, indexes, and the KB resolver RPC) in a phased order: enums → core tables → team/scheduling → KB/templates → channel adapter layer → RLS/auth.