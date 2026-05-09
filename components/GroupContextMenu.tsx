import { useWorkflow } from "@/context/workflow-context";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { PackageOpen, Trash2 } from "lucide-react";

interface GroupContextMenuProps {
  children: React.ReactNode;
  nodeId: string;
  isGroup?: boolean;
}

export function GroupContextMenu({ children, nodeId, isGroup }: GroupContextMenuProps) {
  const { ungroupNodes, deleteNode, nodes } = useWorkflow();
  
  // Check if this node is actually a group
  const node = nodes.find(n => n.id === nodeId);
  const isActuallyGroup = node?.type === 'group' || node?.data?.isGroup || isGroup;

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        {isActuallyGroup && (
          <>
            <ContextMenuItem onClick={() => ungroupNodes(nodeId)}>
              <PackageOpen className="w-4 h-4 mr-2" />
              Ungroup Nodes
            </ContextMenuItem>
            <ContextMenuSeparator />
          </>
        )}
        <ContextMenuItem 
          onClick={() => deleteNode(nodeId)} 
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete {isActuallyGroup ? 'Group' : 'Node'}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}