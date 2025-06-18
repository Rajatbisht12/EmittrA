'use client';

import { useParams } from 'next/navigation';
import { useBoardStore } from '@/store/boardStore';
import { BoardDetailView } from '@/components/board/BoardDetailView';
import { notFound } from 'next/navigation';

export default function BoardDetailPage() {
  const params = useParams();
  const boardId = params.id as string;
  const { boards } = useBoardStore();
  
  const board = boards.find(b => b.id === boardId);
  
  if (!board) {
    notFound();
  }

  return <BoardDetailView board={board} />;
}