# Wire up the AI Knowledge Base page

## Where it is now

The full AI Knowledge Base feature was built but never connected to the app:

- Page: `src/pages/AIKnowledge.tsx` (dashboard strip, property pills, collapsible sections, amenity grid, room tables, global rules, chatbot preview, regenerate, edit mode, draft auto-save)
- Data/logic: `src/types/ai-knowledge.ts`, `src/services/aiKnowledgeGenerator.ts`, `src/data/mockAiKnowledge.ts`
- Components: `src/components/ai-knowledge/` (SectionShell, AmenityGrid, RoomTables, ChatbotPreviewDialog, GlobalRulesTable, PropertyPills, AiFieldInput)

What is missing — the only reason you can't open it — is a route and a sidebar entry.

## Changes

1. **`src/App.tsx`** — add the route: `<Route path="/ai-knowledge" element={<AIKnowledge />} />` with the import.
2. **`src/components/layout/Sidebar.tsx`** — add an "AI Knowledge" item (Sparkles or Brain icon) to `navItems`, placed under "Knowledge Base", linking to `/ai-knowledge`. One entry in the array; no other sidebar changes.

## Verify

- Check the build log for errors.
- Open `/ai-knowledge` in the preview and confirm the page renders with the 3 mock properties and their completion badges.

No deployment. No other pages touched.
