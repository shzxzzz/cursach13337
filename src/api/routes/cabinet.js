// routes/cabinet.js
import express from 'express';
import {
    User,
    Course,
    Module,
    Lesson,
    Enrollment,
    StudentLessonProgress,
    HomeworkAssignment,
    StudentHomework
} from '../../models/index.js';
import { authenticateToken } from '../../components/checkAuth.js';

const router = express.Router();

// Все маршруты кабинета требуют аутентификации
router.use(authenticateToken);

// Вспомогательная функция для получения курсов с прогрессом
// Вспомогательная функция для получения курсов с прогрессом
async function getCoursesWithProgress(userId) {
    const enrollments = await Enrollment.findAll({
        where: { student_id: userId },
        include: [
            {
                model: Course,
                as: 'course',
                include: [
                    {
                        model: User,
                        as: 'teacher',
                        attributes: ['first_name', 'last_name']
                    }
                ]
            }
        ]
    });

    const coursesWithProgress = await Promise.all(
        enrollments.map(async (enrollment) => {
            const course = enrollment.course;

            // Получаем все уроки курса
            const modules = await Module.findAll({
                where: { course_id: course.id },
                include: [
                    {
                        model: Lesson,
                        as: 'lessons',
                        attributes: ['id']
                    }
                ]
            });

            // Собираем все ID уроков
            const lessonIds = modules.flatMap(module =>
                module.lessons?.map(lesson => lesson.id) || []
            );

            const totalLessons = lessonIds.length;

            // Получаем пройденные уроки
            let completedLessons = 0;
            if (lessonIds.length > 0) {
                completedLessons = await StudentLessonProgress.count({
                    where: {
                        student_id: userId,
                        lesson_id: lessonIds,
                        is_completed: true
                    }
                });
            }

            // Рассчитываем прогресс
            const progress = totalLessons > 0
                ? Math.round((completedLessons / totalLessons) * 100)
                : 0;

            return {
                id: course.id,
                title: course.title,
                teacher: course.teacher ?
                    `${course.teacher.first_name} ${course.teacher.last_name}` :
                    'Не указан',
                totalLessons,
                completedLessons,
                progress,
                enrolledAt: enrollment.enrolled_at,
                icon: course.icon
            };
        })
    );

    return coursesWithProgress;
}

// 1. Получить общую статистику пользователя
router.get('/stats', async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Активные курсы
        const activeCourses = await Enrollment.count({
            where: { student_id: userId }
        });

        // Пройденные уроки
        const completedLessons = await StudentLessonProgress.count({
            where: {
                student_id: userId,
                is_completed: true
            }
        });

        // Часы обучения - ВРЕМЕННО считаем 1 урок = 1 час
        const hoursStudied = completedLessons;

        res.json({
            activeCourses,
            completedLessons,
            hoursStudied,
            completedCourses: 0
        });
    } catch (err) {
        next(err);
    }
});

// 5. Получить все данные кабинета одним запросом
router.get('/dashboard', async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Параллельно загружаем все данные
        const [stats, courses, lessons, homeworks] = await Promise.all([
            // Статистика
            (async () => {
                const activeCourses = await Enrollment.count({
                    where: { student_id: userId }
                });
                const completedLessons = await StudentLessonProgress.count({
                    where: {
                        student_id: userId,
                        is_completed: true
                    }
                });
                // Часы обучения - ВРЕМЕННО
                const hoursStudied = completedLessons;

                return {
                    activeCourses,
                    completedLessons,
                    hoursStudied,
                    completedCourses: 0
                };
            })(),

            // Курсы (используем общую функцию)
            (async () => {
                return await getCoursesWithProgress(userId);
            })(),

            // Следующие уроки
            (async () => {
                const enrollments = await Enrollment.findAll({
                    where: { student_id: userId },
                    include: [{
                        model: Course,
                        as: 'course',
                        include: [{
                            model: Module,
                            as: 'modules',
                            include: [{
                                model: Lesson,
                                as: 'lessons',
                                order: [['order_index', 'ASC']]
                            }]
                        }]
                    }]
                });

                const upcomingLessons = [];

                for (const enrollment of enrollments) {
                    const course = enrollment.course;

                    const completedLessons = await StudentLessonProgress.findAll({
                        where: {
                            student_id: userId,
                            is_completed: true
                        },
                        attributes: ['lesson_id']
                    });
                    const completedLessonIds = completedLessons.map(l => l.lesson_id);

                    for (const module of course.modules || []) {
                        const nextLesson = module.lessons?.find(
                            lesson => !completedLessonIds.includes(lesson.id)
                        );

                        if (nextLesson) {
                            upcomingLessons.push({
                                id: nextLesson.id,
                                title: nextLesson.title,
                                courseId: course.id,
                                courseTitle: course.title,
                                duration: nextLesson.duration || 'Не указано',
                                moduleTitle: module.title
                            });
                            break;
                        }
                    }
                }

                return upcomingLessons.slice(0, 3);
            })(),

            // Домашние задания
            (async () => {
                const homeworks = await StudentHomework.findAll({
                    where: { student_id: userId },
                    include: [{
                        model: HomeworkAssignment,
                        as: 'assignment',
                        attributes: ['title', 'description']
                    }],
                    order: [['created_at', 'DESC']],
                    limit: 5
                });

                return homeworks.map(homework => ({
                    id: homework.id,
                    title: homework.assignment?.title || 'Задание',
                    status: homework.status,
                    submittedAt: homework.submitted_at,
                    score: homework.score
                }));
            })()
        ]);

        res.json({
            stats,
            courses,
            upcomingLessons: lessons,
            homeworks
        });
    } catch (err) {
        console.error('Dashboard error:', err);
        next(err);
    }
});

