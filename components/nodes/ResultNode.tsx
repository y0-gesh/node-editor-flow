import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { GroupContextMenu } from "../GroupContextMenu";

const ResultNode = memo(({ id, data, selected }: NodeProps) => {
  return (
    <GroupContextMenu nodeId={id} isGroup={data.isGroup}>
      <div
        className={cn(
          "relative w-[280px] border rounded-lg bg-[#fefefe] border-[#e5e6e9] px-4 py-3 shadow-md",
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
              <BarChart3 className="size-4" />
            </div>
            <div>
              <div className="font-semibold text-sm">
                {data.title || "Results"}
              </div>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="px-2 py-0.5 rounded-sm border-[#e5e6e9]"
          >
            Result
          </Badge>
        </div>
        <Separator />
        <div className="text-xs font-medium text-muted-foreground mt-1 py-0.5">
          Simulation Output
        </div>

        <div className="text-xs mt-2 space-y-1">
          {data.displacement && (
            <div className="flex items-center justify-between p-1.5 bg-gray-50 rounded">
              <span className="text-gray-600">Displacement</span>
              <span className="text-green-600 font-medium">✓</span>
            </div>
          )}
          {data.stress && (
            <div className="flex items-center justify-between p-1.5 bg-gray-50 rounded">
              <span className="text-gray-600">Stress</span>
              <span className="text-green-600 font-medium">✓</span>
            </div>
          )}
          {data.strain && (
            <div className="flex items-center justify-between p-1.5 bg-gray-50 rounded">
              <span className="text-gray-600">Strain</span>
              <span className="text-green-600 font-medium">✓</span>
            </div>
          )}
          {data.vonMises && (
            <div className="flex items-center justify-between p-1.5 bg-gray-50 rounded">
              <span className="text-gray-600">Von Mises</span>
              <span className="text-green-600 font-medium">✓</span>
            </div>
          )}
        </div>
      </div>
    </GroupContextMenu>
  );
});

ResultNode.displayName = "ResultNode";

export default ResultNode;
