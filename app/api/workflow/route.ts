import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Node, Edge } from '@xyflow/react';

const filePath = path.join(process.cwd(), 'data', 'workflow.json');

export async function POST(req: NextRequest) {
  try {
    const { nodes, edges }: { nodes: Node[], edges: Edge[] } = await req.json();

    if (!nodes || !edges) {
      return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
    }

    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    data.nodes = nodes;
    data.edges = edges;

    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');

    return NextResponse.json({ message: 'Workflow saved' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
