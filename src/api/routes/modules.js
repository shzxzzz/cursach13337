import express from 'express';
import { Module, Course } from '../../models/index.js';

const router = express.Router();

     
router.post('/', async (req, res, next) => {
    try {
        const payload = req.body;

        if (Array.isArray(payload)) {
            const courseIds = [...new Set(payload.map(p => p.course_id).filter(Boolean))];
            if (courseIds.length === 0) {
                return res.status(400).json({ error: 'Нужно указать course_id в каждом модуле' });
            }

            const found = await Promise.all(courseIds.map(id => Course.findByPk(id)));
            const missing = courseIds.filter((id, i) => !found[i]);
            if (missing.length) {
                return res.status(400).json({ error: `Курсы не найдены: ${missing.join(', ')}` });
            }

            const created = await Module.bulkCreate(payload, { returning: true });
            return res.status(201).json(created);
        }

        const { course_id } = payload;
        if (!course_id) return res.status(400).json({ error: 'course_id is required' });

        const course = await Course.findByPk(course_id);
        if (!course) return res.status(400).json({ error: 'Course not found' });

        const module = await Module.create(payload);
        return res.status(201).json(module);
    } catch (err) {
        next(err);
    }
});

     
router.get('/', async (req, res, next) => {
    try {
        const modules = await Module.findAll();
        res.json(modules);
    } catch (err) {
        next(err);
    }
});

     
router.get('/:id', async (req, res, next) => {
    try {
        const module = await Module.findByPk(req.params.id);
        if (!module) return res.status(404).json({ error: 'Module not found' });
        res.json(module);
    } catch (err) {
        next(err);
    }
});

     
router.put('/:id', async (req, res, next) => {
    try {
        const module = await Module.findByPk(req.params.id);
        if (!module) return res.status(404).json({ error: 'Module not found' });
        await module.update(req.body);
        res.json(module);
    } catch (err) {
        next(err);
    }
});

     
router.delete('/:id', async (req, res, next) => {
    try {
        const module = await Module.findByPk(req.params.id);
        if (!module) return res.status(404).json({ error: 'Module not found' });
        await module.destroy();
        res.json({ ok: true });
    } catch (err) {
        next(err);
    }
});

export default router;
