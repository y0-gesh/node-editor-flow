import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { NodeTypeSelector } from "./NodeTypeSelector";
import { NodeFormFields } from "./NodeFormFields";
import { NodePreview } from "./NodePreview";
import { NewNodeData } from "@/types/node-types";

interface AddNodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodeData: NewNodeData;
  onNodeDataChange: (data: NewNodeData) => void;
  onCreateNode: () => void;
}

export function AddNodeDialog({
  open,
  onOpenChange,
  nodeData,
  onNodeDataChange,
  onCreateNode,
}: AddNodeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Node</DialogTitle>
          <DialogDescription>
            Choose a node type and configure its properties
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <NodeTypeSelector
            value={nodeData.type}
            onValueChange={(value) =>
              onNodeDataChange({ ...nodeData, type: value })
            }
          />

          <NodeFormFields data={nodeData} onChange={onNodeDataChange} />

          <NodePreview data={nodeData} />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onCreateNode} disabled={!nodeData.title.trim()}>
            Create Node
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}