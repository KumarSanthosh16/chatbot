'use client';
import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { MessageSquare } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const TextMessageNode = ({ data, selected }: NodeProps<{ label: string }>) => {
  return (
    <Card
      className={`w-64 shadow-md rounded-lg border-2 ${
        selected ? 'border-primary' : 'border-border'
      }`}
    >
      <Handle
        type='target'
        position={Position.Left}
        className='!bg-primary'
        id='a'
      />
      <CardHeader className='flex flex-row items-center space-x-2 p-2 bg-muted/50 rounded-t-lg'>
        <MessageSquare className='h-4 w-4 text-primary' />
        <CardTitle className='text-sm font-semibold text-foreground'>
          Text Message
        </CardTitle>
      </CardHeader>
      <CardContent className='p-3 text-sm text-foreground'>
        {data.label}
      </CardContent>
      <Handle
        type='source'
        position={Position.Right}
        className='!bg-primary'
        id='b'
      />
    </Card>
  );
};

export default memo(TextMessageNode);
