'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Node } from 'reactflow';

const formSchema = z.object({
  label: z.string().min(1, { message: 'Message cannot be empty.' }),
});

interface SettingsPanelProps {
  node: Node;
  onLabelChange: (nodeId: string, label: string) => void;
  onClose: () => void;
}

const SettingsPanel = ({
  node,
  onLabelChange,
  onClose,
}: SettingsPanelProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: node.data.label,
    },
  });

  useEffect(() => {
    form.reset({ label: node.data.label });
  }, [node, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onLabelChange(node.id, values.label);
  };

  const handleBlur = () => {
    form.handleSubmit(onSubmit)();
  };

  return (
    <Card className='absolute top-0 right-0 w-80 h-full bg-card z-10 shadow-lg rounded-none border-l border-t-0 border-b-0 border-r-0'>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <CardTitle className='text-lg font-bold flex items-center'>
          <MessageSquare className='mr-2 h-5 w-5 text-primary' />
          Edit Message
        </CardTitle>
        <Button variant='ghost' size='icon' onClick={onClose}>
          <X className='h-4 w-4' />
        </Button>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onChange={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='label'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Text</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter message text'
                      {...field}
                      onBlur={handleBlur}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SettingsPanel;
