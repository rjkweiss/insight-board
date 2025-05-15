import { useState } from "react";
import toast from "react-hot-toast";
import TextInput from "../TextInput";
import { createTask } from "../../api/services/TaskService";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onCreated: () => void;
}

const CreateTaskModal:React.FC<Props> = ({ isOpen, onClose, onCreated}) => {
    const[formData, setFormData] = useState({ title: '',  description: ''});
    const[status, setStatus] = useState<'todo' | 'in-progress' | 'done'>('todo');
    const [dueDate, setDueDate] = useState('');

    const handleChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.description) {
            toast.error('Please fill out all fields');
            return;
        }

        try {
            await createTask({...formData, status, dueDate, priority: 'medium'});
            toast.success('Task created');
            onClose();
            onCreated();

            setFormData({title: '', description: ''});
            setStatus('todo');
        } catch (error) {
            toast.error('Failed to create task');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <form onSubmit={handleSubmit}  className="bg-white rounded-lg p-6 shadow-md w-full max-w-md">
                <h2 className="text-xl mb-4 font-semibold">Create New Task</h2>
                <TextInput
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Title"
                />
                <textarea
                    name="description"
                    placeholder='description'
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-hidden focus:border-none focus:ring-2 focus:ring-blue-500`}
                />

                <select
                    name="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'todo' | 'in-progress' | 'done')}
                    className="w-full border p-2 mb-4 rounded"
                >
                    <option value='todo'>To Do</option>
                    <option value='in-progress'>In Progress</option>
                    <option value='done'>Done</option>
                </select>
                <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border p-2 mb-3 rounded"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />

                <div className="flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 text-black rounded">
                        Cancel
                    </button>

                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                        Create
                    </button>
                </div>

            </form>
        </div>
    );
};

export default CreateTaskModal;
