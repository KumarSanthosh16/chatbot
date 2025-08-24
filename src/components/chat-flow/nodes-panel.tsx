'use client';
import { DragEvent } from 'react';
import { MessageSquare } from 'lucide-react';

const onDragStart = (event: DragEvent, nodeType: string) => {
  event.dataTransfer.setData('application/reactflow', nodeType);
  event.dataTransfer.effectAllowed = 'move';
};

const nodeTypes = [
  {
    type: 'message',
    label: 'Message Node',
    icon: <MessageSquare className='h-6 w-6 mr-3 text-primary' />,
  },
];

const NodesPanel = () => {
  return (
    <aside className='w-64 bg-card border-r border-border p-4 z-10 shadow-md'>
      <h2 className='text-lg font-bold mb-4 text-foreground'>Nodes Panel</h2>
      <p className='text-sm text-muted-foreground mb-6'>
        Drag a node to the canvas to start building your flow.
      </p>

      {nodeTypes.map((node) => (
        <div
          key={node.type}
          className='flex items-center p-3 border border-dashed border-primary rounded-lg bg-primary/10 text-primary-foreground cursor-grab transition-all hover:shadow-lg hover:border-solid hover:bg-primary/20'
          onDragStart={(event) => onDragStart(event, node.type)}
          draggable
        >
          {node.icon}
          <span className='font-semibold text-primary'>{node.label}</span>
        </div>
      ))}
    </aside>
  );
};

export default NodesPanel;
