import { Node, Edge } from '@xyflow/react';

export interface GroupMetadata {
  groupId: string;
  groupName: string;
  nodeIds: string[];
  resultNodeId: string;
  createdAt: number;
}

/**
 * Traverse upstream from a result node to collect all connected nodes
 */
export function collectUpstreamNodes(
  startNodeId: string,
  nodes: Node[],
  edges: Edge[]
): string[] {
  const visited = new Set<string>();
  const toVisit = [startNodeId];
  
  while (toVisit.length > 0) {
    const currentId = toVisit.pop()!;
    
    if (visited.has(currentId)) continue;
    visited.add(currentId);
    
    // Find all edges that target the current node
    const incomingEdges = edges.filter(edge => edge.target === currentId);
    
    // Add source nodes to visit queue
    incomingEdges.forEach(edge => {
      if (!visited.has(edge.source)) {
        toVisit.push(edge.source);
      }
    });
  }
  
  return Array.from(visited);
}

/**
 * Calculate bounding box for a group of nodes
 */
export function calculateGroupBounds(nodeIds: string[], nodes: Node[]) {
  const groupNodes = nodes.filter(n => nodeIds.includes(n.id));
  
  if (groupNodes.length === 0) {
    return { x: 0, y: 0, width: 400, height: 400 };
  }
  
  const padding = 40;
  
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  
  groupNodes.forEach(node => {
    const nodeWidth = node.width || 280;
    const nodeHeight = node.height || 100;
    
    minX = Math.min(minX, node.position.x);
    minY = Math.min(minY, node.position.y);
    maxX = Math.max(maxX, node.position.x + nodeWidth);
    maxY = Math.max(maxY, node.position.y + nodeHeight);
  });
  
  return {
    x: minX - padding,
    y: minY - padding,
    width: maxX - minX + padding * 2,
    height: maxY - minY + padding * 2,
  };
}

/**
 * Create a group node from collected nodes
 */
export function createGroupNode(
  groupId: string,
  groupName: string,
  nodeIds: string[],
  nodes: Node[]
): Node {
  const bounds = calculateGroupBounds(nodeIds, nodes);
  
  return {
    id: groupId,
    type: 'group',
    position: { x: bounds.x, y: bounds.y },
    style: {
      width: bounds.width,
      height: bounds.height,
      backgroundColor: 'rgba(59, 130, 246, 0.05)',
      border: '2px solid rgba(59, 130, 246, 0.3)',
      borderRadius: '12px',
    },
    data: {
      label: groupName,
      isGroup: true,
      nodeIds,
    },
  };
}

/**
 * Update child nodes to be relative to parent group
 */
export function updateNodesForGrouping(
  groupNode: Node,
  nodeIds: string[],
  nodes: Node[]
): Node[] {
  return nodes.map(node => {
    if (nodeIds.includes(node.id)) {
      return {
        ...node,
        parentId: groupNode.id,
        extent: 'parent' as const,
        position: {
          x: node.position.x - groupNode.position.x,
          y: node.position.y - groupNode.position.y,
        },
      };
    }
    return node;
  });
}