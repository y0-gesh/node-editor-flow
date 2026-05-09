import { useState, useCallback, useEffect, useRef } from "react";
import { Node, ReactFlowInstance } from "@xyflow/react";
import { NodeTemplate } from "@/data/node-templates";
import { NewNodeData } from "@/types/node-types";

export interface PendingPlacement {
  type: "node" | "template";
  nodeType?: string;
  nodeData?: NewNodeData;
  template?: NodeTemplate;
}

export function useCursorPlacement() {
  const [isPlacing, setIsPlacing] = useState(false);
  const [pendingPlacement, setPendingPlacement] = useState<PendingPlacement | null>(null);
  const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number } | null>(null);
  const rfInstanceRef = useRef<ReactFlowInstance | null>(null);

  const startNodePlacement = useCallback((nodeType: string, nodeData: NewNodeData) => {
    setIsPlacing(true);
    setPendingPlacement({
      type: "node",
      nodeType,
      nodeData,
    });
  }, []);

  const startTemplatePlacement = useCallback((template: NodeTemplate) => {
    setIsPlacing(true);
    setPendingPlacement({
      type: "template",
      template,
    });
  }, []);

  const cancelPlacement = useCallback(() => {
    setIsPlacing(false);
    setPendingPlacement(null);
    setCursorPosition(null);
  }, []);

  const setReactFlowInstance = useCallback((instance: ReactFlowInstance | null) => {
    rfInstanceRef.current = instance;
  }, []);

  const updateCursorPosition = useCallback((clientX: number, clientY: number, reactFlowBounds: DOMRect) => {
    if (!rfInstanceRef.current) return;

    const position = rfInstanceRef.current.screenToFlowPosition({
      x: clientX - reactFlowBounds.left,
      y: clientY - reactFlowBounds.top,
    });

    setCursorPosition(position);
  }, []);

  // Handle Escape key to cancel placement
  useEffect(() => {
    if (!isPlacing) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        cancelPlacement();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isPlacing, cancelPlacement]);

  return {
    isPlacing,
    pendingPlacement,
    cursorPosition,
    startNodePlacement,
    startTemplatePlacement,
    cancelPlacement,
    setReactFlowInstance,
    updateCursorPosition,
  };
}



