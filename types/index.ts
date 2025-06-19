export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

export interface Task{
    id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    dueDate: string;
    createdBy: string;
    assignedTo: string;
    createdAt: string;
    updatedAt: string;
    columnId: string;
    position: number;
}

export interface Column {
    id: string;
    title: string;
    boardId: string;
    position: number;
    tasks: Task[];
}

export interface Board {
    id: string;
    name: string;
    description: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    columns: Column[];
    priority: 'High' | 'Medium' | 'Low';
}

export interface BoardStore {
    boards: Board[];
    users: User[];
    searchQuery: string;
    filterPriority: string;
    filterAssignee: string;

    addBoard: (board: Omit<Board, 'id' | 'createdAt' | 'updatedAt' | 'columns'>) => void;
    updateBoard: (id: string, updates: Partial<Board>) => void;
    deleteBoard: (id: string) => void;

    addColumn: (boardId: string, column: Omit<Column, 'id' | 'tasks' | 'position'>) => void;
    updateColumn: (columnId: string, updates: Partial<Column>) => void;
    deleteColumn: (columnId: string) => void;
    moveColumn: (boardId: string, fromIndex: number, toIndex: number) => void;

    addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'position'>) => void;
    updateTask: (taskId: string, updates: Partial<Task>) => void;
    deleteTask: (taskId: string) => void;
    moveTask: (taskId: string, newColumnId: string, newPosition: number) => void;

    setSearchQuery: (query: string) => void;
    setFilterPriority: (priority: string) => void;
    setFilterAssignee: (assignee: string) => void;
}