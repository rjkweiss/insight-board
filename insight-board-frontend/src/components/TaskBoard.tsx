import React,  { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { updateTask } from "../api/services/TaskService";
import type { Task } from "../api/services/TaskService";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay} from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableTask from "./dnd/SortableTask";
import DroppableColumn from "./dnd/DroppableColumn";
import { AnimatePresence, motion } from 'framer-motion';

const socket = io('http://localhost:3000');

const statusColumns = ['todo', 'in-progress', 'done'] as const;

type Status = typeof statusColumns[number];

interface Props {
    tasks: Task[],
    refreshTasks: () => void;
    onEditTask: (task: Task) => void;
}

const TaskBoard: React.FC<Props> = ({ tasks, refreshTasks, onEditTask}) => {
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
    const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'overdue'>('all');

    const[tasksByStatus, setTasksByStatus] = useState<Record<Status, Task[]>>({
        todo: [],
        'in-progress': [],
        done: []
    });

    useEffect(() => {
        const grouped: Record<Status, Task[]> = {
            todo: [],
            'in-progress': [],
            done: []
        }
        tasks.forEach((task) => {
            if (grouped[task.status as Status]) {
                grouped[task.status as Status].push(task)
            }
        });

        // sort by priority in each column
        for (const status of statusColumns) {
            grouped[status].sort((a, b) => {
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                const pDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
                if (pDiff !== 0) return pDiff;

                if (a.dueDate && b.dueDate) {
                    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                }
                return 0;
            });
        }

        setTasksByStatus(grouped);
    }, [tasks]);

    useEffect(() => {
        socket.on('tasks-updated', refreshTasks);
        return () => {
            socket.off('tasks-updated', refreshTasks)
        };
    }, [refreshTasks]);


    // helper function that helps us identify the column we need to drag item to
    const findTaskColumn = (taskId: string): Status | null => {
        for (const [status, taskList] of Object.entries(tasksByStatus) as [Status, Task[]][]) {
            if (taskList.some((task) => task.id.toString() === taskId)) {
                return status;
            }
        }
        return null;
    };

    const handleDragStart = (event: any) => {
        const taskId = event.active.id;
        const status = findTaskColumn(taskId);

        if (!status) return;

        const task = tasksByStatus[status].find((t) => t.id.toString() === taskId);
        if (task) setActiveTask(task);
    };

    const handleDragEnd = async(event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) {
            setActiveTask(null);
            return;
        }

        const sourceStatus = findTaskColumn(active.id);
        // const targetStatus = findTaskColumn(over.id);

        const targetStatus: Status | null = (statusColumns.includes(over.id as Status) ? over.id : findTaskColumn(over.id)) as Status;

        // const[sourceStatus, sourceTasks] = sourceColumn;
        if (!sourceStatus || !targetStatus) {
            setActiveTask(null);
            return;
        }

        const sourceTasks = tasksByStatus[sourceStatus];

        if (sourceStatus === targetStatus) {

            // reorder within the same column
            const oldIndex = sourceTasks.findIndex((t) => t.id.toString() === active.id);
            const newIndex = sourceTasks.findIndex((t) => t.id.toString() === over.id);

            if (oldIndex === -1 || newIndex === -1) {
                setActiveTask(null);
                return;
            }

            const reorderedTasks = arrayMove(sourceTasks, oldIndex, newIndex);

            setTasksByStatus((prev) => ({ ...prev, [sourceStatus]: reorderedTasks }));

            // Let UI update first, then remove ghost
            requestAnimationFrame(() => setActiveTask(null));
        } else {
            // move across columns
            const movedTask = sourceTasks.find((t) => t.id.toString() === active.id);

            if (!movedTask) {
                setActiveTask(null);
                return;
            }

            const updated = {
                ...movedTask,
                status: targetStatus
            };

            const res = await updateTask(updated);
            if (res) {
                socket.emit('task-change');
                await refreshTasks();
            }

            setTimeout(() => {
                setActiveTask(null);
            }, 1000);
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
          activationConstraint: {
            distance: 5,
          },
        })
    );
    return(
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border px-3 py-2 rounded w-1/2"
                />
                <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value as 'all' | 'high' | 'medium' | 'low')}
                    className="border px-3 py-2 rounded"
                >
                    <option value="all">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
                <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value as 'all' | 'today' | 'overdue')}
                    className="border px-3 py-2 rounded"
                >
                    <option value="all">All Dates</option>
                    <option value="today">Due Today</option>
                    <option value="overdue">Overdue</option>
                </select>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {statusColumns.map((status) => {
                    const visibleTasks = tasksByStatus[status].filter((task) => {
                        const matchesText =
                            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            task.description.toLowerCase().includes(searchTerm.toLowerCase());
                        const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
                        const today = new Date();
                        const due = task.dueDate ? new Date(task.dueDate) : null;
                        const matchesDate =
                            dateFilter === 'all' ||
                            (dateFilter === 'today' && due && due.toDateString() === today.toDateString()) ||
                            (dateFilter === 'overdue' && due && due < today);

                        return matchesText && matchesPriority && matchesDate;
                    });

                    return (
                        <DroppableColumn key={status} id={status}>
                            <h2 className="text-lg font-semibold mb-2 capitalize">{status.replace('-', ' ')}</h2>

                            <SortableContext
                                items={visibleTasks.map((t) => t.id.toString())}
                                strategy={verticalListSortingStrategy}
                            >
                                {visibleTasks.map((task) => (
                                    <SortableTask key={task.id} task={task} onEdit={() => onEditTask(task)} />
                                ))}
                            </SortableContext>
                        </DroppableColumn>
                    );
                })}
            </div>
            <DragOverlay>
                <AnimatePresence>
                    {activeTask && (
                        <motion.div
                            key={activeTask.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            style={{ zIndex: 999}}
                            className="bg-white p-3 rounded shadow text-sm w-[250px]"
                        >
                            <h3 className="font-semibold">{activeTask.title}</h3>
                            <p className="text-gray-500">{activeTask.summary}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DragOverlay>
        </DndContext>
    );
};

export default TaskBoard;
