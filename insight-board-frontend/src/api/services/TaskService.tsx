import toast from "react-hot-toast";
import { api } from "../Api";

export interface Task {
    id: number;
    title: string;
    description: string;
    summary: string;
    status: 'todo' | 'in-progress' | 'done';
    priority: 'high' | 'medium' | 'low';
    dueDate: string;
};

export const getTasks = async (): Promise<Task[]> => {
    try {
        const res = await api.get('/tasks');
        return res.data;
    } catch (error) {
        toast.error('Failed to load tasks.');
        console.error(error);
        return [];
    }

};

export const createTask = async (taskData: Omit<Task, 'id' | 'summary'>): Promise<Task[] | null> => {
    try {
        const res = await toast.promise(
            api.post('/tasks', taskData,),
            {
                loading: 'Creating Task....',
                success: 'Task created!',
                error: 'Failed to create task'
            }
        );
        return res.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const updateTask = async (task: Task): Promise<Task[] | null> => {
    try {
        const res = await toast.promise(
            api.put(`/tasks/${task.id}`, task),
            {
                loading: 'Updating Task...',
                success: 'Task updated!',
                error: 'Failed to update task'
            }
        );
        return res.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const deleteTask = async (taskId: number): Promise<void> => {
    await api.delete(`/tasks/${taskId}`);
};
