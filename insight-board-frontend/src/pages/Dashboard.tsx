import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TaskBoard from "../components/TaskBoard";
import CreateTaskModal from "../components/modals/CreateTaskModal";
import { getTasks } from "../api/services/TaskService";
import type { Task } from "../api/services/TaskService";
import EditTaskModal from "../components/modals/EditTaskModal";

const Dashboard = () => {
    const[isModalOpen, setIsModalOpen] = useState(false);
    const[editingTask, setEditingtask] = useState<Task | null>(null);
    const[tasks, setTasks] = useState<Task[]>([])
    const { logout } = useAuth();
    const navigate = useNavigate();

    const fetchTasks = async ():Promise<void> => {
        const data = await getTasks();
        setTasks(data);
    };


    const handleLogout = () => {
        logout();
        navigate('/');

    };

    useEffect(()=> {
        fetchTasks();
    }, []);
    return(
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold mb-4">Insight Board</h1>
                <button
                    type="button"
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700"
                >
                    Logout
                </button>
            </div>

            <TaskBoard tasks={tasks} refreshTasks={fetchTasks} onEditTask={setEditingtask} />

            <CreateTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreated={fetchTasks}
            />
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg"
            >
                + Task
            </button>

            {/* render editing modal */}
            <EditTaskModal
                task={editingTask}
                onClose={() => setEditingtask(null)}
                onUpdated={fetchTasks}
            />


        </div>
    )
};

export default Dashboard;
