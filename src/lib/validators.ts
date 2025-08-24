import { Node, Edge } from 'reactflow';

export function validateFlow(
  nodes: Node[],
  edges: Edge[]
): { isValid: boolean; message: string } {
  if (nodes.length <= 1) {
    return { isValid: true, message: 'Flow is valid.' };
  }

  const nodeIdsWithIncomingEdges = new Set(edges.map((edge) => edge.target));

  const nodesWithoutIncomingEdges = nodes.filter(
    (node) => !nodeIdsWithIncomingEdges.has(node.id)
  );

  if (nodesWithoutIncomingEdges.length > 1) {
    return {
      isValid: false,
      message:
        'There are multiple disconnected nodes. Please connect all nodes to form a single flow.',
    };
  }

  if (nodesWithoutIncomingEdges.length === 0) {
    return {
      isValid: false,
      message:
        'There is a cycle and no start node. Your flow must have one clear starting point.',
    };
  }

  const graph: { [key: string]: string[] } = {};
  nodes.forEach((node) => (graph[node.id] = []));
  edges.forEach((edge) => {
    if (graph[edge.source]) {
      graph[edge.source].push(edge.target);
    }
  });

  const visited = new Set<string>();
  const queue: string[] = [nodesWithoutIncomingEdges[0].id];
  visited.add(queue[0]);

  while (queue.length > 0) {
    const currentNodeId = queue.shift()!;
    (graph[currentNodeId] || []).forEach((neighborId) => {
      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        queue.push(neighborId);
      }
    });
  }

  if (visited.size !== nodes.length) {
    return {
      isValid: false,
      message:
        'There are unreachable nodes in the flow. Please ensure all nodes are connected.',
    };
  }

  return { isValid: true, message: 'Flow is valid.' };
}
