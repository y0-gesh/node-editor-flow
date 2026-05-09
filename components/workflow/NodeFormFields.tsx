import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NewNodeData } from "@/types/node-types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { FileUpload } from "./FileUpload";
import { Checkbox } from "../ui/checkbox";

interface NodeFormFieldsProps {
  data: NewNodeData;
  onChange: (data: NewNodeData) => void;
}

const ASSIGNABLE_REGIONS = ["Domain", "fixed_end", "forced_end"] as const;
type AssignableRegion = (typeof ASSIGNABLE_REGIONS)[number];

export function NodeFormFields({ data, onChange }: NodeFormFieldsProps) {
  const handleInputChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const nodeType = data.type;
  const assigned = (data.assigned || []) as AssignableRegion[];

  const renderFieldsByType = () => {
    switch (nodeType) {
      case "geometry":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="medMeshFile">MED Mesh File</Label>
              <FileUpload
                field="medMeshFile"
                acceptedTypes={[".med"]}
                onFileChange={handleInputChange}
              />
              {data.medMeshFile && (
                <div className="text-sm text-gray-500 mt-2">
                  Current file: {data.medMeshFile}
                </div>
              )}
            </div>
          </>
        );

      case "material":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Material Name</Label>
              <Input
                id="name"
                value={data.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="steel"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="materialType">Type</Label>
              <Select
                value={data.materialType || "Linear Elastic"}
                onValueChange={(value) => handleInputChange("materialType", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Linear Elastic">Linear Elastic</SelectItem>
                  <SelectItem value="hyperelastic">Hyperelastic</SelectItem>
                  <SelectItem value="plastic">Plastic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="E">Young&apos;s Modulus (E)</Label>
                <Input
                  id="E"
                  type="number"
                  value={data.E || ""}
                  onChange={(e) =>
                    handleInputChange("E", parseFloat(e.target.value))
                  }
                  placeholder="200000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nu">Poisson&apos;s Ratio (ν)</Label>
                <Input
                  id="nu"
                  type="number"
                  step="0.01"
                  value={data.nu || ""}
                  onChange={(e) =>
                    handleInputChange("nu", parseFloat(e.target.value))
                  }
                  placeholder="0.3"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="massDensity">Mass Density</Label>
              <Input
                id="massDensity"
                type="number"
                value={data.massDensity || ""}
                onChange={(e) =>
                  handleInputChange("massDensity", parseFloat(e.target.value))
                }
                placeholder="7850"
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="material-assigned">Assigned Region</Label>
              <Select
                value={assigned[0] || "Domain"}
                onValueChange={(value) =>
                  handleInputChange("assigned", [value as AssignableRegion])
                }
              >
                <SelectTrigger id="material-assigned">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {ASSIGNABLE_REGIONS.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case "boundaryCondition":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Constraint Name</Label>
              <Input
                id="name"
                value={data.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="fixed"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="constraintType">Type</Label>
              <Select
                value={data.constraintType || "Fixed"}
                onValueChange={(value) =>
                  handleInputChange("constraintType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fixed">Fixed</SelectItem>
                  <SelectItem value="Displacement">Displacement</SelectItem>
                  <SelectItem value="Symmetry">Symmetry</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Displacement Constraints
              </Label>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="UX" className="text-xs">
                    UX
                  </Label>
                  <Input
                    id="UX"
                    type="number"
                    value={data.UX ?? 0}
                    onChange={(e) =>
                      handleInputChange("UX", parseFloat(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="UY" className="text-xs">
                    UY
                  </Label>
                  <Input
                    id="UY"
                    type="number"
                    value={data.UY ?? 0}
                    onChange={(e) =>
                      handleInputChange("UY", parseFloat(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="UZ" className="text-xs">
                    UZ
                  </Label>
                  <Input
                    id="UZ"
                    type="number"
                    value={data.UZ ?? 0}
                    onChange={(e) =>
                      handleInputChange("UZ", parseFloat(e.target.value))
                    }
                  />
                </div>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="boundary-assigned">Assigned Region</Label>
              <Select
                value={assigned[0] || "Domain"}
                onValueChange={(value) =>
                  handleInputChange("assigned", [value as AssignableRegion])
                }
              >
                <SelectTrigger id="boundary-assigned">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {ASSIGNABLE_REGIONS.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case "load":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Load Name</Label>
              <Input
                id="name"
                value={data.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Force Load"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loadType">Type</Label>
              <Select
                value={data.loadType || "Force"}
                onValueChange={(value) => handleInputChange("loadType", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Force">Force</SelectItem>
                  <SelectItem value="Pressure">Pressure</SelectItem>
                  <SelectItem value="Thermal">Thermal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label className="text-sm font-medium">Force Components</Label>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="FX" className="text-xs">
                    FX
                  </Label>
                  <Input
                    id="FX"
                    type="number"
                    value={data.FX ?? 0}
                    onChange={(e) =>
                      handleInputChange("FX", parseFloat(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="FY" className="text-xs">
                    FY
                  </Label>
                  <Input
                    id="FY"
                    type="number"
                    value={data.FY ?? 0}
                    onChange={(e) =>
                      handleInputChange("FY", parseFloat(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="FZ" className="text-xs">
                    FZ
                  </Label>
                  <Input
                    id="FZ"
                    type="number"
                    value={data.FZ ?? 0}
                    onChange={(e) =>
                      handleInputChange("FZ", parseFloat(e.target.value))
                    }
                  />
                </div>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="load-assigned">Assigned Region</Label>
              <Select
                value={assigned[0] ?? "Domain"}
                onValueChange={(value) =>
                  handleInputChange("assigned", [value as AssignableRegion])
                }
              >
                <SelectTrigger id="load-assigned">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {ASSIGNABLE_REGIONS.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case "solver":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="analysisType">Analysis Type</Label>
              <Select
                value={data.analysisType || "3d_static_analysis"}
                onValueChange={(value) =>
                  handleInputChange("analysisType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3d_static_analysis">
                    3D Static Analysis
                  </SelectItem>
                  <SelectItem value="2d_static_analysis">
                    2D Static Analysis
                  </SelectItem>
                  <SelectItem value="dynamic_analysis">
                    Dynamic Analysis
                  </SelectItem>
                  <SelectItem value="thermal_analysis">
                    Thermal Analysis
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxIterations">Max Iterations</Label>
              <Input
                id="maxIterations"
                type="number"
                value={data.maxIterations || ""}
                onChange={(e) =>
                  handleInputChange("maxIterations", parseInt(e.target.value))
                }
                placeholder="100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tolerance">Tolerance</Label>
              <Input
                id="tolerance"
                type="number"
                step="0.0001"
                value={data.tolerance || ""}
                onChange={(e) =>
                  handleInputChange("tolerance", parseFloat(e.target.value))
                }
                placeholder="0.001"
              />
            </div>
          </>
        );

      case "simulationSetup":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="projectId">Project ID</Label>
              <Input
                id="projectId"
                value={data.projectId || ""}
                onChange={(e) => handleInputChange("projectId", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="outputFolder">Output Folder</Label>
              <Input
                id="outputFolder"
                value={data.outputFolder || ""}
                onChange={(e) =>
                  handleInputChange("outputFolder", e.target.value)
                }
                placeholder="uploads/results"
              />
            </div>
          </>
        );

      case "result":
        return (
          <>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Output Options</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="displacement"
                    checked={Boolean(data.displacement ?? true)}
                    onCheckedChange={(checked) =>
                      handleInputChange("displacement", checked === true)
                    }
                  />
                  <Label htmlFor="displacement" className="text-sm font-normal">
                    Displacement
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="stress"
                    checked={Boolean(data.stress ?? true)}
                    onCheckedChange={(checked) =>
                      handleInputChange("stress", checked === true)
                    }
                  />
                  <Label htmlFor="stress" className="text-sm font-normal">
                    Stress
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="strain"
                    checked={Boolean(data.strain ?? false)}
                    onCheckedChange={(checked) =>
                      handleInputChange("strain", checked === true)
                    }
                  />
                  <Label htmlFor="strain" className="text-sm font-normal">
                    Strain
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="vonMises"
                    checked={Boolean(data.vonMises ?? true)}
                    onCheckedChange={(checked) =>
                      handleInputChange("vonMises", checked === true)
                    }
                  />
                  <Label htmlFor="vonMises" className="text-sm font-normal">
                    Von Mises Stress
                  </Label>
                </div>
              </div>
            </div>
          </>
        );

      default:
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="title">
                Title<span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Enter node title"
                value={data.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Enter node description"
                value={data.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={3}
              />
            </div>
          </>
        );
    }
  };

  return <>{renderFieldsByType()}</>;
}