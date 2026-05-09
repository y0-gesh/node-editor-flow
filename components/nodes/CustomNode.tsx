"use client";

import { Handle, Position, NodeProps } from "@xyflow/react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FileSearchCorner, Plus } from "lucide-react";
import React from "react";
import { Separator } from "../ui/separator";
import { useWorkflow } from "@/context/workflow-context";
import { NewNodeData } from "@/types/node-types";
import { NODE_TEMPLATES } from "@/data/node-templates";
import { GroupContextMenu } from "../GroupContextMenu";

export default function CustomNode({
  id,
  data,
  selected,
}: NodeProps<NewNodeData>) {
  const { edges, addNodeAndEdge, nodes } = useWorkflow();
  const isSourceConnected = edges.some((edge) => edge.source === id);

  const handleAddNode = () => {
    const sourceNode = nodes.find((n) => n.id === id);
    if (!sourceNode) return;

    const newNodeId = `node_${Date.now()}`;

    const template = NODE_TEMPLATES["geometry"]; // or any default logic

    const newNode = {
      id: newNodeId,
      type: template.type,
      position: {
        x: sourceNode.position.x,
        y: sourceNode.position.y + (sourceNode.height ?? 100) + 60,
      },
      data: {
        ...template,
      },
    };

    addNodeAndEdge(newNode, id);
  };
  return (
    <GroupContextMenu nodeId={id} isGroup={data.isGroup}>
    <div
      className={cn(
        "relative w-[280px] border rounded-b-xl rounded-t-0 rounded-tr-xl bg-[#fefefe] border-[#e5e6e9] px-4 py-3",
        !data.category && "rounded-tl-xl",
        selected && "border-blue-500 shadow-[0_0_0_2px_rgba(59,130,246,0.4)]"
      )}
    >
      {data.category && (
        <div className="absolute -top-6 left-0">
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-t-sm bg-primary/95 text-muted border border-b-0 border-[#e5e6e9]">
            {data.category}
          </span>
        </div>
      )}

      {/* Core row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          {/* Icon */}
          <div className="size-4 rounded-sm bg-blue-600 flex items-center justify-center text-white text-xs">
            {data.icon || <FileSearchCorner />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm">{data.title}</div>
          </div>
        </div>

        <Badge
          variant="secondary"
          className="text-[10px] font-medium px-2 py-0.5 rounded-sm border-[#e5e6e9]"
        >
          {data.type}
        </Badge>
      </div>
      <Separator />
      <div className="text-xs text-muted-foreground mt-1 py-0.5">
        {data.description || "No description"}
      </div>

      {/* SOURCE HANDLE — bottom center */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="size-3! bg-transparent! border border-blue-400! rounded-full"
      />

      {/* THE BLUE + BUTTON (floating above handle) */}
      {!isSourceConnected && (
        <div
          className="absolute left-1/2 -bottom-10 -translate-x-1/2 z-10"
          onClick={handleAddNode}
        >
          <div className="size-5 rounded-full bg-blue-600 flex items-center justify-center shadow cursor-pointer">
            <Plus size={16} className="text-white" />
          </div>
        </div>
      )}

      {/* TARGET HANDLE — top center (hidden unless needed) */}
      <Handle
        type="target"
        position={Position.Top}
        className="size-3! bg-transparent! border border-blue-400! rounded-full"
      />
    </div>
    </GroupContextMenu>
  );
}
