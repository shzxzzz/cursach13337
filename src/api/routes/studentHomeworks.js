import express from 'express';
import { StudentHomework } from '../../models/index.js';

const router = express.Router();

     
router.post('/', async (req, res, next) => {
    try {
        const homework = await StudentHomework.create(req.body);
        res.status(201).json(homework);
    } catch (err) {
        next(err);
    }
});

     
router.get('/', async (req, res, next) => {
    try {
        const homeworks = await StudentHomework.findAll();
        res.json(homeworks);
    } catch (err) {
        next(err);
    }
});

     
router.get('/:id', async (req, res, next) => {
    try {
        const homework = await StudentHomework.findByPk(req.params.id);
        if (!homework) return res.status(404).json({ error: 'Homework not found' });
        res.json(homework);
    } catch (err) {
        next(err);
    }
});

     
router.put('/:id', async (req, res, next) => {
    try {
        const homework = await StudentHomework.findByPk(req.params.id);
        if (!homework) return res.status(404).json({ error: 'Homework not found' });
        await homework.update(req.body);
        res.json(homework);
    } catch (err) {
        next(err);
    }
});

     
router.delete('/:id', async (req, res, next) => {
    try {
        const homework = await StudentHomework.findByPk(req.params.id);
        if (!homework) return res.status(404).json({ error: 'Homework not found' });
        await homework.destroy();
        res.json({ ok: true });
    } catch (err) {
        next(err);
    }
});

export default router;
