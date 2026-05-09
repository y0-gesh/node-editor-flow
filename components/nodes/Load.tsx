import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Badge } from "@/components/ui/badge";
import { Zap, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkflow } from "@/context/workflow-context";
import { Separator } from "../ui/separator";
import { GroupContextMenu } from "../GroupContextMenu";

const LoadNode = memo(({ id, data, selected }: NodeProps) => {
  const { edges, addNodeAndEdge, nodes } = useWorkflow();
  const isSourceConnected = edges.some((edge) => edge.source === id);

  const handleAddNode = () => {
    const sourceNode = nodes.find((n) => n.id === id);
    if (sourceNode) {
      const newNode = {
        id: `node_${Date.now()}`,
        type: "solver",
        position: {
          x: sourceNode.position.x,
          y: sourceNode.position.y + 220,
        },
        data: {
          title: "Solver",
          type: "solver",
        },
      };
      addNodeAndEdge(newNode, id);
    }
  };

  return (
    <GroupContextMenu nodeId={id} isGroup={data.isGroup}>
      <div
        className={cn(
          "relative w-[280px] border rounded-lg bg-[#fefefe] border-[#e5e6e9] px-4 py-3 shadow-md group",
          selected && "border-blue-500 shadow-[0_0_0_2px_rgba(59,130,246,0.4)]"
        )}
      >
        <Handle
          type="target"
          position={Position.Top}
          className="bg-transparent! border border-blue-400! !w-3 !h-3"
        />

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="size-5 rounded-[5px] bg-blue-100 flex items-center justify-center text-blue-700 border border-blue-300">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-sm">{data.name || "Load"}</div>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="px-2 py-0.5 rounded-sm border-[#e5e6e9]"
          >
            Load
          </Badge>
        </div>
        <Separator />
        <div className="text-xs font-medium text-muted-foreground mt-1 space-x-1 py-0.5">
          <span>Type:</span>
          <span>
          {data.type || "Force"}
          </span>
        </div>
        <div className="text-xs font-medium text-muted-foreground space-x-1 py-0.5">
          <span>Assigned Region:</span>
          <span>{data.assigned || "Domain"}</span>
        </div>
        {(data.FX !== undefined ||
          data.FY !== undefined ||
          data.FZ !== undefined) && (
          <div className="text-xs mt-2 rounded-xs flex flex-row gap-1">
            <div className="p-1.5 flex gap-2 flex-col flex-1 items-center bg-gray-50 rounded text-center">
              <div className="text-gray-600">FX</div>
              <div className="font-medium">{data.FX ?? 0}</div>
            </div>
            <div className="p-1.5 flex gap-2 flex-col flex-1 items-center bg-gray-50 rounded text-center">
              <div className="text-gray-600">FY</div>
              <div className="font-medium">{data.FY ?? 0}</div>
            </div>
            <div className="p-1.5 flex gap-2 flex-col flex-1 items-center bg-gray-50 rounded text-center">
              <div className="text-gray-600">FZ</div>
              <div className="font-medium">{data.FZ ?? 0}</div>
            </div>
          </div>
        )}

        <Handle
          type="source"
          position={Position.Bottom}
          className="bg-transparent! border border-blue-400! !w-3 !h-3"
        />

        {!isSourceConnected && (
          <div
            className="absolute left-1/2 -bottom-10 -translate-x-1/2 z-10    opacity-0 group-hover:opacity-100 transition-opacity duration-150
      cursor-pointer"
            onClick={handleAddNode}
          >
            <div className="size-5 rounded-full bg-blue-600 flex items-center justify-center shadow cursor-pointer">
              <Plus size={16} className="text-white" />
            </div>
          </div>
        )}
      </div>
    </GroupContextMenu>
  );
});

LoadNode.displayName = "LoadNode";

export default LoadNode;
