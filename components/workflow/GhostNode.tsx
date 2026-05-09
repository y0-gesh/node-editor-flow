"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { PendingPlacement } from "@/hooks/useCursorPlacement";
import { FEM_NODE_TYPES } from "@/data/node-templates";
import { cn } from "@/lib/utils";

interface GhostNodeProps {
  pendingPlacement: PendingPlacement;
  position: { x: number; y: number };
}

export function GhostNode({ pendingPlacement, position }: GhostNodeProps) {
  const nodeInfo = useMemo(() => {
    if (pendingPlacement.type === "node" && pendingPlacement.nodeType && pendingPlacement.nodeData) {
      const nodeTypeInfo = FEM_NODE_TYPES.find(nt => nt.value === pendingPlacement.nodeType);
      return {
        title: pendingPlacement.nodeData.title || pendingPlacement.nodeType,
        type: pendingPlacement.nodeType,
        icon: nodeTypeInfo?.icon,
        category: pendingPlacement.nodeData.category || nodeTypeInfo?.category,
      };
    } else if (pendingPlacement.type === "template" && pendingPlacement.template) {
      const firstNode = pendingPlacement.template.nodes[0];
      if (!firstNode) return null;
      const nodeTypeInfo = FEM_NODE_TYPES.find(nt => nt.value === firstNode.type);
      return {
        title: pendingPlacement.template.name,
        type: firstNode.type,
        icon: pendingPlacement.template.icon,
        category: pendingPlacement.template.category,
        isTemplate: true,
      };
    }
    return null;
  }, [pendingPlacement]);

  if (!nodeInfo) return null;

  const Icon = nodeInfo.icon;

  return (
    <div
      className="pointer-events-none fixed z-9999"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div
        className={cn(
          "relative w-[280px] border-2 border-dashed rounded-lg bg-white/80 backdrop-blur-sm px-4 py-3 shadow-lg",
          "border-blue-400 opacity-60"
        )}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {Icon && (
              <div className="size-5 rounded-[5px] bg-blue-100 flex items-center justify-center text-blue-700 border border-blue-300">
                <Icon className="size-4" />
              </div>
            )}
            <div>
              <div className="font-semibold text-sm">
                {nodeInfo.title}
              </div>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="px-2 py-0.5 rounded-sm border-[#e5e6e9] opacity-80"
          >
            {nodeInfo.type}
          </Badge>
        </div>
        {nodeInfo.isTemplate && (
          <div className="text-xs text-muted-foreground mt-1 py-0.5">
            Template: {pendingPlacement.type === "template" && pendingPlacement.template?.nodes.length} nodes
          </div>
        )}
        <div className="absolute inset-0 bg-blue-200/10 rounded-lg" />
      </div>
    </div>
  );
}