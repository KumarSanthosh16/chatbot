'use client';
import { memo } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import type {
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Node,
  Edge,
} from 'reactflow';

import TextMessageNode from '@/components/chat-flow/text-message-node';

const nodeTypes = {
  message: TextMessageNode,
};

interface FlowBuilderProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onNodeClick: (event: React.MouseEvent, node: Node) => void;
  onPaneClick: () => void;
}

const FlowBuilder = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onPaneClick,
}: FlowBuilderProps) => {
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={onNodeClick}
      onPaneClick={onPaneClick}
      nodeTypes={nodeTypes}
      fitView
      className='bg-background'
    >
      <Controls className='[&>button]:bg-card [&>button]:border-border [&>button:hover]:bg-muted [&_svg]:fill-foreground' />
      <MiniMap
        nodeStrokeColor={(n) => {
          if (n.type === 'input') return '#0041d0';
          if (n.type === 'message') return 'hsl(var(--primary))';
          if (n.type === 'output') return '#ff0072';
          return '#eee';
        }}
        nodeColor={(n) => {
          if (n.type === 'message') return 'hsl(var(--primary) / 0.1)';
          return '#fff';
        }}
        nodeBorderRadius={2}
      />
      <Background gap={12} size={1} color='hsl(var(--border))' />
    </ReactFlow>
  );
};

export default memo(FlowBuilder);
