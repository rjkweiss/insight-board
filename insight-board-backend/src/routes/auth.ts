import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { error } from 'console';

const prisma = new PrismaClient();
const router = express.Router();


router.post('/login', async(req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid Credentials'})
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1d'});
    return res.json({ token });

});

router.post('/register', async(req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        return res.status(400).json({ error: 'Email already in use'});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            role:'member'
        },
    });

    const token = jwt.sign({ id: newUser.id, role: newUser.role }, process.env.JWT_SECRET!, { expiresIn: '1d'});
    return res.status(201).json({ token });
});

export default router;
