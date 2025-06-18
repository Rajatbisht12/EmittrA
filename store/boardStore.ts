import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BoardStore, Board, Column, Task, User} from '@/types';

const mockUsers: User[] = [
    {id: '1', name: 'John Doe', email: 'abc@gmail.com'}
];

export const useBoardStore = create<BoardStore>()(
    persist(
        (set, get) => ({
            boards: [],
            users: mockUsers,
            searchQuery: '',
            filterPriority: '',
            filterAssignee: '',

            addBoard: (boardData) =>{
                const newBoard: Board = {
                    ...boardData,
                    id: crypto.randomUUID(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    columns: []
                };

                set((state) => ({
                    boards: [...state.boards, newBoard]
                }));
            },

            updateBoard: (id, updates) => {
                set((state) => ({
                  boards: state.boards.map(board =>
                    board.id === id
                      ? { ...board, ...updates, updatedAt: new Date().toISOString() }
                      : board
                  )
                }));
            },
            deleteBoard: (id) => {
                set((state) => ({
                  boards: state.boards.filter(board => board.id !== id)
                }));
              },
        
              addColumn: (boardId, columnData) => {
                const board = get().boards.find(b => b.id === boardId);
                const position = board ? board.columns.length : 0;
                
                const newColumn: Column = {
                  ...columnData,
                  id: crypto.randomUUID(),
                  position,
                  tasks: []
                };
        
                set((state) => ({
                  boards: state.boards.map(board =>
                    board.id === boardId
                      ? {
                          ...board,
                          columns: [...board.columns, newColumn],
                          updatedAt: new Date().toISOString()
                        }
                      : board
                  )
                }));
              },

              updateColumn: (columnId, updates) => {
                set((state) => ({
                  boards: state.boards.map(board => ({
                    ...board,
                    columns: board.columns.map(column =>
                      column.id === columnId
                        ? { ...column, ...updates }
                        : column
                    ),
                    updatedAt: new Date().toISOString()
                  }))
                }));
              },
        
              deleteColumn: (columnId) => {
                set((state) => ({
                  boards: state.boards.map(board => ({
                    ...board,
                    columns: board.columns.filter(column => column.id !== columnId),
                    updatedAt: new Date().toISOString()
                  }))
                }));
              },
        
              moveColumn: (boardId, fromIndex, toIndex) => {
                set((state) => ({
                  boards: state.boards.map(board => {
                    if (board.id === boardId) {
                      const columns = [...board.columns];
                      const [movedColumn] = columns.splice(fromIndex, 1);
                      columns.splice(toIndex, 0, movedColumn);
                      
                      return {
                        ...board,
                        columns: columns.map((col, index) => ({ ...col, position: index })),
                        updatedAt: new Date().toISOString()
                      };
                    }
                    return board;
                  })
                }));
              },
              
              addTask: (taskData) => {
                const board = get().boards.find(b => 
                  b.columns.some(c => c.id === taskData.columnId)
                );
                const column = board?.columns.find(c => c.id === taskData.columnId);
                const position = column ? column.tasks.length : 0;
        
                const newTask: Task = {
                  ...taskData,
                  id: crypto.randomUUID(),
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  position
                };
        
                set((state) => ({
                  boards: state.boards.map(board => ({
                    ...board,
                    columns: board.columns.map(column =>
                      column.id === taskData.columnId
                        ? { ...column, tasks: [...column.tasks, newTask] }
                        : column
                    ),
                    updatedAt: new Date().toISOString()
                  }))
                }));
              },
        
              updateTask: (taskId, updates) => {
                set((state) => ({
                  boards: state.boards.map(board => ({
                    ...board,
                    columns: board.columns.map(column => ({
                      ...column,
                      tasks: column.tasks.map(task =>
                        task.id === taskId
                          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
                          : task
                      )
                    })),
                    updatedAt: new Date().toISOString()
                  }))
                }));
              },
        
              deleteTask: (taskId) => {
                set((state) => ({
                  boards: state.boards.map(board => ({
                    ...board,
                    columns: board.columns.map(column => ({
                      ...column,
                      tasks: column.tasks.filter(task => task.id !== taskId)
                    })),
                    updatedAt: new Date().toISOString()
                  }))
                }));
              },
        
              moveTask: (taskId, newColumnId, newPosition) => {
                set((state) => {
                  const boards = [...state.boards];
                  let taskToMove: Task | null = null;
                  
                  // Find and remove the task
                  boards.forEach(board => {
                    board.columns.forEach(column => {
                      const taskIndex = column.tasks.findIndex(t => t.id === taskId);
                      if (taskIndex !== -1) {
                        taskToMove = column.tasks.splice(taskIndex, 1)[0];
                      }
                    });
                  });
        
                  if (taskToMove) {
                    // Add task to new column
                    boards.forEach(board => {
                      const targetColumn = board.columns.find(c => c.id === newColumnId);
                      if (targetColumn) {
                        taskToMove!.columnId = newColumnId;
                        taskToMove!.position = newPosition;
                        targetColumn.tasks.splice(newPosition, 0, taskToMove!);
                        
                        // Update positions for all tasks in the column
                        targetColumn.tasks.forEach((task, index) => {
                          task.position = index;
                        });
                        
                        board.updatedAt = new Date().toISOString();
                      }
                    });
                  }
        
                  return { boards };
                });
              },
              setSearchQuery: (query) => set({ searchQuery: query }),
              setFilterPriority: (priority) => set({ filterPriority: priority }),
              setFilterAssignee: (assignee) => set({ filterAssignee: assignee }),
        }),
        {
            name: 'task-board-storage',
        }
    )
)