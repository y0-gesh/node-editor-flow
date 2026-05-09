import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  Trash2,
  RefreshCcw,
  ArrowRightFromLine,
  Hand,
  MousePointer2,
  PanelsTopLeft,
  Group,
} from "lucide-react";
import { NodeTemplatesPopover } from "./NodeTemplatesPopover";
import { useWorkflow } from "@/context/workflow-context";
import { NodeTemplate } from "@/data/node-templates";

type InteractionMode = "pointer" | "drag" | "default";

interface WorkflowControlsProps {
  onAddNodeClick: () => void;
  onSaveToServer?: () => void;
  interactionMode: InteractionMode;
  onInteractionModeChange: (mode: InteractionMode) => void;
  onGroupSelection: () => void;
  canGroupSelection: boolean;
  onGroupExport: () => void;
  canExportGroup: boolean;
  startTemplatePlacement?: (template: NodeTemplate) => void;
}

export function WorkflowControls({
  onAddNodeClick,
  onSaveToServer,
  interactionMode,
  onInteractionModeChange,
  onGroupSelection,
  canGroupSelection,
  onGroupExport,
  canExportGroup,
  startTemplatePlacement,
}: WorkflowControlsProps) {
  const { clearWorkflow } = useWorkflow();

  return (
    <div
      className="
      fixed bottom-6 left-1/2 -translate-x-1/2
      flex flex-wrap items-center justify-center
      gap-2 sm:gap-3
      max-w-[95%]
      px-2 py-2
      bg-primary-foreground border rounded-lg shadow-lg
      text-xs sm:text-sm
      z-50
    "
    >
      {/* Interaction Controls */}
      <div className="flex items-center gap-1">
        <Button
          type="button"
          size="icon"
          variant={interactionMode === "default" ? "default" : "outline"}
          onClick={() => onInteractionModeChange("default")}
          aria-pressed={interactionMode === "default"}
          className="h-8 w-8 sm:h-9 sm:w-9"
          title="Pointer mode (select and edit nodes)"
        >
          <MousePointer2 className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          size="icon"
          variant={interactionMode === "drag" ? "default" : "outline"}
          onClick={() => onInteractionModeChange("drag")}
          aria-pressed={interactionMode === "drag"}
          className="h-8 w-8 sm:h-9 sm:w-9"
          title="Drag mode (pan canvas)"
        >
          <Hand className="w-4 h-4" />
        </Button>
      </div>

      <div className="hidden sm:block h-6 w-px bg-gray-300" />

      {/* Add Node */}
      <Button
        variant="outline"
        size="sm"
        className="h-8"
        onClick={onAddNodeClick}
      >
        <PlusCircle className="w-4 h-4 inline-block" />
        <span className="hidden sm:inline-block">Add</span>
      </Button>

      {/* Group Selection */}
      <Button
        variant="outline"
        size="sm"
        className="h-8"
        onClick={onGroupSelection}
        disabled={!canGroupSelection}
      >
        <Group className="w-4 h-4 inline-block" />
        <span className="hidden sm:inline-block">Group</span>
      </Button>

      <div className="hidden sm:block h-6 w-px bg-gray-300" />

      {/* Templates */}
      <NodeTemplatesPopover startTemplatePlacement={startTemplatePlacement} />

      <div className="hidden sm:block h-6 w-px bg-gray-300" />

      {/* Export Button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 sm:h-9 sm:w-9"
        onClick={onGroupExport}
        disabled={!canExportGroup}
        title={
          canExportGroup
            ? "Export selected group to JSON"
            : "Select a group to export"
        }
      >
        <ArrowRightFromLine className="w-4 h-4" />
      </Button>

      {/* Save to Server */}
      {onSaveToServer && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 sm:h-9 sm:w-9"
          onClick={onSaveToServer}
          title="Sync to server"
        >
          <RefreshCcw className="w-4 h-4" />
        </Button>
      )}

      {/* Divider */}
      <div className="hidden sm:block h-6 w-px bg-gray-300" />

      {/* Clear Workflow */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 sm:h-9 sm:w-9"
        onClick={clearWorkflow}
        title="Clear workflow"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
