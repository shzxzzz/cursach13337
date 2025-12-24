//тут апиха запускается
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { sequelize } from '../models/index.js';
import usersRouter from './routes/users.js';
import coursesRouter from './routes/courses.js';
import modulesRouter from './routes/modules.js';
import lessonsRouter from './routes/lessons.js';
import lessonFilesRouter from './routes/lessonFiles.js';
import courseOutcomesRouter from './routes/courseOutcomes.js';
import enrollmentsRouter from './routes/enrollments.js';
import studentLessonProgressRouter from './routes/studentLessonProgress.js';
import homeworkAssignmentsRouter from './routes/homeworkAssignments.js';
import studentHomeworksRouter from './routes/studentHomeworks.js';
import authRouter from './routes/auth.js';
import cabinetRouter from './routes/cabinet.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({
        ok: true,
        message: 'API root',
        health: '/health'
    });
});

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/users', usersRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/modules', modulesRouter);
app.use('/api/lessons', lessonsRouter);
app.use('/api/lesson-files', lessonFilesRouter);
app.use('/api/course-outcomes', courseOutcomesRouter);
app.use('/api/enrollments', enrollmentsRouter);
app.use('/api/student-lesson-progress', studentLessonProgressRouter);
app.use('/api/homework-assignments', homeworkAssignmentsRouter);
app.use('/api/student-homeworks', studentHomeworksRouter);
app.use('/api/auth', authRouter);
app.use('/api/cabinet', cabinetRouter);
app.use((err, req, res, next) => {
    console.error(err);
    const status = err.status || 500;
    res.status(status).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;

async function start() {
    try {
        await sequelize.authenticate();
        console.log('DB connected');

        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({ alter: true });
            console.log('DB synced (alter:true)');
        } else {
            await sequelize.sync();
        }

        const server = app.listen(PORT, () => {
            console.log(`API server listening on http://localhost:${PORT}`);
        });

        const shutdown = async () => {
            console.log('Shutting down server...');
            server.close(() => console.log('HTTP server closed'));
            try {
                await sequelize.close();
                console.log('DB connection closed');
                process.exit(0);
            } catch (err) {
                console.error('Error closing DB connection', err);
                process.exit(1);
            }
        };

        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);

    } catch (err) {
        console.error('Failed to start app', err);
        process.exit(1);
    }
}

if (process.env.NODE_ENV !== 'test') {
    start();
}

export default app;
