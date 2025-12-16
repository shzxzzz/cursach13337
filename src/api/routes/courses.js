import express from 'express';
import { User, Course, Module, Lesson } from '../../models/index.js';

const router = express.Router();

// CREATE
router.post('/', async (req, res, next) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).json(course);
    } catch (err) {
        next(err);
    }
});

// READ ALL
router.get('/', async (req, res, next) => {
    try {
        const courses = await Course.findAll({
            include: [
                {
                    model: Module,
                    as: 'modules',
                    include: [
                        {
                            model: Lesson,
                            as: 'lessons',
                            attributes: ['id'],
                        },
                    ],
                },
            ],
        });

        const result = courses.map(course => {
            const json = course.toJSON();

            const lessonsCount = json.modules.reduce(
                (sum, module) => sum + module.lessons.length,
                0
            );

            return {
                ...json,
                lessons_count: lessonsCount,
            };
        });

        res.json(result);
    } catch (err) {
        next(err);
    }
});

// READ ONE
router.get('/:id', async (req, res, next) => {
    try {
        const course = await Course.findByPk(req.params.id, {
            include: [
                {
                    model: Module,
                    as: 'modules',
                    include: [
                        {
                            model: Lesson,
                            as: 'lessons',
                            attributes: ['id'],
                        },
                    ],
                },
                { model: User, as: 'teacher', attributes: [ 'id', 'first_name', 'last_name', 'avatar_url', 'bio', 'experience_years', 'role'] }
            ],
        });

        if (!course) return res.status(404).json({ error: 'Course not found' });

        const json = course.toJSON();
        const lessonsCount = json.modules.reduce(
            (sum, module) => sum + module.lessons.length,
            0
        );

        res.json({ ...json, lessons_count: lessonsCount });
    } catch (err) {
        next(err);
    }
});

// UPDATE
router.put('/:id', async (req, res, next) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (!course) return res.status(404).json({ error: 'Course not found' });

        await course.update(req.body);
        res.json(course);
    } catch (err) {
        next(err);
    }
});

// DELETE
router.delete('/:id', async (req, res, next) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (!course) return res.status(404).json({ error: 'Course not found' });

        await course.destroy();
        res.json({ ok: true });
    } catch (err) {
        next(err);
    }
});

export default router;
