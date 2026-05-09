import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NODE_TEMPLATES, NodeTemplate } from "@/data/node-templates";
import { useWorkflow } from "@/context/workflow-context";
import { LayoutTemplate } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NodeTemplatesPopoverProps {
  startTemplatePlacement?: (template: NodeTemplate) => void;
}

export function NodeTemplatesPopover({ startTemplatePlacement }: NodeTemplatesPopoverProps) {
  const { addTemplate } = useWorkflow();
  const [open, setOpen] = useState(false);

  const handleAddTemplate = (template: NodeTemplate) => {
    // If cursor placement is available, use it; otherwise use default behavior
    if (startTemplatePlacement) {
      startTemplatePlacement(template);
      setOpen(false);
    } else {
      addTemplate(template);
      setOpen(false);
    }
  };

  const categories = ["Basic", "Complete", "Advanced"];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="whitespace-nowrap">
          <LayoutTemplate className="w-4 h-4" />
          <span className="hidden sm:inline-block">Node Templates</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="center"
        side="top"
        className="
        p-0 
        w-full
        sm:w-[600px]
        max-w-[90vw]     
        max-h-[80vh]    
        overflow-hidden
      "
      >
        <div className="p-4 border-b">
          <h3 className="font-semibold text-sm">Node Templates</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Click to add templates to your workflow
          </p>
        </div>

        <Tabs defaultValue="Basic" className="w-full">
          <div className="px-4 pt-3">
            <TabsList className="grid w-full grid-cols-3">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="text-xs"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <ScrollArea className="h-[40vh] sm:h-[400px] px-2 pb-4">
            {categories.map((category) => (
              <TabsContent
                key={category}
                value={category}
                className="p-4 pt-2 mt-0"
              >
                <div
                  className="
                grid grid-cols-1
                gap-3
                sm:grid-cols-1
                md:grid-cols-1
              "
                >
                  {NODE_TEMPLATES.filter((t) => t.category === category).map(
                    (template) => {
                      const Icon = template.icon;
                      return (
                        <Card
                          key={template.id}
                          className="
                        p-3 
                        hover:shadow-md 
                        transition-all 
                        cursor-pointer 
                        hover:border-blue-300
                        active:scale-[0.98]
                      "
                          onClick={() => handleAddTemplate(template)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="shrink-0">
                              <div className="size-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Icon className="w-5 h-5 text-blue-600" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold text-sm truncate">
                                  {template.name}
                                </h4>
                                <Badge variant="secondary" className="text-xs">
                                  {template.nodes.length} nodes
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-600 line-clamp-3">
                                {template.description}
                              </p>
                            </div>
                          </div>
                        </Card>
                      );
                    }
                  )}
                </div>
              </TabsContent>
            ))}
          </ScrollArea>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
