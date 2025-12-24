import express from 'express';
import { Enrollment } from '../../models/index.js';

const router = express.Router();

// CREATE
router.post('/', async (req, res, next) => {
    try {
        const { student_id, course_id } = req.body;

        // Проверяем, не записан ли уже студент на этот курс
        const existingEnrollment = await Enrollment.findOne({
            where: { student_id, course_id }
        });

        if (existingEnrollment) {
            return res.status(400).json({
                error: 'Студент уже записан на этот курс'
            });
        }

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
// проверка на существование
router.get('/', async (req, res, next) => {
    try {
        const { student_id, course_id } = req.query;
        let where = {};

        if (student_id) {
            where.student_id = student_id;
        }

        if (course_id) {
            where.course_id = course_id;
        }

        const enrollments = await Enrollment.findAll({ where });
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
