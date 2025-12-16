import express from 'express';
import { LessonFile, Lesson } from '../../models/index.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
    try {
        const payload = req.body;

        if (Array.isArray(payload)) {
            const lessonIds = [...new Set(payload.map(p => p.lesson_id).filter(Boolean))];
            if (lessonIds.length === 0) {
                return res.status(400).json({ error: 'Нужно указать lesson_id в каждом файле' });
            }

            const found = await Promise.all(lessonIds.map(id => Lesson.findByPk(id)));
            const missing = lessonIds.filter((id, i) => !found[i]);
            if (missing.length) {
                return res.status(400).json({ error: `Уроки не найдены: ${missing.join(', ')}` });
            }

            const created = await LessonFile.bulkCreate(payload, { returning: true });
            return res.status(201).json(created);
        }

        const { lesson_id } = payload;
        if (!lesson_id) {
            return res.status(400).json({ error: 'lesson_id is required' });
        }

        const lesson = await Lesson.findByPk(lesson_id);
        if (!lesson) {
            return res.status(400).json({ error: 'Lesson not found' });
        }

        const file = await LessonFile.create(payload);
        return res.status(201).json(file);
    } catch (err) {
        next(err);
    }
});

// READ ALL
router.get('/', async (req, res, next) => {
    try {
        const files = await LessonFile.findAll();
        res.json(files);
    } catch (err) {
        next(err);
    }
});

// READ ONE
router.get('/:id', async (req, res, next) => {
    try {
        const file = await LessonFile.findByPk(req.params.id);
        if (!file) return res.status(404).json({ error: 'File not found' });
        res.json(file);
    } catch (err) {
        next(err);
    }
});

// UPDATE
router.put('/:id', async (req, res, next) => {
    try {
        const file = await LessonFile.findByPk(req.params.id);
        if (!file) return res.status(404).json({ error: 'File not found' });
        await file.update(req.body);
        res.json(file);
    } catch (err) {
        next(err);
    }
});

// DELETE
router.delete('/:id', async (req, res, next) => {
    try {
        const file = await LessonFile.findByPk(req.params.id);
        if (!file) return res.status(404).json({ error: 'File not found' });
        await file.destroy();
        res.json({ ok: true });
    } catch (err) {
        next(err);
    }
});

export default router;