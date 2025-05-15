import type { Task } from "../../api/services/TaskService";
import { useSortable, defaultAnimateLayoutChanges } from "@dnd-kit/sortable";
import type { AnimateLayoutChanges } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from 'framer-motion';
import { MdEdit } from "react-icons/md";
import { format, isPast, isToday } from 'date-fns';

interface Prop {
    task: Task;
    onEdit: () => void;
}

const animateLayoutChanges: AnimateLayoutChanges = (args) => defaultAnimateLayoutChanges(args);

const SortableTask: React.FC<Prop> = ({ task, onEdit }) => {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: task.id.toString(), animateLayoutChanges });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition,
        opacity: isDragging ? 0.6 : 1,
        zIndex: isDragging ? 50 : 'auto',
    };

    const priorityColor = {
        high: 'bg-orange-500',
        medium: 'bg-yellow-400',
        low: 'bg-green-500',
    }[task.priority];


    return (
        <motion.div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={style}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white p-3 rounded shadow mb-2 cursor-move transition-all"
        >
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg mb-1 font-semibold">{task.title}</h3>
                <div className="flex items-center gap-2">
                    <span className={`text-white text-xs px-2 py-1 rounded ${priorityColor}`}>{task.priority}</span>
                    {onEdit && (
                        <button onClick={onEdit} title="Edit" className="text-sm text-blue-600 underline ml-2">
                            <MdEdit className="w-5 h-5" />
                        </button>
                    )}

                </div>

            </div>
            <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Summary: </span> {task.summary}
            </p>
            <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Details: </span> {task.description}
            </p>
            {task.dueDate && (
                <p className="text-sm text-gray-600 mt-4">
                    <span className={`text-sm font-medium px-2 py-1 rounded ${isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate))
                            ? 'bg-red-100 text-red-700'
                            : isToday(new Date(task.dueDate)) ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}
                    >
                        Due:
                    </span> {format(new Date(task.dueDate), 'MMM d, yyyy')}
                    {isPast(new Date(task.dueDate)) && (
                        <span className="text-red-600 ml-2 font-semibold">Overdue</span>
                    )}
                </p>
            )}
        </motion.div>
    );
};

export default SortableTask;
