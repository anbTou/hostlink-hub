import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronDown, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlobalRule } from "@/types/ai-knowledge";
import { CATEGORY_LABELS, KnowledgeCategory } from "@/types/knowledge";

interface Props {
  rules: GlobalRule[];
  onChange: (id: string, patch: Partial<GlobalRule>) => void;
}

export function GlobalRulesTable({ rules, onChange }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (!rules.length) {
    return (
      <Card className="p-8 text-center text-sm text-muted-foreground">
        No rules compiled for this scope yet.
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {rules.map((rule) => {
        const open = expanded === rule.id;
        return (
          <Card key={rule.id} className="overflow-hidden shadow-sm">
            <button
              className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-muted/50"
              onClick={() => setExpanded(open ? null : rule.id)}
              aria-expanded={open}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] rounded-full bg-secondary px-2 py-0.5 text-muted-foreground">
                    {CATEGORY_LABELS[rule.category as KnowledgeCategory] ?? rule.category}
                  </span>
                  <span className="text-sm font-medium">{rule.title}</span>
                  <span
                    className={cn(
                      "text-[11px] rounded-full px-2 py-0.5 capitalize",
                      rule.status === "active"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    )}
                  >
                    {rule.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{rule.summary}</p>
              </div>
              <ChevronDown
                className={cn("h-4 w-4 mt-1 text-muted-foreground transition-transform", open && "rotate-180")}
              />
            </button>

            {open && (
              <div className="border-t border-border/60 px-4 py-3 space-y-3">
                <p className="text-sm whitespace-pre-wrap">{rule.content}</p>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    AI-facing summary override
                  </label>
                  <Textarea
                    value={rule.summary}
                    onChange={(e) => onChange(rule.id, { summary: e.target.value })}
                    className="min-h-[64px] text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Chatbot instruction
                  </label>
                  <Textarea
                    value={rule.chatbotInstruction}
                    onChange={(e) => onChange(rule.id, { chatbotInstruction: e.target.value })}
                    placeholder="How the assistant should apply this rule when talking to guests"
                    className="min-h-[64px] text-sm"
                  />
                </div>

                <Button variant="ghost" size="sm" asChild className="text-xs">
                  <Link to="/knowledge">
                    <ExternalLink className="h-3.5 w-3.5 mr-1" /> Open source rule in Knowledge Base
                  </Link>
                </Button>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
