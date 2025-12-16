import express from 'express';
import { Enrollment } from '../../models/index.js';

const router = express.Router();

// CREATE
router.post('/', async (req, res, next) => {
    try {
        const enrollment = await Enrollment.create(req.body);
        res.status(201).json(enrollment);
    } catch (err) {
        next(err);
    }
});

// READ ALL
router.get('/', async (req, res, next) => {
    try {
        const enrollments = await Enrollment.findAll();
        res.json(enrollments);
    } catch (err) {
        next(err);
    }
});

// READ ONE
router.get('/:id', async (req, res, next) => {
    try {
        const enrollment = await Enrollment.findByPk(req.params.id);
        if (!enrollment) return res.status(404).json({ error: 'Enrollment not found' });
        res.json(enrollment);
    } catch (err) {
        next(err);
    }
});

// UPDATE
router.put('/:id', async (req, res, next) => {
    try {
        const enrollment = await Enrollment.findByPk(req.params.id);
        if (!enrollment) return res.status(404).json({ error: 'Enrollment not found' });
        await enrollment.update(req.body);
        res.json(enrollment);
    } catch (err) {
        next(err);
    }
});

// DELETE
router.delete('/:id', async (req, res, next) => {
    try {
        const enrollment = await Enrollment.findByPk(req.params.id);
        if (!enrollment) return res.status(404).json({ error: 'Enrollment not found' });
        await enrollment.destroy();
        res.json({ ok: true });
    } catch (err) {
        next(err);
    }
});

export default router;
