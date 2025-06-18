'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Column } from '@/types';
import { TaskCard } from '../task/TaskCard';
import { useBoardStore } from '@/store/boardStore';
import { EditColumnDialog } from './EditColumnDialog';

interface ColumnCardProps {
  column: Column;
  onAddTask: () => void;
}

export function ColumnCard({ column, onAddTask }: ColumnCardProps) {
  const { deleteColumn } = useBoardStore();
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: { type: 'column', column },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this column? All tasks will be lost.')) {
      deleteColumn(column.id);
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`flex-shrink-0 w-80 ${isDragging ? 'opacity-50' : ''}`}
      >
        <Card className="h-fit">
          <CardHeader
            {...attributes}
            {...listeners}
            className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-grab active:cursor-grabbing"
          >
            <h3 className="font-semibold text-sm text-foreground">
              {column.title}
              <span className="ml-2 text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                {column.tasks.length}
              </span>
            </h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Column
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Column
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          
          <CardContent className="space-y-2">
            {/* Tasks */}
            <div className="space-y-2 min-h-[100px]">
              {column.tasks
                .sort((a, b) => a.position - b.position)
                .map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
            </div>
            
            {/* Add Task Button */}
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
              onClick={onAddTask}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add a task
            </Button>
          </CardContent>
        </Card>
      </div>

      <EditColumnDialog
        column={column}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </>
  );
}