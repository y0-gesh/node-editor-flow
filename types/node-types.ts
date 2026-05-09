import {
  Layers,
  ShieldCheck,
  Weight,
  Settings,
  ClipboardList,
  BarChart3,
  Type,
  ArrowUpAZ,
  FileCheck,
  Box,
} from "lucide-react";

export const NODE_TYPES = [
  { value: "geometry", label: "Geometry", icon: Box, category: "Core" },
  { value: "material", label: "Material", icon: Layers, category: "Core" },
  {
    value: "boundaryCondition",
    label: "Boundary Condition",
    icon: ShieldCheck,
    category: "Core",
  },
  { value: "load", label: "Load", icon: Weight, category: "Core" },
  { value: "solver", label: "Solver", icon: Settings, category: "Core" },
  {
    value: "simulationSetup",
    label: "Simulation Setup",
    icon: ClipboardList,
    category: "Core",
  },
  { value: "result", label: "Result", icon: BarChart3, category: "Core" },
];

export type NodeType = (typeof NODE_TYPES)[number]["value"];

// ========================================
// types/node.ts
// ========================================
export interface NewNodeData {
  className?: string;
  category?: string;
  type?: string;
  icon?: React.ReactNode;
  title: string;
  description?: string;
  [key: string]: any;
}
