import { NewNodeData } from "@/types/node-types";
import {
  Box,
  Layers,
  Anchor,
  Zap,
  Calculator,
  Settings,
  BarChart3,
} from "lucide-react";

export const FEM_NODE_TYPES = [
  {
    value: "geometry",
    label: "Geometry",
    icon: Box,
    category: "Setup",
    description: "Define mesh and geometry",
  },
  {
    value: "material",
    label: "Material",
    icon: Layers,
    category: "Properties",
    description: "Material properties",
  },
  {
    value: "boundaryCondition",
    label: "Boundary Condition",
    icon: Anchor,
    category: "Constraints",
    description: "Apply constraints",
  },
  {
    value: "load",
    label: "Load",
    icon: Zap,
    category: "Loading",
    description: "Apply forces and loads",
  },
  {
    value: "solver",
    label: "Solver",
    icon: Calculator,
    category: "Analysis",
    description: "Configure solver settings",
  },
  {
    value: "simulationSetup",
    label: "Simulation Setup",
    icon: Settings,
    category: "Configuration",
    description: "General simulation settings",
  },
  {
    value: "result",
    label: "Result",
    icon: BarChart3,
    category: "Output",
    description: "View simulation results",
  },
];

export interface NodeTemplate {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: string;
  nodes: Array<{
    id: string;
    type: string;
    position: { x: number; y: number };
    data: any;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
  }>;
}

export const NODE_TEMPLATES: NodeTemplate[] = [
  {
    id: "geometry-setup",
    name: "Geometry Setup",
    description: "Basic geometry with material properties",
    icon: Box,
    category: "Basic",
    nodes: [
      {
        id: "geometry-1",
        type: "geometry",
        position: { x: 0, y: 0 },
        data: {
          title: "Geometry",
          medMeshFile: "uploads/mesh.med",
        },
      },
      {
        id: "material-1",
        type: "material",
        position: { x: 0, y: 220 },
        data: {
          title: "Material",
          name: "steel",
          type: "Linear Elastic",
          E: 200000,
          nu: 0.3,
          massDensity: 7845,
          assigned: ["fixed_end"],
        },
      },
    ],
    edges: [
      {
        id: "e-geometry-material",
        source: "geometry-1",
        target: "material-1",
      },
    ],
  },
  {
    id: "complete-static-analysis",
    name: "Complete Static Analysis",
    description: "Full workflow from geometry to results",
    icon: Calculator,
    category: "Complete",
    nodes: [
      {
        id: "geometry-1",
        type: "geometry",
        position: { x: 0, y: 0 },
        data: {
          title: "Geometry",
          medMeshFile: "cantilever_3d_multi_loading.med",
        },
      },
      {
        id: "material-1",
        type: "material",
        position: { x: 0, y: 220 },
        data: {
          title: "Steel Material",
          name: "steel",
          type: "Linear Elastic",
          E: 200000,
          nu: 0.3,
          massDensity: 7845,
          assigned: ["fixed_end"],
        },
      },
      {
        id: "boundary-1",
        type: "boundaryCondition",
        position: { x: 0, y: 500 },
        data: {
          title: "Fixed Support",
          name: "fixed",
          constraintType: "Displacement",
          UX: 3,
          UY: 2,
          UZ: 1,
          assigned: [
            "fixed_end"
          ]
        },
      },
      {
        id: "load-1",
        type: "load",
        position: { x: 0, y: 750 },
        data: {
          title: "Applied Force",
          name: "force",
          type: "Force",
          FX: 1000,
          FY: 2,
          FZ: 4,
          assigned: [
            "forced_end"
          ]
        },
      },
      {
        id: "solver-1",
        type: "solver",
        position: { x: 0, y: 1000 },
        data: {
          title: "Solver",
          analysisType: "2d_static_analysis",
        },
      },
      {
        id: "result-1",
        type: "result",
        position: { x: 0, y: 1220 },
        data: {
          title: "Results",
          displacement: true,
          stress: true,
          vonMises: true,
        },
      },
    ],
    edges: [
      { id: "e1", source: "geometry-1", target: "material-1" },
      { id: "e2", source: "material-1", target: "boundary-1" },
      { id: "e3", source: "boundary-1", target: "load-1" },
      { id: "e4", source: "load-1", target: "solver-1" },
      { id: "e5", source: "solver-1", target: "result-1" },
    ],
  },
  {
    id: "thermal-analysis",
    name: "Thermal Analysis Setup",
    description: "Thermal analysis workflow",
    icon: Zap,
    category: "Advanced",
    nodes: [
      {
        id: "geometry-1",
        type: "geometry",
        position: { x: 0, y: 0 },
        data: {
          title: "Geometry",
          medMeshFile: "cantilever_3d_multi_loading.med",
        },
      },
      {
        id: "material-1",
        type: "material",
        position: { x: 0, y: 220 },
        data: {
          title: "Thermal Material",
          name: "aluminum",
          type: "Linear Elastic",
          thermalConductivity: 205,
        },
      },
      {
        id: "boundary-1",
        type: "boundaryCondition",
        position: { x: 0, y: 400 },
        data: {
          title: "Fixed Support",
          name: "fixed",
          constraintType: "Displacement",
          UX: 3,
          UY: 2,
          UZ: 1,
          assigned: [
            "fixed_end"
          ]
        },
      },
      {
        id: "solver-1",
        type: "solver",
        position: { x: 0, y: 620 },
        data: {
          title: "Thermal Solver",
          analysisType: "thermal_analysis",
        },
      },
      {
        id: "result-1",
        type: "result",
        position: { x: 0, y: 750 },
        data: {
          title: "Thermal Results",
        },
      },
    ],
    edges: [
      { id: "e1", source: "geometry-1", target: "material-1" },
      { id: "e2", source: "material-1", target: "boundary-1" },
      { id: "e3", source: "boundary-1", target: "solver-1" },
      { id: "e4", source: "solver-1", target: "result-1" },
    ],
  },
  {
    id: "boundary-load-combo",
    name: "Boundary & Load Combo",
    description: "Quick setup for constraints and loads",
    icon: Anchor,
    category: "Basic",
    nodes: [
      {
        id: "boundary-1",
        type: "boundaryCondition",
        position: { x: -150, y: 0 },
        data: {
          title: "Fixed Support",
          name: "fixed",
          constraintType: "Fixed",
          UX: 0,
          UY: 0,
          UZ: 0,
        },
      },
      {
        id: "load-1",
        type: "load",
        position: { x: 150, y: 0 },
        data: {
          title: "Applied Load",
          name: "force",
          type: "Force",
          FX: 500,
        },
      },
    ],
    edges: [],
  },
];
