'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, User, MoreHorizontal, Edit, Trash2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Task } from '@/types';
import { useBoardStore } from '@/store/boardStore';
import { EditTaskDialog } from './EditTaskDialog';

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

export function TaskCard({ task, isDragging = false }: TaskCardProps) {
  const { deleteTask, users } = useBoardStore();
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: task.id,
    data: { type: 'task', task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const assignedUser = users.find(u => u.id === task.assignedTo);
  const createdUser = users.find(u => u.id === task.createdBy);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'high') {
      return <AlertCircle className="h-3 w-3" />;
    }
    return null;
  };

  const isOverdue = new Date(task.dueDate) < new Date();

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
    }
  };

  if (isDragging) {
    return (
      <Card className="w-80 opacity-90 rotate-3 shadow-lg">
        <CardContent className="p-3">
          <div className="font-medium text-sm mb-2 text-foreground">{task.title}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`${isSortableDragging ? 'opacity-50' : ''}`}
      >
        <Card
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow group w-full max-w-xs sm:max-w-sm mx-auto"
        >
          <CardContent className="p-2 sm:p-3">
            {/* Priority Badge */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
              <Badge
                variant="outline"
                className={`text-xs ${getPriorityColor(task.priority)}`}
              >
                {getPriorityIcon(task.priority)}
                <span className="ml-1 capitalize">{task.priority}</span>
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-accent"
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Task
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {/* Title */}
            <h4 className="font-medium text-xs sm:text-sm text-foreground mb-2 line-clamp-2">
              {task.title}
            </h4>
            {/* Description */}
            {task.description && (
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {task.description}
              </p>
            )}
            {/* Due Date */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className={`flex items-center text-xs ${
                isOverdue ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'
              }`}>
                <Calendar className="h-3 w-3 mr-1" />
                <span>
                  {new Date(task.dueDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              {/* Assigned User */}
              {assignedUser && (
                <div className="flex items-center">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={assignedUser.avatar} />
                    <AvatarFallback className="text-xs">
                      {assignedUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>
            {/* Created by info */}
            <div className="mt-2 pt-2 border-t border-border">
              <div className="flex items-center text-xs text-muted-foreground">
                <User className="h-3 w-3 mr-1" />
                <span>Assigned to {createdUser?.name}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <EditTaskDialog
        task={task}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </>
  );
}