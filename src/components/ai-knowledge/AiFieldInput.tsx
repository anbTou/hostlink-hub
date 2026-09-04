import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, RotateCcw, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { AiField, FieldDef } from "@/types/ai-knowledge";

interface Props {
  def: FieldDef;
  field?: AiField;
  editing: boolean;
  masked?: boolean;
  onChange: (value: string) => void;
  onReset: () => void;
}

export function AiFieldInput({ def, field, editing, masked, onChange, onReset }: Props) {
  const [reveal, setReveal] = useState(false);
  const value = field?.value ?? "";
  const missing = !!def.required && !value.trim();
  const isManual = field?.source === "manual";

  const tone = missing
    ? "bg-red-50 border-red-200"
    : isManual
    ? "bg-card border-border"
    : "bg-blue-50/70 border-blue-100";

  const display = masked && !reveal && value ? "•".repeat(Math.min(value.length, 12)) : value;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 flex-wrap">
        <label className="text-xs font-medium text-muted-foreground">
          {def.label}
          {def.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        {!isManual && field?.autoSourceRef && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3 w-3 text-blue-500" />
            </TooltipTrigger>
            <TooltipContent>Auto-filled from {field.autoSourceRef}</TooltipContent>
          </Tooltip>
        )}
        {isManual && (
          <span className="text-[10px] rounded-full bg-orange-100 text-orange-700 px-1.5 py-0.5 font-medium">
            edited
          </span>
        )}
        {isManual && editing && (
          <Button
            variant="ghost"
            size="sm"
            className="h-5 px-1.5 text-[10px] text-muted-foreground"
            onClick={onReset}
          >
            <RotateCcw className="h-3 w-3 mr-1" /> Reset to auto
          </Button>
        )}
        {masked && value && (
          <Button
            variant="ghost"
            size="sm"
            className="h-5 px-1.5 text-[10px] text-muted-foreground"
            onClick={() => setReveal((r) => !r)}
          >
            {reveal ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          </Button>
        )}
      </div>

      {editing ? (
        def.type === "textarea" ? (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={def.placeholder ?? (missing ? "Required — fill this field" : "")}
            className={cn("min-h-[72px] text-sm", tone)}
          />
        ) : (
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={def.placeholder ?? (missing ? "Required — fill this field" : "")}
            className={cn("h-9 text-sm", tone)}
          />
        )
      ) : (
        <div
          className={cn(
            "rounded-md border px-3 py-2 text-sm whitespace-pre-wrap min-h-9",
            tone,
            missing && "text-red-600"
          )}
        >
          {missing ? "Required — fill this field" : display || "—"}
        </div>
      )}
    </div>
  );
}
