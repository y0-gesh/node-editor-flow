"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import {
  Node,
  Edge,
  addEdge,
  Connection,
  OnConnect,
  useNodesState,
  useEdgesState,
  getIncomers,
  getOutgoers,
  getConnectedEdges,
} from "@xyflow/react";
import { NodeTemplate } from "@/data/node-templates";
import {
  createGroupNode,
  updateNodesForGrouping,
  GroupMetadata,
} from "@/utils/grouping-utils";

interface WorkflowContextType {
  title: string;
  setTitle: (t: string) => void;
  nodes: Node[];
  edges: Edge[];
  onNodesChange: any;
  onEdgesChange: any;
  onConnect: OnConnect;
  selectedNode: Node | null;
  setSelectedNode: (node: Node | null) => void;
  updateNode: (updatedNode: Node) => void;
  addNodeAndEdge: (newNode: Node, sourceNodeId: string) => void;
  addNode: (newNode: Node) => void;
  deleteNode: (nodeId: string) => void;
  onNodesDelete: (deleted: Node[]) => void;
  addTemplate: (template: NodeTemplate, position?: { x: number; y: number }) => void;
  saveToServer: () => Promise<void>;
  saveToLocalStorage: () => void;
  restoreFromLocalStorage: () => void;
  clearWorkflow: () => void;
  groupNodes: (nodeIds: string[], groupName?: string, customGroupId?: string, resultNodeId?: string) => void;
  ungroupNodes: (groupId: string) => void;
  groups: Map<string, GroupMetadata>;
}

const WorkflowContext = createContext<WorkflowContextType | null>(null);

const FLOW_KEY = "fem-workflow-flow";
const GROUPS_KEY = "fem-workflow-groups";

