import express from 'express';
import { PrismaClient } from '@prisma/client';
import { summarizeText } from '../utils/openai';
import { requireAUth } from '../middleware/auth';

const prisma = new PrismaClient();
const router = express.Router();

router.get('/', requireAUth, async(req, res) => {
    const tasks = await prisma.task.findMany({ orderBy: { id: 'asc' } });
    res.json(tasks);
});

router.post('/',requireAUth,  async(req, res) => {
    const { id } = req.params;
    const { title, description, summary, status, priority, dueDate } = req.body;

    try {
        const task = await prisma.task.update({
            where: { id: Number(id) },
            data: {
                title,
                description,
                summary,
                status,
                priority,
                dueDate: dueDate ? new Date(dueDate) : undefined
            },
        });

        res.json(task);
    } catch (error) {
        console.error('Failed to update task:', error);
        res.status(500).json({ error: 'Update failed' });
    }
});

router.put('/:id', requireAUth, async(req, res) => {
    console.log("put backend is called: ")

    const { id } = req.params;
    const { title, description, summary, status, priority, dueDate } = req.body;
    console.log("id of item acquired: ", id)

    console.log("due date: ", dueDate)

    const task = await prisma.task.update({
        where: { id: Number(id) },
        data:{ title, description, summary, status, priority, dueDate: dueDate ? new Date(dueDate) : undefined }
    });
    res.json(task);
});

router.delete('/:id', requireAUth, async(req, res) => {
    const { id } = req.params;
    await prisma.task.delete({
        where: { id: Number(id) }
    });

    res.status(204).send();
});

export default router;
