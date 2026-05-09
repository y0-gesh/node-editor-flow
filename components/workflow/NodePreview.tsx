import { NODE_TYPES } from "@/types/node-types";
import { NewNodeData } from "@/types/node-types";

interface NodePreviewProps {
  data: NewNodeData;
}

export function NodePreview({ data }: NodePreviewProps) {
  const selectedNodeType = NODE_TYPES.find((t) => t.value === data.type);

  if (!selectedNodeType) return null;

  const Icon = selectedNodeType.icon;

  return (
    <div className="p-4 bg-gray-50 rounded-lg border">
      <div className="text-xs font-medium text-muted-foreground mb-2">Preview</div>
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-blue-600" />
        <div className="flex-1">
          <div className="font-medium text-sm">
            {data.title || "Untitled Node"}
          </div>
          {data.description && (
            <div className="text-xs text-muted-foreground mt-0.5">
              {data.description}
            </div>
          )}
        </div>
        <div className="text-xs px-2 py-1 bg-gray-200 rounded">
          {selectedNodeType.label}
        </div>
      </div>
    </div>
  );
}