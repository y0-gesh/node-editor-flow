import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NODE_TYPES } from "@/types/node-types";

interface NodeTypeSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function NodeTypeSelector({
  value = "load",
  onValueChange,
}: NodeTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="node-type">Node Type</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id="node-type">
          <SelectValue placeholder="Select node type" />
        </SelectTrigger>
        <SelectContent>
          {NODE_TYPES.map((type) => {
            const Icon = type.icon;
            return (
              <SelectItem key={type.value} value={type.value}>
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span>{type.label}</span>
                  <span className="text-xs text-muted-foreground">
                    ({type.category})
                  </span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
