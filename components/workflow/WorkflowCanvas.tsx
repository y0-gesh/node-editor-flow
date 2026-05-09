"use client";

import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { useWorkflow } from "@/context/workflow-context";
import {
  Background,
  ReactFlow,
  Node,
  NodeTypes,
  ReactFlowInstance,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useNodeCreation } from "@/hooks/useNodeCreation";
import { useCursorPlacement } from "@/hooks/useCursorPlacement";
import { AddNodeDialog } from "./AddNodeDialog";
import { WorkflowControls } from "./WorkflowControls";
import { GhostNode } from "./GhostNode";
import CustomNode from "../nodes/CustomNode";
import Material from "../nodes/Material";
import BoundaryCondition from "../nodes/Boundary";
import Geometry from "../nodes/Geometry";
import Load from "../nodes/Load";
import Solver from "../nodes/Solver";
import ResultNode from "../nodes/ResultNode";
import GroupNode from "../nodes/GroupNode";
import { buildStudyConfigFromGroup } from "@/utils/export-utils";

const VIEWPORT_KEY = "fem-workflow-viewport";
const proOptions = { hideAttribution: true };

type InteractionMode = "pointer" | "drag" | "default";

export function WorkflowCanvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodesDelete,
    setSelectedNode,
    saveToServer,
    restoreFromLocalStorage,
    groupNodes,
    addNode,
    addTemplate,
    saveToLocalStorage,
  } = useWorkflow();

  const {
    isPlacing,
    pendingPlacement,
    cursorPosition,
    startNodePlacement,
    startTemplatePlacement,
    cancelPlacement,
    setReactFlowInstance,
    updateCursorPosition,
  } = useCursorPlacement();

  const {
    isAddNodeOpen,
    setIsAddNodeOpen,
    newNodeData,
    setNewNodeData,
    handleAddNodeClick,
    handleCreateNode,
  } = useNodeCreation(startNodePlacement);

  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const { setViewport } = useReactFlow();

  const [interactionMode, setInteractionMode] =
    useState<InteractionMode>("default");
  const isDragMode = interactionMode === "drag";
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const canGroupSelection = selectedNodeIds.length >= 2;
  const canExportGroup = Boolean(selectedGroupId);

  useEffect(() => {
    restoreFromLocalStorage();

    try {
      const viewportData = localStorage.getItem(VIEWPORT_KEY);
      if (viewportData) {
        const viewport = JSON.parse(viewportData);
        setViewport(viewport);
      }
    } catch (error) {
      console.error("Failed to restore viewport:", error);
    }
  }, [restoreFromLocalStorage, setViewport]);

  // Set React Flow instance in cursor placement hook
  useEffect(() => {
    if (rfInstance) {
      setReactFlowInstance(rfInstance);
    }
  }, [rfInstance, setReactFlowInstance]);

  const saveViewport = useCallback(() => {
    if (rfInstance) {
      const viewport = rfInstance.getViewport();
      try {
        localStorage.setItem(VIEWPORT_KEY, JSON.stringify(viewport));
      } catch (error) {
        console.error("Failed to save viewport:", error);
      }
    }
  }, [rfInstance]);

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      // If we're in placement mode, don't select nodes - let the pane click handle placement
      if (isPlacing) {
        return;
      }
      
      setSelectedNode(node);
      setSelectedGroupId(node.type === "group" ? node.id : null);
    },
    [isPlacing, setSelectedNode]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (!rfInstance || !reactFlowWrapper.current) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      rfInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
    },
    [rfInstance]
  );

  const nodeTypes = useMemo<NodeTypes>(
    () =>
      ({
        geometry: Geometry,
        material: Material,
        boundaryCondition: BoundaryCondition,
        load: Load,
        solver: Solver,
        simulationSetup: CustomNode,
        result: ResultNode,
        group: GroupNode,
      }) as NodeTypes,
    []
  );

  const onNodeDragStop = useCallback(() => {
    setTimeout(() => {
      saveViewport();
    }, 100);
  }, [saveViewport]);

  const onMoveEnd = useCallback(() => {
    saveViewport();
  }, [saveViewport]);

  const onSelectionChange = useCallback(
    ({ nodes: selectedNodes }: { nodes: Node[] }) => {
      setSelectedNodeIds(selectedNodes.map((node) => node.id));

      if (selectedNodes.length === 1) {
        setSelectedNode(selectedNodes[0]);
        setSelectedGroupId(
          selectedNodes[0].type === "group" ? selectedNodes[0].id : null
        );
      } else {
        setSelectedNode(null);
        setSelectedGroupId(null);
      }
    },
    [setSelectedNode]
  );

  const handleGroupSelection = useCallback(() => {
    if (!canGroupSelection) return;

    groupNodes(selectedNodeIds);
    setSelectedNodeIds([]);
    setSelectedNode(null);
    setSelectedGroupId(null);
  }, [canGroupSelection, groupNodes, selectedNodeIds, setSelectedNode]);

  const handleExportSelectedGroup = useCallback(() => {
    if (!selectedGroupId) return;

    const groupNode = nodes.find((node) => node.id === selectedGroupId);
    if (!groupNode) {
      console.warn("Selected group not found for export.");
      return;
    }

    const explicitChildIds = Array.isArray(groupNode.data?.nodeIds)
      ? groupNode.data.nodeIds
      : [];

    const memberNodes = nodes.filter(
      (node) =>
        node.parentId === selectedGroupId || explicitChildIds.includes(node.id)
    );

    const studyConfig = buildStudyConfigFromGroup(groupNode, memberNodes);

    try {
      const blob = new Blob([JSON.stringify(studyConfig, null, 2)], {
        type: "application/json",
      });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      const normalizedLabel =
        (groupNode.data?.label as string | undefined)?.toLowerCase().replace(
          /\s+/g,
          "-"
        ) || groupNode.id;
      link.download = `${normalizedLabel}-study-config.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Failed to export group as JSON:", error);
    }
  }, [nodes, selectedGroupId]);

  // Handle mouse move on the wrapper for cursor tracking
  const handleWrapperMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (!isPlacing || !reactFlowWrapper.current || !rfInstance) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      updateCursorPosition(event.clientX, event.clientY, reactFlowBounds);
    },
    [isPlacing, rfInstance, updateCursorPosition]
  );

  // Handle canvas click for placement
  const onPaneClick = useCallback(
    (event: React.MouseEvent) => {
      if (!isPlacing || !pendingPlacement || !rfInstance || !reactFlowWrapper.current) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = rfInstance.screenToFlowPosition({
        x: event.clientX - 75,
        y: event.clientY - reactFlowBounds.top,
      });

      if (pendingPlacement.type === "node" && pendingPlacement.nodeType && pendingPlacement.nodeData) {
        const newNode: Node = {
          id: `${pendingPlacement.nodeType}-${Date.now()}`,
          type: pendingPlacement.nodeType,
          position,
          data: {
            ...pendingPlacement.nodeData,
            title: pendingPlacement.nodeData.title || pendingPlacement.nodeType,
          },
        };
        addNode(newNode);
        saveToLocalStorage();
        cancelPlacement();
      } else if (pendingPlacement.type === "template" && pendingPlacement.template) {
        addTemplate(pendingPlacement.template, position);
        saveToLocalStorage();
        cancelPlacement();
      }
    },
    [isPlacing, pendingPlacement, rfInstance, reactFlowWrapper, addNode, addTemplate, saveToLocalStorage, cancelPlacement]
  );

  return (
    <div 
      className="relative w-full h-full" 
      ref={reactFlowWrapper}
      onMouseMove={handleWrapperMouseMove}
      style={{ cursor: isPlacing ? "crosshair" : "default" }}
    >
      <div className="absolute inset-0">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodesDelete={onNodesDelete}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onInit={setRfInstance}
          onDragOver={onDragOver}
          onDrop={onDrop}
          nodeTypes={nodeTypes}
          onNodeDragStop={onNodeDragStop}
          onMoveEnd={onMoveEnd}
          onSelectionChange={onSelectionChange}
          fitView
          fitViewOptions={{ padding: 1 }}
          proOptions={proOptions}
          panOnDrag={isDragMode && !isPlacing}
          selectionOnDrag={!isPlacing}
          nodesDraggable={!isPlacing}
          elementsSelectable={!isPlacing}
        >
          <Background gap={15} />
        </ReactFlow>
      </div>

      {/* Ghost Node Overlay */}
      {isPlacing && pendingPlacement && cursorPosition && rfInstance && reactFlowWrapper.current && (() => {
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        const screenPosition = rfInstance.flowToScreenPosition(cursorPosition);
        // Fixed positioning is relative to viewport, so add the bounds offset
        return (
          <GhostNode 
            pendingPlacement={pendingPlacement} 
            position={{
              x: screenPosition.x + reactFlowBounds.left,
              y: screenPosition.y + reactFlowBounds.top,
            }} 
          />
        );
      })()}

      <WorkflowControls
        onAddNodeClick={handleAddNodeClick}
        onSaveToServer={saveToServer}
        interactionMode={interactionMode}
        onInteractionModeChange={setInteractionMode}
        onGroupSelection={handleGroupSelection}
        canGroupSelection={canGroupSelection}
        onGroupExport={handleExportSelectedGroup}
        canExportGroup={canExportGroup}
        startTemplatePlacement={startTemplatePlacement}
      />

      <AddNodeDialog
        open={isAddNodeOpen}
        onOpenChange={setIsAddNodeOpen}
        nodeData={newNodeData}
        onNodeDataChange={setNewNodeData}
        onCreateNode={handleCreateNode}
      />
    </div>
  );
}