import { useState, useCallback } from "react";
import { useWorkflow } from "@/context/workflow-context";
import { NewNodeData } from "@/types/node-types";
import { NODE_DEFAULTS } from "@/data/node-defaults";

export function useNodeCreation(
  startNodePlacement?: (nodeType: string, nodeData: NewNodeData) => void
) {
  const { addNode } = useWorkflow();
  const [isAddNodeOpen, setIsAddNodeOpen] = useState(false);
  const [newNodeData, setNewNodeData] = useState<NewNodeData>({
    type: "geometry",
    title: "Geometry",
    ...NODE_DEFAULTS.geometry,
  });

  const handleNodeDataChange = (data: NewNodeData) => {
    if (data.type && data.type !== newNodeData.type) {
      const defaults = NODE_DEFAULTS[data.type] || {};
      setNewNodeData({
        ...data,
        ...defaults,
        title: defaults.title || data.title,
      });
    } else {
      setNewNodeData(data);
    }
  };

  const handleAddNodeClick = useCallback(() => {
    setIsAddNodeOpen(true);
    setNewNodeData({
      type: "geometry",
      title: "Geometry",
      ...NODE_DEFAULTS.geometry,
    });
  }, []);

  const handleCreateNode = useCallback(() => {
    if (!newNodeData.title || !newNodeData.title.trim()) {
      // If title is missing or empty, use the default for the type or the type itself
      const defaultTitle = NODE_DEFAULTS[newNodeData.type || "geometry"]?.title || newNodeData.type || "geometry";
      const dataToPlace = { ...newNodeData, title: defaultTitle };
      if (startNodePlacement) {
        startNodePlacement(newNodeData.type || "geometry", dataToPlace);
        setIsAddNodeOpen(false);
      }
      return;
    }

    // If cursor placement is available, use it; otherwise use random position
    if (startNodePlacement) {
      startNodePlacement(newNodeData.type || "geometry", newNodeData);
      setIsAddNodeOpen(false);
    } else {
      const newNode = {
        id: `node_${Date.now()}`,
        type: newNodeData.type,
        position: {
          x: Math.random() * 400 + 100,
          y: Math.random() * 400 + 100,
        },
        data: {
          ...newNodeData,
        },
      };

      addNode(newNode);
      setIsAddNodeOpen(false);
    }
  }, [newNodeData, addNode, startNodePlacement]);

  const handleCloseDialog = useCallback(() => {
    setIsAddNodeOpen(false);
  }, []);

  return {
    isAddNodeOpen,
    setIsAddNodeOpen,
    newNodeData,
    setNewNodeData: handleNodeDataChange,
    handleAddNodeClick,
    handleCreateNode,
    handleCloseDialog,
  };
}
