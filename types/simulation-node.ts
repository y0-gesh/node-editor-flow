export interface GeometryData {
  meshFile?: string;
  medMeshFile?: string;
  elements?: number;
  nodes?: number;
}

export interface MaterialData {
  name: string;
  type: string;
  E?: number; // Young's modulus
  nu?: number; // Poisson's ratio
  massDensity?: number;
  specificHeat?: number;
  thermalConductivity?: number;
  assigned?: string[];
}

export interface BoundaryConditionData {
  name: string;
  type: "Dirichlet" | "Neumann";
  constraintType?: string;
  UX?: number;
  UY?: number;
  UZ?: number;
  assigned?: string[];
}

export interface LoadData {
  name: string;
  type: "Force" | "Pressure" | "Thermal";
  FX?: number;
  FY?: number;
  FZ?: number;
  assigned?: string[];
}

export interface SolverData {
  analysisType: string;
  maxIterations?: number;
  tolerance?: number;
  timeSteps?: number;
}

export interface SimulationSetupData {
  projectId?: string;
  title?: string;
  description?: string;
  outputFolder?: string;
}

export interface ResultData {
  displacement?: boolean;
  stress?: boolean;
  strain?: boolean;
  vonMises?: boolean;
}