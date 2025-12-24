import express from 'express';
import { StudentLessonProgress, User, Lesson } from '../../models/index.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
    try {
        const payload = req.body;

        if (Array.isArray(payload)) {
            const studentIds = [...new Set(payload.map(p => p.student_id).filter(Boolean))];
            const lessonIds = [...new Set(payload.map(p => p.lesson_id).filter(Boolean))];

            if (studentIds.length === 0) {
                return res.status(400).json({ error: 'Нужно указать student_id в каждой записи' });
            }

            if (lessonIds.length === 0) {
                return res.status(400).json({ error: 'Нужно указать lesson_id в каждой записи' });
            }

            const foundStudents = await Promise.all(studentIds.map(id => User.findByPk(id)));
            const missingStudents = studentIds.filter((id, i) => !foundStudents[i]);
            if (missingStudents.length) {
                return res.status(400).json({ error: `Студенты не найдены: ${missingStudents.join(', ')}` });
            }

            const foundLessons = await Promise.all(lessonIds.map(id => Lesson.findByPk(id)));
            const missingLessons = lessonIds.filter((id, i) => !foundLessons[i]);
            if (missingLessons.length) {
                return res.status(400).json({ error: `Уроки не найдены: ${missingLessons.join(', ')}` });
            }

            const uniquePairs = new Set(payload.map(p => `${p.student_id}-${p.lesson_id}`));
            if (uniquePairs.size !== payload.length) {
                return res.status(400).json({ error: 'Дублирующиеся пары student_id + lesson_id не разрешены' });
            }

            const created = await StudentLessonProgress.bulkCreate(payload, {
                returning: true,
                validate: true
            });
            return res.status(201).json(created);
        }

        const { student_id, lesson_id } = payload;
        if (!student_id) {
            return res.status(400).json({ error: 'student_id is required' });
        }
        if (!lesson_id) {
            return res.status(400).json({ error: 'lesson_id is required' });
        }

        const student = await User.findByPk(student_id);
        if (!student) {
            return res.status(400).json({ error: 'Student not found' });
        }

        const lesson = await Lesson.findByPk(lesson_id);
        if (!lesson) {
            return res.status(400).json({ error: 'Lesson not found' });
        }

        const existing = await StudentLessonProgress.findOne({
            where: { student_id, lesson_id }
        });

        if (existing) {
            return res.status(400).json({
                error: 'Прогресс для этого студента и урока уже существует',
                existingId: existing.id
            });
        }

        const progress = await StudentLessonProgress.create(payload);
        return res.status(201).json(progress);
    } catch (err) {
        next(err);
    }
});

     
router.get('/', async (req, res, next) => {
    try {
        const progresses = await StudentLessonProgress.findAll();
        res.json(progresses);
    } catch (err) {
        next(err);
    }
});

     
router.get('/', async (req, res, next) => {
    try {
        const { student_id } = req.query;
        let where = {};

        if (student_id) {
            where.student_id = student_id;
        }

        const progresses = await StudentLessonProgress.findAll({ where });
        res.json(progresses);
    } catch (err) {
        next(err);
    }
});

     
router.put('/:id', async (req, res, next) => {
    try {
        const progress = await StudentLessonProgress.findByPk(req.params.id);
        if (!progress) return res.status(404).json({ error: 'Progress not found' });
        await progress.update(req.body);
        res.json(progress);
    } catch (err) {
        next(err);
    }
});

     
router.delete('/:id', async (req, res, next) => {
    try {
        const progress = await StudentLessonProgress.findByPk(req.params.id);
        if (!progress) return res.status(404).json({ error: 'Progress not found' });
        await progress.destroy();
        res.json({ ok: true });
    } catch (err) {
        next(err);
    }
});

export default router;