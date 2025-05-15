import { useState, useEffect } from 'react';
import { updateTask, deleteTask } from '../../api/services/TaskService';
import type { Task } from '../../api/services/TaskService';
import toast from 'react-hot-toast';

interface Props {
    task: Task | null,
    onClose: () => void;
    onUpdated: () => void;
}

const EditTaskModal: React.FC<Props> = ({ task, onClose, onUpdated }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<'todo' | 'in-progress' | 'done'>('todo');
    const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
    const [dueDate, setDueDate] = useState('');

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description);
            setStatus(task.status);
            setPriority(task.priority || 'medium');
            setDueDate(task.dueDate?.split('T')[0] || '')
        }
    }, [task]);

    if (!task) return null;

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const updated = await updateTask({ ...task, title, description, status, priority, dueDate });
            if (updated) {
                toast.success('Task updated');
                onUpdated();
                onClose();
            }
        } catch (err) {
            toast.error('Update failed');
        }
    };

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this task?')) {
            try {
                await deleteTask(task.id);
                toast.success('Task deleted');
                onUpdated();
                onClose();
            } catch {
                toast.error('Delete failed');
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <form onSubmit={handleUpdate} className="bg-white p-6 rounded shadow w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Edit Task</h2>

                <input
                    className="w-full border p-2 mb-3 rounded"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    required
                />

                <textarea
                    className="w-full border p-2 mb-3 rounded"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    rows={4}
                />

                <select
                    className="w-full border p-2 mb-3 rounded"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Task['status'])}
                >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                </select>

                <select
                    className="w-full border p-2 mb-3 rounded"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
                >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                </select>

                <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border p-2 mb-3 rounded"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />

                <div className="flex justify-between items-center">
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="px-4 py-2 text-red-600 border border-red-600 rounded hover:bg-red-100"
                    >
                        Delete
                    </button>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-black rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                        >
                            Save
                        </button>
                    </div>
                </div>
          </form>
        </div>
      );
};

export default EditTaskModal;
