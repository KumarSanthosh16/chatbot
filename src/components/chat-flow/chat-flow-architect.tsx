'use client';

import { useState, useCallback, useRef } from 'react';
import type { DragEvent } from 'react';
import {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
} from 'reactflow';
import type { Node, Edge, Connection } from 'reactflow';
import 'reactflow/dist/style.css';

import NodesPanel from '@/components/chat-flow/nodes-panel';
import FlowBuilder from '@/components/chat-flow/flow-builder';
import SettingsPanel from '@/components/chat-flow/settings-panel';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { validateFlow } from '@/lib/validators';
import { Save } from 'lucide-react';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'message',
    position: { x: 250, y: 5 },
    data: { label: 'Start Message' },
  },
];

let id = 2;
const getId = () => `${id++}`;

const ChatFlowArchitectInternal = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const { screenToFlowPosition } = useReactFlow();
  const { toast } = useToast();

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      setSelectedNode(node);
      setNodes((nodes) =>
        nodes.map((n) => ({
          ...n,
          selected: n.id === node.id,
        }))
      );
    },
    [setNodes]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setNodes((nodes) =>
      nodes.map((n) => ({
        ...n,
        selected: false,
      }))
    );
  }, [setNodes]);

  const updateNodeLabel = (nodeId: string, label: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, label } };
        }
        return node;
      })
    );
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode({
        ...selectedNode,
        data: { ...selectedNode.data, label },
      });
    }
  };

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current) return;

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: { label: `New Message` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes]
  );

  const handleSave = () => {
    const { isValid, message } = validateFlow(nodes, edges);
    if (!isValid) {
      toast({
        title: 'Invalid Flow',
        description: message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Flow Saved',
        description: 'Your conversation flow has been successfully saved.',
      });
      console.log('Saved Flow:', { nodes, edges });
    }
  };

  return (
    <div className='flex h-screen w-screen bg-background text-foreground dndflow'>
      <NodesPanel />
      <div
        className='flex-grow h-full'
        ref={reactFlowWrapper}
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <FlowBuilder
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
        />
      </div>
      <header className='absolute top-4 right-4 z-10'>
        <Button
          onClick={handleSave}
          className='bg-accent hover:bg-accent/90 text-accent-foreground'
        >
          <Save className='mr-2 h-4 w-4' />
          Save Flow
        </Button>
      </header>
      {selectedNode && (
        <SettingsPanel
          node={selectedNode}
          onLabelChange={updateNodeLabel}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  );
};

export default function ChatFlowArchitect() {
  return (
    <ReactFlowProvider>
      <ChatFlowArchitectInternal />
    </ReactFlowProvider>
  );
}