export function WorkflowProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitle] = useState("Untitled Workflow");
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [groups, setGroups] = useState<Map<string, GroupMetadata>>(new Map());
  
  // Use refs to always have current values
  const nodesRef = useRef<Node[]>(nodes);
  const edgesRef = useRef<Edge[]>(edges);
  const groupsRef = useRef<Map<string, GroupMetadata>>(groups);
  
  React.useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);
  
  React.useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);

  React.useEffect(() => {
    groupsRef.current = groups;
  }, [groups]);

  const persistState = useCallback(
    (
      nextNodes: Node[] = nodesRef.current,
      nextEdges: Edge[] = edgesRef.current,
      nextGroups: Map<string, GroupMetadata> = groupsRef.current
    ) => {
      try {
        const flow = { nodes: nextNodes, edges: nextEdges, title };
        localStorage.setItem(FLOW_KEY, JSON.stringify(flow));
        localStorage.setItem(
          GROUPS_KEY,
          JSON.stringify(Array.from(nextGroups.entries()))
        );
      } catch (error) {
        console.error("Failed to persist workflow state:", error);
      }
    },
    [title]
  );

  const saveToLocalStorage = useCallback(() => {
    persistState();
    console.log("💾 Saved to localStorage");
  }, [persistState]);

  const restoreFromLocalStorage = useCallback(() => {
    try {
      const flowData = localStorage.getItem(FLOW_KEY);
      if (flowData) {
        const flow = JSON.parse(flowData);
        if (flow.nodes) setNodes(flow.nodes);
        if (flow.edges) setEdges(flow.edges);
        if (flow.title) setTitle(flow.title);
      }
      
      const groupsData = localStorage.getItem(GROUPS_KEY);
      if (groupsData) {
        const groupsArray = JSON.parse(groupsData);
        const restoredGroups = new Map(groupsArray);
        setGroups(restoredGroups);
        groupsRef.current = restoredGroups;
      }
      
      console.log("Restored from localStorage");
    } catch (error) {
      console.error("Failed to restore from localStorage:", error);
    }
  }, [setNodes, setEdges]);

  const saveToServer = useCallback(async () => {
    try {
      await fetch("/api/workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          nodes, 
          edges, 
          title,
          groups: Array.from(groups.entries()),
        }),
      });
      console.log("Saved to server");
    } catch (error) {
      console.error("Failed to save to server:", error);
    }
  }, [nodes, edges, title, groups]);

  React.useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      const timeoutId = setTimeout(saveToLocalStorage, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [nodes, edges, groups, saveToLocalStorage]);

  const onConnect: OnConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const updateNode = useCallback(
    (updatedNode: Node) => {
      setNodes((currentNodes) =>
        currentNodes.map((node) =>
          node.id === updatedNode.id
            ? {
                ...node,
                ...(updatedNode.position ? { position: updatedNode.position } : {}),
                data: { ...node.data, ...(updatedNode.data || {}) },
              }
            : node
        )
      );

      setSelectedNode((prev) =>
        prev && prev.id === updatedNode.id
          ? { ...prev, data: { ...prev.data, ...(updatedNode.data || {}) } }
          : prev
      );
    },
    [setNodes]
  );

  // Group nodes function - FIXED
  const groupNodes = useCallback(
    (nodeIds: string[], groupName?: string, customGroupId?: string, resultNodeId?: string) => {
      if (nodeIds.length < 2) {
        console.warn("Need at least two nodes to create a group.");
        return;
      }

      const currentNodes = nodesRef.current;
      const hasExistingParent = nodeIds.some((id) => {
        const node = currentNodes.find((n) => n.id === id);
        return node?.parentId;
      });

      if (hasExistingParent) {
        console.warn("Selected nodes already belong to another group. Ungroup them first.");
        return;
      }

      const groupId = customGroupId || `group_${Date.now()}`;
      const name = groupName || `Group ${groups.size + 1}`;
      
      console.log('📦 Grouping nodes:', nodeIds);
      
      // Create group node
      const groupNode = createGroupNode(groupId, name, nodeIds, currentNodes);
      
      // Update child nodes to be relative to parent
      const updatedNodes = [groupNode, ...updateNodesForGrouping(groupNode, nodeIds, currentNodes)];
      
      // Store group metadata
      const metadata: GroupMetadata = {
        groupId,
        groupName: name,
        nodeIds,
        resultNodeId: resultNodeId || nodeIds[nodeIds.length - 1],
        createdAt: Date.now(),
      };
      
      setNodes(updatedNodes);
      setGroups(prev => {
        const newGroups = new Map(prev).set(groupId, metadata);
        persistState(updatedNodes, edgesRef.current, newGroups);
        return newGroups;
      });
      
      console.log(`Created group: ${name}`, metadata);
    },
    [groups, persistState]
  );

  const addNode = useCallback(
    (newNode: Node) => {
      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const addNodeAndEdge = useCallback(
    (newNode: Node, sourceNodeId: string) => {
      setNodes((nds) => nds.concat(newNode));
      const newEdge: Edge = {
        id: `e${sourceNodeId}-${newNode.id}`,
        source: sourceNodeId,
        target: newNode.id,
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setNodes, setEdges]
  );

  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      deleted.forEach(node => {
        if (node.data?.isGroup) {
          setGroups(prev => {
            const newGroups = new Map(prev);
            newGroups.delete(node.id);
            return newGroups;
          });
        }
      });
      
      setEdges((currentEdges) => {
        let remainingNodes = nodesRef.current.slice();

        return deleted.reduce((acc: Edge[], node) => {
          const incomers = getIncomers(node, remainingNodes, acc);
          const outgoers = getOutgoers(node, remainingNodes, acc);
          const connectedEdges = getConnectedEdges([node], acc);

          const remainingEdges = acc.filter(
            (edge) => !connectedEdges.includes(edge)
          );

          const createdEdges = incomers.flatMap(({ id: source }) =>
            outgoers.map(({ id: target }) => ({
              id: `${source}->${target}`,
              source,
              target,
            }))
          );

          remainingNodes = remainingNodes.filter((rn) => rn.id !== node.id);

          return [...remainingEdges, ...createdEdges];
        }, currentEdges);
      });
    },
    [setEdges]
  );

  const deleteNode = useCallback(
    (nodeId: string) => {
      const currentNodes = nodesRef.current;
      const nodeToDelete = currentNodes.find((n) => n.id === nodeId);

      if (nodeToDelete) {
        let nodesToRemove: Node[] = [];
        const isActuallyGroup = nodeToDelete.type === 'group' || nodeToDelete.data?.isGroup;
        if (isActuallyGroup) {
          // If deleting a group, find all its children
          const childNodes = currentNodes.filter(n => n.parentId === nodeId);
          nodesToRemove = [nodeToDelete, ...childNodes];
        } else {
          // If deleting a regular node
          nodesToRemove = [nodeToDelete];
        }

        onNodesDelete(nodesToRemove);
        setNodes((nds) => nds.filter((n) => !nodesToRemove.some(r => r.id === n.id)));

        if (selectedNode && nodesToRemove.some(r => r.id === selectedNode.id)) {
          setSelectedNode(null);
        }

        // Explicitly trigger save after deletion
        saveToLocalStorage();
        saveToServer();
      }
    },
    [selectedNode, onNodesDelete, setNodes, saveToLocalStorage, saveToServer]
  );

  const ungroupNodes = useCallback(
    (groupId: string) => {
      const group = groups.get(groupId);
      if (!group) {
        console.log('Group not found:', groupId);
        return;
      }
      
      const currentNodes = nodesRef.current;
      const groupNode = currentNodes.find(n => n.id === groupId);
      if (!groupNode) {
        console.log('Group node not found:', groupId);
        return;
      }
      
      console.log('Ungrouping:', group.groupName);
      
      const updatedNodes = currentNodes
        .filter(n => n.id !== groupId)
        .map(node => {
          if (node.parentId === groupId) {
            return {
              ...node,
              parentId: undefined,
              extent: undefined,
              position: {
                x: node.position.x + groupNode.position.x,
                y: node.position.y + groupNode.position.y,
              },
            };
          }
          return node;
        });
      
      setNodes(updatedNodes);
      setGroups(prev => {
        const newGroups = new Map(prev);
        newGroups.delete(groupId);
        return newGroups;
      });
      
      console.log(`Ungrouped: ${group.groupName}`);
    },
    [groups, setNodes]
  );

  const addTemplate = useCallback(
    (template: NodeTemplate, position?: { x: number; y: number }) => {
      const timestamp = Date.now();

      const newNodes = template.nodes.map((node, index) => ({
        ...node,
        id: `${node.id}-${timestamp}-${index}`,
        position: position
          ? {
              x: position.x + node.position.x,
              y: position.y + node.position.y,
            }
          : node.position,
      }));

      const nodeIdMap = new Map(
        template.nodes.map((node, index) => [
          node.id,
          `${node.id}-${timestamp}-${index}`,
        ])
      );

      const newEdges = template.edges.map((edge, index) => ({
        ...edge,
        id: `${edge.id}-${timestamp}-${index}`,
        source: nodeIdMap.get(edge.source) || edge.source,
        target: nodeIdMap.get(edge.target) || edge.target,
      }));

      setNodes((nds) => [...nds, ...newNodes]);
      setEdges((eds) => [...eds, ...newEdges]);
    },
    [setNodes, setEdges]
  );

  const clearWorkflow = useCallback(() => {
    if (confirm("Clear entire workflow? This cannot be undone.")) {
      setNodes([]);
      setEdges([]);
      setTitle("Untitled Workflow");
      setGroups(new Map());
      localStorage.removeItem(FLOW_KEY);
      localStorage.removeItem(GROUPS_KEY);
      console.log("Workflow cleared");
    }
  }, [setNodes, setEdges]);

  return (
    <WorkflowContext.Provider
      value={{
        title,
        setTitle,
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        selectedNode,
        setSelectedNode,
        updateNode,
        addNodeAndEdge,
        addNode,
        deleteNode,
        onNodesDelete,
        addTemplate,
        saveToServer,
        saveToLocalStorage,
        restoreFromLocalStorage,
        clearWorkflow,
        groupNodes,
        ungroupNodes,
        groups,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflow() {
  const ctx = useContext(WorkflowContext);
  if (!ctx) throw new Error("useWorkflow must be used inside WorkflowProvider");
  return ctx;
}