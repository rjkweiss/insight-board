import React from "react";
import { useDroppable } from "@dnd-kit/core"
import { motion } from "framer-motion";

interface Props {
    id: string,
    children: React.ReactNode
}

const DroppableColumn: React.FC<Props> = ({ id, children }) => {
    const { isOver, setNodeRef } = useDroppable({ id });
    return (
        <motion.div ref={setNodeRef} className={`bg-gray-100 p-2 rounded min-h-[150px] transition-all ${isOver ? 'ring-2 ring-blue-500 shadow-md': ''}` }>
            {children}
        </motion.div>
    );
};

export default DroppableColumn;
