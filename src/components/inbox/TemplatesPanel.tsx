import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface TemplatesPanelProps {
  onSelect: (template: string) => void;
  onClose: () => void;
}

const TEMPLATE_CATEGORIES = [
  {
    name: "Check-in",
    templates: [
      { title: "Check-in instructions", body: "Hi {{guest_name}},\n\nWelcome! Here are your check-in instructions for {{property_name}}.\n\nCheck-in date: {{checkin_date}}\n\nPlease let us know if you have any questions." },
      { title: "Early check-in", body: "Hi {{guest_name}},\n\nThank you for reaching out about early check-in at {{property_name}}. We'll do our best to accommodate your request and will confirm availability closer to your arrival date." },
    ],
  },
  {
    name: "Check-out",
    templates: [
      { title: "Check-out reminder", body: "Hi {{guest_name}},\n\nJust a friendly reminder that check-out from {{property_name}} is on {{checkout_date}}.\n\nPlease leave the keys on the kitchen counter. We hope you enjoyed your stay!" },
      { title: "Late check-out", body: "Hi {{guest_name}},\n\nWe can offer a late check-out until 1:00 PM at {{property_name}} on {{checkout_date}}. Would that work for you?" },
    ],
  },
  {
    name: "Amenities",
    templates: [
      { title: "WiFi details", body: "Hi {{guest_name}},\n\nHere are the WiFi details for {{property_name}}:\n\nNetwork: PropertyGuest\nPassword: Welcome2024\n\nEnjoy your stay!" },
      { title: "Amenities overview", body: "Hi {{guest_name}},\n\nThank you for your question! {{property_name}} includes the following amenities: fully equipped kitchen, washer/dryer, free parking, and high-speed WiFi.\n\nLet us know if you need anything else." },
    ],
  },
  {
    name: "Issues",
    templates: [
      { title: "Maintenance acknowledgement", body: "Hi {{guest_name}},\n\nThank you for letting us know about the issue at {{property_name}}. We've contacted our maintenance team and someone will be there within the next 2 hours.\n\nWe apologize for any inconvenience." },
      { title: "Issue resolved", body: "Hi {{guest_name}},\n\nWe wanted to let you know that the issue you reported at {{property_name}} has been resolved. Please let us know if everything is working properly now." },
    ],
  },
  {
    name: "Payments",
    templates: [
      { title: "Payment received", body: "Hi {{guest_name}},\n\nWe've received your payment for {{property_name}}. Your reservation is confirmed for {{checkin_date}} to {{checkout_date}}.\n\nThank you!" },
      { title: "Refund processed", body: "Hi {{guest_name}},\n\nYour refund has been processed and should appear in your account within 5-10 business days.\n\nPlease let us know if you have any questions." },
    ],
  },
  {
    name: "General",
    templates: [
      { title: "Thank you", body: "Hi {{guest_name}},\n\nThank you for choosing {{property_name}}! We hope you had a wonderful stay and would love to host you again in the future.\n\nBest regards" },
      { title: "Directions", body: "Hi {{guest_name}},\n\nHere are the directions to {{property_name}}:\n\n[Add directions here]\n\nFeel free to reach out if you have trouble finding the place!" },
    ],
  },
];

export function TemplatesPanel({ onSelect, onClose }: TemplatesPanelProps) {
  const [activeCategory, setActiveCategory] = useState(TEMPLATE_CATEGORIES[0].name);
  const category = TEMPLATE_CATEGORIES.find(c => c.name === activeCategory)!;

  return (
    <div className="border-t border-border bg-muted/30">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <span className="text-xs font-medium text-foreground">Message Templates</span>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="flex">
        {/* Category tabs */}
        <div className="w-[120px] shrink-0 border-r border-border p-1.5 space-y-0.5">
          {TEMPLATE_CATEGORIES.map(cat => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={cn(
                "w-full text-left text-[11px] px-2 py-1.5 rounded-md transition-colors",
                activeCategory === cat.name
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Templates list */}
        <ScrollArea className="flex-1 max-h-[200px]">
          <div className="p-2 space-y-1.5">
            {category.templates.map((tmpl, i) => (
              <button
                key={i}
                onClick={() => onSelect(tmpl.body)}
                className="w-full text-left p-2.5 rounded-md hover:bg-muted/80 transition-colors group"
              >
                <div className="text-xs font-medium text-foreground">{tmpl.title}</div>
                <div className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">{tmpl.body}</div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
