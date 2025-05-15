# InsightBoard

InsightBoard is a full-stack real-time task board application designed to help users visually manage and track their work. 
Built with modern web technologies, it offers drag-and-drop task movement, priority-based sorting, due date management, 
real-time updates, user authentication, and AI-powered task summarization via OpenAI.

---

## Features

### Task Management
- Create, update, and delete tasks via an intuitive modal form
- Tasks contain a title, description, status, summary, due date, and priority

### Drag-and-Drop Columns
- Move tasks across **To Do**, **In Progress**, and **Done**
- DnD Kit enables smooth and responsive drag experience

### Priority Sorting
- Tasks are color-coded and sorted by priority: High (🔴), Medium (🟡), Low (🟢)
- Priority badges provide quick visual cues

### Due Date Management
- Select due dates using a calendar picker
- Tasks automatically display **Overdue** status
- Tasks are sorted secondarily by due date (after priority)

### Filtering Tools
- Filter tasks by keyword (title or description)
- Filter by priority: All, High, Medium, Low
- Filter by date: All, Due Today, Overdue

### Real-Time Collaboration
- Updates are broadcast to all connected clients using Socket.IO
- Dragging a task updates other user views in real time

### User Authentication
- Register and login via secure JWT-based authentication
- User session is persisted and protects `/dashboard` routes

### AI-Powered Task Summary (OpenAI Integration)
- On task creation, a brief summary is generated using the OpenAI API
- Helps condense verbose descriptions for quick scanning
- Uses your own OpenAI key for flexible, secure integration

---

## Tech Stack

**Frontend:**
- React (TypeScript)
- Tailwind CSS
- Vite

**Backend:**
- Node.js / Express
- Prisma ORM
- PostgreSQL database
- JWT for authentication
- Socket.IO for live updates
- OpenAI API integration for summaries

---

## Getting Started (Local Development)

### 1. Clone the repo
```
git clone https://github.com/your-username/insight-board.git
```
### 2. Setup the Backend
```
cd insight-board
cd insight-board-backend
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run dev
```

#### .env variables
```
DATABASE_URL=postgresql://user:password@localhost:5432/insightboard
OPENAI_KEY=your-openai-key-here
JWT_SECRET=your-jwt-secret-here
```
### 3. Setup the Frontend
```
cd ../insight-board-frontend
npm install
npm run dev
```

