'use client';

import { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, ArrowLeft, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Board, Task } from '@/types';
import { useBoardStore } from '@/store/boardStore';
import { ColumnCard } from './ColumnCard';
import { TaskCard } from '../task/TaskCard';
import { CreateColumnDialog } from './CreateColumnDialog';
import { CreateTaskDialog } from '../task/CreateTaskDialog';
import Link from 'next/link';

interface BoardDetailViewProps {
  board: Board;
}

export function BoardDetailView({ board }: BoardDetailViewProps) {
  const {
    moveColumn,
    moveTask,
    searchQuery,
    setSearchQuery,
    filterPriority,
    filterAssignee,
  } = useBoardStore();
  
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isCreateColumnOpen, setIsCreateColumnOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string>('');

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    
    if (active.data.current?.type === 'task') {
      const task = board.columns
        .flatMap(col => col.tasks)
        .find(task => task.id === active.id);
      setActiveTask(task || null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    // Handle column reordering
    if (activeType === 'column' && overType === 'column') {
      const activeIndex = board.columns.findIndex(col => col.id === active.id);
      const overIndex = board.columns.findIndex(col => col.id === over.id);
      
      if (activeIndex !== overIndex) {
        moveColumn(board.id, activeIndex, overIndex);
      }
    }

    // Handle task moving
    if (activeType === 'task') {
      const activeTask = board.columns
        .flatMap(col => col.tasks)
        .find(task => task.id === active.id);
      
      if (!activeTask) return;

      let newColumnId = activeTask.columnId;
      let newPosition = activeTask.position;

      if (overType === 'column') {
        newColumnId = over.id as string;
        const targetColumn = board.columns.find(col => col.id === newColumnId);
        newPosition = targetColumn?.tasks.length || 0;
      } else if (overType === 'task') {
        const overTask = board.columns
          .flatMap(col => col.tasks)
          .find(task => task.id === over.id);
        
        if (overTask) {
          newColumnId = overTask.columnId;
          newPosition = overTask.position;
        }
      }

      if (newColumnId !== activeTask.columnId || newPosition !== activeTask.position) {
        moveTask(active.id as string, newColumnId, newPosition);
      }
    }
  };

  const filteredColumns = board.columns.map(column => ({
    ...column,
    tasks: column.tasks.filter(task => {
      const matchesSearch = searchQuery === '' || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPriority = filterPriority === '' || task.priority === filterPriority;
      
      const matchesAssignee = filterAssignee === '' || task.assignedTo === filterAssignee;
      
      return matchesSearch && matchesPriority && matchesAssignee;
    })
  }));

  const openCreateTask = (columnId: string) => {
    setSelectedColumnId(columnId);
    setIsCreateTaskOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Link href="/boards">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Boards
            </Button>
          </Link>
          <div className="flex-1 w-full">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">{board.name}</h1>
            {board.description && (
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">{board.description}</p>
            )}
          </div>
          <Button
            onClick={() => setIsCreateColumnOpen(true)}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Add Column
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Board Content */}
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 sm:pb-6">
            <SortableContext
              items={board.columns.map(col => col.id)}
              strategy={horizontalListSortingStrategy}
            >
              {filteredColumns.map((column) => (
                <ColumnCard
                  key={column.id}
                  column={column}
                  onAddTask={() => openCreateTask(column.id)}
                />
              ))}
            </SortableContext>
          </div>

          <DragOverlay>
            {activeTask && <TaskCard task={activeTask} isDragging />}
          </DragOverlay>
        </DndContext>

        {/* Empty State */}
        {board.columns.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Plus className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No columns yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Create your first column to start organizing tasks
            </p>
            <Button onClick={() => setIsCreateColumnOpen(true)}>
              Create Your First Column
            </Button>
          </div>
        )}

        {/* Dialogs */}
        <CreateColumnDialog
          boardId={board.id}
          open={isCreateColumnOpen}
          onOpenChange={setIsCreateColumnOpen}
        />

        <CreateTaskDialog
          columnId={selectedColumnId}
          open={isCreateTaskOpen}
          onOpenChange={setIsCreateTaskOpen}
        />
      </div>
    </div>
  );
}