import { Node } from "@xyflow/react";

type AnyNode = Node<Record<string, any>>;

export interface StudyConfigBoundary {
  name: string;
  type: string;
  definition: {
    type: string;
    values: {
      UX: number;
      UY: number;
      UZ: number;
    };
  };
  assigned: string[];
}

export interface StudyConfigLoad {
  name: string;
  type: string;
  definition: {
    FX: number;
    FY: number;
    FZ: number;
    type: string;
  };
  assigned: string[];
}

export interface StudyConfigMaterial {
  name: string;
  properties: {
    type: string;
    massDensity: number;
    specificHeat: number;
    heatCapacity: number;
    thermalConductivity: number;
    thermalExpansion: number;
    E: number;
    nu: number;
  };
  assigned: string[];
}

export interface StudyConfig {
  project_id: string;
  boundaries: StudyConfigBoundary[];
  loads: StudyConfigLoad[];
  materials: StudyConfigMaterial[];
  mesh: {
    mesh_file: string;
    med_mesh_file: string;
  };
  output_folder: string;
  solver: {
    analysis_type: string;
  };
  errors: string[];
}

const asNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const asString = (value: unknown, fallback = ""): string => {
  return typeof value === "string" && value.trim().length > 0
    ? value
    : fallback;
};

const asStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  return [];
};

const selectNodes = (nodes: AnyNode[], type: string) =>
  nodes.filter((node) => node.type === type);

export function buildStudyConfigFromGroup(
  groupNode: AnyNode,
  childNodes: AnyNode[]
): StudyConfig {
  const geometryNode = childNodes.find((node) => node.type === "geometry");
  const materialNodes = selectNodes(childNodes, "material");
  const boundaryNodes = selectNodes(childNodes, "boundaryCondition");
  const loadNodes = selectNodes(childNodes, "load");
  const solverNode = childNodes.find((node) => node.type === "solver");
  const resultNode = childNodes.find((node) => node.type === "result");

  const meshFile =
    asString(geometryNode?.data?.meshFile) ||
    asString(geometryNode?.data?.mesh_file);
  const medMeshFile =
    asString(geometryNode?.data?.medMeshFile) ||
    asString(geometryNode?.data?.med_mesh_file);

  const studyConfig: StudyConfig = {
    project_id: asString(groupNode.data?.groupId, groupNode.id),
    boundaries: boundaryNodes.map((node) => ({
      name: asString(node.data?.name, node.data?.title ?? node.id),
      type: asString(node.data?.type, "Dirichlet"),
      definition: {
        type: asString(
          node.data?.definitionType ?? node.data?.constraintType,
          "Displacement Constraints"
        ),
        values: {
          UX: asNumber(node.data?.UX),
          UY: asNumber(node.data?.UY),
          UZ: asNumber(node.data?.UZ),
        },
      },
      assigned: asStringArray(node.data?.assigned),
    })),
    loads: loadNodes.map((node) => ({
      name: asString(node.data?.name, node.data?.title ?? node.id),
      type: asString(node.data?.type, "Neumann"),
      definition: {
        FX: asNumber(node.data?.FX),
        FY: asNumber(node.data?.FY),
        FZ: asNumber(node.data?.FZ),
        type: asString(node.data?.definitionType ?? node.data?.type, "Force"),
      },
      assigned: asStringArray(node.data?.assigned),
    })),
    materials: materialNodes.map((node) => ({
      name: asString(node.data?.name, node.data?.title ?? node.id),
      properties: {
        type: asString(node.data?.type, "Linear Elastic"),
        massDensity: asNumber(node.data?.massDensity),
        specificHeat: asNumber(node.data?.specificHeat),
        heatCapacity: asNumber(node.data?.heatCapacity),
        thermalConductivity: asNumber(node.data?.thermalConductivity),
        thermalExpansion: asNumber(node.data?.thermalExpansion),
        E: asNumber(node.data?.E),
        nu: asNumber(node.data?.nu),
      },
      assigned: asStringArray(node.data?.assigned),
    })),
    mesh: {
      mesh_file: meshFile,
      med_mesh_file: medMeshFile,
    },
    output_folder:
      asString(resultNode?.data?.outputFolder) ||
      asString(geometryNode?.data?.outputFolder) ||
      `exports/${groupNode.id}`,
    solver: {
      analysis_type: asString(
        solverNode?.data?.analysisType,
        "3d_static_analysis"
      ),
    },
    errors: [],
  };

  return studyConfig;
}

