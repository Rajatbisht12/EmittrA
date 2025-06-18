'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Column } from '@/types';
import { useBoardStore } from '@/store/boardStore';

interface EditColumnDialogProps {
  column: Column;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditColumnDialog({ column, open, onOpenChange }: EditColumnDialogProps) {
  const { updateColumn } = useBoardStore();
  const [title, setTitle] = useState(column.title);

  // Update form data when column changes
  useEffect(() => {
    setTitle(column.title);
  }, [column]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (title.trim() && title.trim() !== column.title) {
      updateColumn(column.id, {
        title: title.trim(),
      });
    }
    
    onOpenChange(false);
  };

  const handleCancel = () => {
    // Reset form data to original column values
    setTitle(column.title);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Edit Column</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="column-title">Column Title</Label>
            <Input
              id="column-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter column title"
              required
              autoFocus
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || title.trim() === column.title}>
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 