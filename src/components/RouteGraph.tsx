"use client";

import ReactFlow, {
  Background,
  Controls,
  type Node,
  type Edge,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import type { RouteQuote } from "@/types";

interface RouteGraphProps {
  quote: RouteQuote;
}

function buildGraph(quote: RouteQuote): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const nodeSet = new Set<string>();

  const addNode = (id: string, label: string, x: number, y: number) => {
    if (!nodeSet.has(id)) {
      nodeSet.add(id);
      nodes.push({
        id,
        data: { label },
        position: { x, y },
        style: {
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
          borderRadius: 8,
          padding: "6px 12px",
          fontSize: 12,
          fontWeight: 600,
          color: "hsl(var(--foreground))",
        },
      });
    }
  };

  const pathCount = quote.paths.length;

  quote.paths.forEach((path, pathIdx) => {
    const yOffset = pathIdx * 100 - ((pathCount - 1) * 100) / 2;

    path.hops.forEach((hop, hopIdx) => {
      const nodeId = `${hop.asset.code}-${pathIdx}-${hopIdx}`;
      addNode(nodeId, hop.asset.code, hopIdx * 180, yOffset);

      if (hopIdx > 0) {
        const prevHop = path.hops[hopIdx - 1];
        const prevId = `${prevHop.asset.code}-${pathIdx}-${hopIdx - 1}`;
        edges.push({
          id: `${prevId}->${nodeId}`,
          source: prevId,
          target: nodeId,
          label: `${path.splitPercent}%`,
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { stroke: "hsl(var(--primary))", strokeWidth: 2 },
          labelStyle: { fontSize: 10, fill: "hsl(var(--muted-foreground))" },
        });
      }
    });
  });

  return { nodes, edges };
}

export function RouteGraph({ quote }: RouteGraphProps) {
  const { nodes, edges } = buildGraph(quote);

  return (
    <div className="h-64 w-full overflow-hidden rounded-xl border border-border bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={16} size={1} color="hsl(var(--border))" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
