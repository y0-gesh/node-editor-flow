import { memo } from "react";
import { NodeProps } from "@xyflow/react";
import { Package } from "lucide-react";
import { GroupContextMenu } from "../GroupContextMenu";

const GroupNode = memo(({ id, data, selected }: NodeProps) => {
  return (
    <GroupContextMenu nodeId={id} isGroup={true}>
      <div
        className={`size-full relative bg-blue-100/50 rounded-lg border ${
          selected ? "border-blue-600" : "border-blue-300"
        } `}
      >
        {/* Group Header */}
        <div className="absolute -top-12 -left-4 flex items-center gap-2 bg-primary-foreground px-3 py-1.5 rounded-md shadow-sm ">
          <Package className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-primary">
            {data.label || "Group"}
          </span>
          <span className="text-xs text-gray-500">
            ({data.nodeIds?.length || 0} nodes)
          </span>
        </div>

        {/* Right-click hint */}
        {selected && (
          <div className="absolute -top-12 -right-4 text-xs text-muted-foreground bg-primary-foreground px-2 py-1 rounded shadow z-10">
            Right-click for options
          </div>
        )}
      </div>
    </GroupContextMenu>
  );
});

GroupNode.displayName = "GroupNode";
export default GroupNode;
