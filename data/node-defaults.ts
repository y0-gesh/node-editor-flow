import { NewNodeData } from "@/types/node-types";

export const NODE_DEFAULTS: Record<string, Partial<NewNodeData>> = {
  geometry: {
    title: "Geometry",
    medMeshFile: "path/to/mesh.med",
  },
  material: {
    title: "Material",
    name: "Steel",
    materialType: "Linear Elastic",
    E: 200000,
    nu: 0.3,
    massDensity: 7850,
    assigned: ["Domain"],
  },
  boundaryCondition: {
    title: "Boundary Condition",
    name: "Fixed",
    constraintType: "Fixed",
    UX: 0,
    UY: 0,
    UZ: 0,
    assigned: ["fixed_end"],
  },
  load: {
    title: "Load",
    name: "Force",
    loadType: "Force",
    FX: 0,
    FY: 0,
    FZ: -1000,
    assigned: ["forced_end"],
  },
  solver: {
    title: "Solver",
    analysisType: "3d_static_analysis",
    maxIterations: 100,
    tolerance: 0.001,
  },
  simulationSetup: {
    title: "Simulation Setup",
    projectId: "project-01",
    outputFolder: "results/",
  },
  result: {
    title: "Result",
    displacement: true,
    stress: true,
    strain: false,
    vonMises: true,
  },
  textnode: {
    title: "Text Node",
    description: "Some text",
  },
  uppercase: {
    title: "Uppercase",
    description: "Converts input to uppercase",
  },
  resultnode: {
    title: "Result Node",
    description: "Shows results",
  },
};