router.get('/my-courses', async (req, res, next) => {
    try {
        const userId = req.user.id;

        const enrollments = await Enrollment.findAll({
            where: { student_id: userId },
            include: [
                {
                    model: Course,
                    as: 'course',
                    attributes: ['id', 'title', 'icon']
                }
            ]
        });

        const courses = enrollments.map(enrollment => ({
            id: enrollment.course.id,
            title: enrollment.course.title,
            icon: enrollment.course.icon
        }));

        res.json(courses);
    } catch (err) {
        next(err);
    }
});

// Получить следующие уроки
router.get('/upcoming-lessons', async (req, res, next) => {
    try {
        const userId = req.user.id;

        const enrollments = await Enrollment.findAll({
            where: { student_id: userId },
            include: [{
                model: Course,
                as: 'course',
                include: [{
                    model: Module,
                    as: 'modules',
                    include: [{
                        model: Lesson,
                        as: 'lessons',
                        order: [['order_index', 'ASC']]
                    }]
                }]
            }]
        });

        const upcomingLessons = [];

        for (const enrollment of enrollments) {
            const course = enrollment.course;

            const completedLessons = await StudentLessonProgress.findAll({
                where: {
                    student_id: userId,
                    is_completed: true
                },
                attributes: ['lesson_id']
            });
            const completedLessonIds = completedLessons.map(l => l.lesson_id);

            for (const module of course.modules || []) {
                const nextLesson = module.lessons?.find(
                    lesson => !completedLessonIds.includes(lesson.id)
                );

                if (nextLesson) {
                    upcomingLessons.push({
                        id: nextLesson.id,
                        title: nextLesson.title,
                        courseId: course.id,
                        courseTitle: course.title,
                        moduleTitle: module.title
                    });
                    break;
                }
            }
        }

        res.json(upcomingLessons.slice(0, 3));
    } catch (err) {
        next(err);
    }
});

// Получить домашние задания
router.get('/homeworks', async (req, res, next) => {
    try {
        const userId = req.user.id;

        const homeworks = await StudentHomework.findAll({
            where: { student_id: userId },
            include: [{
                model: HomeworkAssignment,
                as: 'assignment',
                attributes: ['title', 'description']
            }],
            order: [['created_at', 'DESC']],
            limit: 5
        });

        const result = homeworks.map(homework => ({
            id: homework.id,
            title: homework.assignment?.title || 'Задание',
            status: homework.status,
            submittedAt: homework.submitted_at,
            grade: homework.grade
        }));

        res.json(result);
    } catch (err) {
        next(err);
    }
});

// Отметить урок как пройденный
router.post('/complete-lesson', async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { lessonId, timeSpentMinutes = 0 } = req.body;

        // Проверяем, существует ли урок
        const lesson = await Lesson.findByPk(lessonId);
        if (!lesson) {
            return res.status(404).json({ error: 'Урок не найден' });
        }

        // Создаем или обновляем прогресс
        const [progress, created] = await StudentLessonProgress.findOrCreate({
            where: {
                student_id: userId,
                lesson_id: lessonId
            },
            defaults: {
                is_completed: true,
                last_accessed_at: new Date(),
                time_spent_minutes: timeSpentMinutes
            }
        });

        if (!created) {
            await progress.update({
                is_completed: true,
                last_accessed_at: new Date(),
                time_spent_minutes: timeSpentMinutes
            });
        }

        res.json({
            success: true,
            message: 'Урок отмечен как пройденный',
            progress
        });
    } catch (err) {
        next(err);
    }
});

export default router;