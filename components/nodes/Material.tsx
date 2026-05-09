import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Badge } from "@/components/ui/badge";
import { Layers, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkflow } from "@/context/workflow-context";
import { Separator } from "../ui/separator";
import { GroupContextMenu } from "../GroupContextMenu";

type MaterialNodeData = {
  name?: string;
  type?: string;
  E?: number;
  nu?: number;
  massDensity?: number;
  assigned?: string;
  isGroup?: boolean;
};

const MaterialNode = memo(({ id, data, selected }: NodeProps) => {
  const { edges, addNodeAndEdge, nodes } = useWorkflow();
  const materialData = data as MaterialNodeData;
  const isSourceConnected = edges.some((edge) => edge.source === id);
  const massDensityValue =
    typeof materialData.massDensity === "number" ? materialData.massDensity : undefined;

  const handleAddNode = () => {
    const sourceNode = nodes.find((n) => n.id === id);
    if (sourceNode) {
      const newNode = {
        id: `node_${Date.now()}`,
        type: "boundaryCondition",
        position: {
          x: sourceNode.position.x,
          y: sourceNode.position.y + 120,
        },
        data: {
          title: "Boundary Condition",
          category: "Constraint",
          type: "boundaryCondition",
        },
      };
      addNodeAndEdge(newNode, id);
    }
  };

  return (
    <GroupContextMenu nodeId={id} isGroup={materialData.isGroup}>
      <div
        className={cn(
          "relative w-[280px] border rounded-lg bg-[#fefefe] border-[#e5e6e9] px-4 py-3 shadow-md group",
          selected && "border-blue-500 shadow-[0_0_0_2px_rgba(59,130,246,0.4)]"
        )}
      >
        <Handle
          type="target"
          position={Position.Top}
          className="bg-transparent! border border-blue-400! w-3! h-3!"
        />

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="size-5 rounded-[5px] bg-blue-100 flex items-center justify-center text-blue-700 border border-blue-300">
              <Layers className="size-4" />
            </div>
            <div>
              <div className="font-semibold text-sm">
                {materialData.name || "Material"}
              </div>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="px-2 py-0.5 rounded-sm border-[#e5e6e9]"
          >
            Material
          </Badge>
        </div>
        <Separator />
        <div className="text-xs text-muted-foreground font-medium mt-1 space-x-1 py-0.5">
          <span>Type:</span>
          <span>{materialData.type || "Linear Elastic"}</span>
        </div>
        <div className="text-xs text-muted-foreground font-medium mt-1 space-x-1 py-0.5">
          <span>Assign Region:</span>
          <span>{materialData.assigned || "Linear Elastic"}</span>
        </div>

        {(typeof materialData.E === "number" || typeof materialData.nu === "number") && (
          <div className="text-xs mt-2 space-y-1">
            {typeof materialData.E === "number" && (
              <div className="flex justify-between p-1.5 bg-gray-50 rounded">
                <span className="text-gray-600">Young&apos;s Modulus:</span>
                <span className="font-medium">{materialData.E} GPa</span>
              </div>
            )}
            {typeof materialData.nu === "number" && (
              <div className="flex justify-between p-1.5 bg-gray-50 rounded">
                <span className="text-gray-600">Poisson&apos;s Ratio:</span>
                <span className="font-medium">{materialData.nu}</span>
              </div>
            )}
          </div>
        )}
        <div className="text-xs">
          {typeof massDensityValue === "number" && (
            <div className="flex justify-between p-1.5 bg-gray-50 rounded">
              <span className="text-gray-600">Mass Density:</span>
              <span className="font-medium">{massDensityValue}</span>
            </div>
          )}
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          className="bg-transparent! border border-blue-400! w-3! h-3!"
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

MaterialNode.displayName = "MaterialNode";

export default MaterialNode;
