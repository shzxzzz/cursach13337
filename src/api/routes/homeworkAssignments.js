import express from 'express';
import { HomeworkAssignment, Lesson } from '../../models/index.js';

const router = express.Router();

// CREATE
router.post('/', async (req, res, next) => {
    try {
        const payload = req.body;

        if (Array.isArray(payload)) {
            const lessonIds = [...new Set(payload.map(p => p.lesson_id).filter(Boolean))];
            if (lessonIds.length === 0) {
                return res.status(400).json({ error: 'Нужно указать lesson_id в каждом задании' });
            }

            const found = await Promise.all(lessonIds.map(id => Lesson.findByPk(id)));
            const missing = lessonIds.filter((id, i) => !found[i]);
            if (missing.length) {
                return res.status(400).json({ error: `Уроки не найдены: ${missing.join(', ')}` });
            }

            const invalidItems = payload.filter(p => !p.title || !p.description);
            if (invalidItems.length > 0) {
                return res.status(400).json({
                    error: 'title и description обязательны для каждого задания',
                    invalidCount: invalidItems.length
                });
            }

            const created = await HomeworkAssignment.bulkCreate(payload, {
                returning: true,
                validate: true
            });
            return res.status(201).json(created);
        }

        const { lesson_id, title, description } = payload;

        if (!lesson_id) {
            return res.status(400).json({ error: 'lesson_id is required' });
        }
        if (!title) {
            return res.status(400).json({ error: 'title is required' });
        }
        if (!description) {
            return res.status(400).json({ error: 'description is required' });
        }

        const lesson = await Lesson.findByPk(lesson_id);
        if (!lesson) {
            return res.status(400).json({ error: 'Lesson not found' });
        }

        const assignment = await HomeworkAssignment.create(payload);
        return res.status(201).json(assignment);
    } catch (err) {
        next(err);
    }
});

// READ ALL
router.get('/', async (req, res, next) => {
    try {
        const assignments = await HomeworkAssignment.findAll();
        res.json(assignments);
    } catch (err) {
        next(err);
    }
});

// READ ONe
router.get('/:id', async (req, res, next) => {
    try {
        const assignment = await HomeworkAssignment.findByPk(req.params.id);
        if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
        res.json(assignment);
    } catch (err) {
        next(err);
    }
});

// UPDATE
router.put('/:id', async (req, res, next) => {
    try {
        const assignment = await HomeworkAssignment.findByPk(req.params.id);
        if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
        await assignment.update(req.body);
        res.json(assignment);
    } catch (err) {
        next(err);
    }
});

// DELETE
router.delete('/:id', async (req, res, next) => {
    try {
        const assignment = await HomeworkAssignment.findByPk(req.params.id);
        if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
        await assignment.destroy();
        res.json({ ok: true });
    } catch (err) {
        next(err);
    }
});

export default router;