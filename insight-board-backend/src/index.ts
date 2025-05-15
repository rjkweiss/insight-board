import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import taskRouter from './routes/tasks';
import authRouter from './routes/auth';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5174",
        methods: ['GET', 'POST'],
        credentials: true
    }
});

app.use(cors({origin: 'http://localhost:5174', credentials: true}));
app.use(express.json());

app.use('/api/tasks', taskRouter);
app.use('/api/auth', authRouter);

io.on('connection', (socket) => {
    socket.on('task-change', () => {
        io.emit('tasks-updated');
    });
});

server.listen(3000, () => console.log('Server running on port 3000'));
