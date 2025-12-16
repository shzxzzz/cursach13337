import express from 'express';
import { Lesson, Module } from '../../models/index.js';

const router = express.Router();

// CREATE
router.post('/', async (req, res, next) => {
    try {
        const payload = req.body;

        if (Array.isArray(payload)) {
            const moduleIds = [...new Set(payload.map(p => p.module_id).filter(Boolean))];

            if (moduleIds.length === 0) {
                return res.status(400).json({ error: 'Нужно указать module_id в каждом уроке' });
            }

            const foundModules = await Promise.all(moduleIds.map(id => Module.findByPk(id)));
            const missingModules = moduleIds.filter((id, i) => !foundModules[i]);

            if (missingModules.length) {
                return res.status(400).json({
                    error: `Модули не найдены: ${missingModules.join(', ')}`
                });
            }

            const createdLessons = await Lesson.bulkCreate(payload, { returning: true });
            return res.status(201).json(createdLessons);
        }

        const { module_id } = payload;
        if (!module_id) {
            return res.status(400).json({ error: 'module_id is required' });
        }

        const module = await Module.findByPk(module_id);
        if (!module) {
            return res.status(400).json({ error: 'Module not found' });
        }

        const lesson = await Lesson.create(payload);
        return res.status(201).json(lesson);
    } catch (err) {
        next(err);
    }
});

router.post('/batch', async (req, res, next) => {
    try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({
                error: 'Необходим массив ID уроков'
            });
        }

        // Убираем дубликаты и пустые значения
        const uniqueIds = [...new Set(ids.filter(id => id && typeof id === 'number'))];

        if (uniqueIds.length === 0) {
            return res.status(400).json({
                error: 'Не переданы корректные ID уроков'
            });
        }

        // Ищем уроки с указанными ID
        const lessons = await Lesson.findAll({
            where: {
                id: uniqueIds
            },
            order: [['order_index', 'ASC']]
        });

        // Проверяем, все ли уроки найдены
        const foundIds = lessons.map(lesson => lesson.id);
        const missingIds = uniqueIds.filter(id => !foundIds.includes(id));

        if (missingIds.length > 0) {
            console.warn(`Некоторые уроки не найдены: ${missingIds.join(', ')}`);
        }

        res.json(lessons);
    } catch (err) {
        console.error('Error in /lessons/batch:', err);
        next(err);
    }
});

// READ ALL
router.get('/', async (req, res, next) => {
    try {
        const lessons = await Lesson.findAll();
        res.json(lessons);
    } catch (err) {
        next(err);
    }
});

// READ ONE
router.get('/:id', async (req, res, next) => {
    try {
        const lesson = await Lesson.findByPk(req.params.id);
        if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
        res.json(lesson);
    } catch (err) {
        next(err);
    }
});

// UPDATE
router.put('/:id', async (req, res, next) => {
    try {
        const lesson = await Lesson.findByPk(req.params.id);
        if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

        if (req.body.module_id) {
            const module = await Module.findByPk(req.body.module_id);
            if (!module) {
                return res.status(400).json({ error: 'Module not found' });
            }
        }

        await lesson.update(req.body);
        res.json(lesson);
    } catch (err) {
        next(err);
    }
});

// DELETE
router.delete('/:id', async (req, res, next) => {
    try {
        const lesson = await Lesson.findByPk(req.params.id);
        if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
        await lesson.destroy();
        res.json({ ok: true });
    } catch (err) {
        next(err);
    }
});

export default router;