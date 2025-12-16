import express from 'express';
import { CourseOutcome, Course } from '../../models/index.js';

const router = express.Router();

// CREATE
router.post('/', async (req, res, next) => {
    try {
        const payload = req.body;

        if (Array.isArray(payload)) {
            const courseIds = [...new Set(payload.map(p => p.course_id).filter(Boolean))];
            if (courseIds.length === 0) {
                return res.status(400).json({ error: 'Нужно указать course_id в каждом outcome' });
            }

            const found = await Promise.all(courseIds.map(id => Course.findByPk(id)));
            const missing = courseIds.filter((id, i) => !found[i]);
            if (missing.length) {
                return res.status(400).json({ error: `Курсы не найдены: ${missing.join(', ')}` });
            }

            const created = await CourseOutcome.bulkCreate(payload, { returning: true });
            return res.status(201).json(created);
        }

        const { course_id } = payload;
        if (!course_id) {
            return res.status(400).json({ error: 'course_id is required' });
        }

        const course = await Course.findByPk(course_id);
        if (!course) {
            return res.status(400).json({ error: 'Course not found' });
        }

        const outcome = await CourseOutcome.create(payload);
        return res.status(201).json(outcome);
    } catch (err) {
        next(err);
    }
});

// READ all
router.get('/', async (req, res, next) => {
    try {
        const outcomes = await CourseOutcome.findAll();
        res.json(outcomes);
    } catch (err) {
        next(err);
    }
});

// READ one
router.get('/:id', async (req, res, next) => {
    try {
        const outcome = await CourseOutcome.findByPk(req.params.id);
        if (!outcome) return res.status(404).json({ error: 'Outcome not found' });
        res.json(outcome);
    } catch (err) {
        next(err);
    }
});

// UPDATE
router.put('/:id', async (req, res, next) => {
    try {
        const outcome = await CourseOutcome.findByPk(req.params.id);
        if (!outcome) return res.status(404).json({ error: 'Outcome not found' });
        await outcome.update(req.body);
        res.json(outcome);
    } catch (err) {
        next(err);
    }
});

// DELETE
router.delete('/:id', async (req, res, next) => {
    try {
        const outcome = await CourseOutcome.findByPk(req.params.id);
        if (!outcome) return res.status(404).json({ error: 'Outcome not found' });
        await outcome.destroy();
        res.json({ ok: true });
    } catch (err) {
        next(err);
    }
});

export default router;