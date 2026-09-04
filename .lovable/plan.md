# AI Knowledge Base

A new section that compiles Property Info + Knowledge Base into standardized, chatbot-ready cards, editable by the property manager. Frontend-only with mock data, matching the existing Hostsy orange styling.

## Navigation

New sidebar item "AI Knowledge Base" with a sparkle icon, directly under "Knowledge Base", on a new `/ai-knowledge` page. This is the one sidebar change (adding a list entry); layout and every other page stay untouched.

## Page layout

Top dashboard strip: title, "Add Property Card" button, property count, average completion, and a per-property completion chip (green ≥90%, yellow 50–89%, red <50%). Clicking a chip selects that property below.

Then two tabs: **Property Cards** and **Global Rules**.

### Property Cards

- Horizontal property pills (same look as Property Info) with search and a small completion percentage badge on each pill.
- Status bar for the selected property: fields filled / total, missing count, last generated time, plus three actions:
  - **Regenerate from sources** — confirmation dialog, refills auto fields, preserves manual edits.
  - **Edit mode** — toggles read-only vs editable inputs.
  - **Preview as chatbot** — modal with the clean structured payload the AI would receive.
- Eight collapsible sections (open/closed state remembered per browser):
  1. Basic property information (name, reference, address, country, type, description, area, floors, floor location for apartments, max guests)
  2. Bedrooms & bathrooms — repeatable rows with add/remove, auto-calculated totals
  3. Amenities — grouped grid (Outdoor & Leisure, Climate & Comfort, Appliances, Entertainment, Building & Access) with Yes/No toggle plus a details field required when Yes; supports custom amenities
  4. WiFi & connectivity (network, masked password with show toggle, coverage, speed)
  5. Check-in & check-out — shows which scope each value was inherited from, with a link back to the source rule in the Knowledge Base
  6. House rules (pets, smoking, events, quiet hours, extra rules)
  7. Property description for chatbot (short description, selling points, warnings, neighbourhood)
  8. Chatbot guardrails (booking confirmation, access code sharing, pricing, discounts, escalation topics, tone, language, fallback message)
- Field styling by state: auto-filled = light blue with a source tooltip; manually edited = white with an "edited" badge and "Reset to auto"; missing mandatory = light red with "Required — fill this field".
- Auto-save draft every 30 seconds while editing, with a "Draft saved" indicator.

### Global Rules

Sub-tabs **Company Rules** and **Country Rules** (country picker on the second). Each is a table of compiled rules: category, summary, status, source link back to the Knowledge Base. Rows expand to full content, and each has an editable AI-facing summary override plus a "Chatbot instruction" field.

## Mock data

Complete cards for the three existing properties at the target completion levels: Villa Serenity 87%, Downtown Apartment 72%, Mountain Cabin 54% — with the specific gaps described (missing emergency contact / neighbourhood on the villa, missing amenity details and arrival instructions on the apartment, missing WiFi, check-in and guardrails on the cabin).

## Technical notes

- New types in `src/types/ai-knowledge.ts`: every field stored as `{ value, source: 'auto' | 'manual', autoSourceRef, updatedAt }`; card state kept as one object saved as a whole.
- New mock file `src/data/mockAiKnowledge.ts`, a generator in `src/services/aiKnowledgeGenerator.ts` that maps Property Info fields and `compileForProperty()` output into the standard fields without overwriting manual entries, and a completion calculator over mandatory fields.
- Components under `src/components/ai-knowledge/` (property pills, status bar, section shell, field wrapper, amenity grid, repeatable tables, chatbot preview modal, global rules table); page at `src/pages/AIKnowledge.tsx`; route added in `App.tsx`.
- Existing Knowledge Base and Property Info pages, shared helpers, and the layout are read from but not modified; `compileForProperty` is reused as-is. Responsive: sections stack and tables become cards on narrow screens. No deploy.
