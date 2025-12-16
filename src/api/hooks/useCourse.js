import { useState, useEffect, useCallback } from 'react';
import { coursesAPI, lessonsAPI } from '../authAPI.js';

export function useCourse(courseId) {
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Функция для загрузки уроков по ID
    const loadLessonsForModules = useCallback(async (modules) => {
        try {
            // Собираем все ID уроков из всех модулей
            const allLessonIds = [];
            const moduleLessonMap = {};

            modules.forEach(module => {
                if (module.lessons && Array.isArray(module.lessons)) {
                    module.lessons.forEach(lesson => {
                        if (lesson.id) {
                            allLessonIds.push(lesson.id);
                            if (!moduleLessonMap[module.id]) {
                                moduleLessonMap[module.id] = [];
                            }
                            moduleLessonMap[module.id].push(lesson.id);
                        }
                    });
                }
            });

            if (allLessonIds.length === 0) {
                return modules; // Нет уроков для загрузки
            }

            // Загружаем все уроки
            const lessonsData = await lessonsAPI.getByIds(allLessonIds);

            // Создаем маппинг ID урока -> данные
            const lessonsMap = {};
            lessonsData.forEach(lesson => {
                if (lesson && lesson.id) {
                    lessonsMap[lesson.id] = lesson;
                }
            });

            // Обновляем модули с загруженными уроками
            return modules.map(module => {
                const updatedLessons = (module.lessons || []).map(lesson => {
                    if (lesson.id && lessonsMap[lesson.id]) {
                        return {
                            id: lesson.id,
                            title: lessonsMap[lesson.id].title || 'Урок',
                            description: lessonsMap[lesson.id].description || '',
                            orderIndex: lessonsMap[lesson.id].order_index || 0,
                            video_url: lessonsMap[lesson.id].video_url || '',
                            duration: lessonsMap[lesson.id].duration || ''
                        };
                    }
                    return lesson;
                }).sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

                return {
                    ...module,
                    lessons: updatedLessons
                };
            });
        } catch (err) {
            console.error('Error loading lessons:', err);
            return modules; // Возвращаем модули без обновленных уроков
        }
    }, []);

    const fetchCourse = useCallback(async () => {
        if (!courseId) {
            setError('Course ID is required');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await coursesAPI.getById(courseId);

            console.log('Course data from API:', data); // Для отладки

            // Получаем модули
            let modules = data.modules || [];

            // Загружаем уроки для модулей
            modules = await loadLessonsForModules(modules);

            // Форматируем данные для компонента
            const formattedCourse = {
                id: data.id,
                title: data.title || 'Без названия',
                shortDescription: data.short_description || 'Описание отсутствует',
                description: data.full_description || 'Описание отсутствует',
                duration: data.duration ? `${data.duration} недель` : 'Не указано',
                price: data.price ? new Intl.NumberFormat('ru-RU').format(data.price) : '0',
                teacher: data.teacher
                    ? `${data.teacher.first_name || ''} ${data.teacher.last_name || ''}`.trim()
                    : 'Информация отсутствует',
                // Внутри fetchCourse, после получения данных
                teacherInfo: {
                    position: data.teacher?.position || 'Преподаватель',
                    experience: data.teacher?.experience_years
                        ? `${data.teacher.experience_years} лет опыта`
                        : 'Опыт не указан',
                    achievements: data.teacher?.bio || 'Биография преподавателя',
                    avatar: data.teacher?.avatar_url || null
                },

                modules: modules.map(module => ({
                    id: module.id,
                    title: module.title || 'Модуль',
                    orderIndex: module.order_index || 0,
                    lessons: module.lessons || []
                })).sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)),

                studentCount: data.student_count || 0,
                isPublished: data.is_published || false,
                icon: data.icon || null,
                benefits: getBenefits(data.benefits)
            };

            setCourse(formattedCourse);
        } catch (err) {
            console.error('Error fetching course:', err);
            setError(err.message || 'Ошибка при загрузке курса');
            setCourse(null);
        } finally {
            setLoading(false);
        }
    }, [courseId, loadLessonsForModules]);

    useEffect(() => {
        fetchCourse();
    }, [fetchCourse]);

    const refresh = () => {
        fetchCourse();
    };

    return {
        course,
        loading,
        error,
        refresh
    };
}

// Вспомогательная функция для обработки benefits
function getBenefits(benefitsData) {
    if (Array.isArray(benefitsData)) {
        return benefitsData;
    }

    if (typeof benefitsData === 'string') {
        try {
            const parsed = JSON.parse(benefitsData);
            return Array.isArray(parsed) ? parsed : getDefaultBenefits();
        } catch {
            return getDefaultBenefits();
        }
    }

    return getDefaultBenefits();
}

function getDefaultBenefits() {
    return [
        "Навыки управления проектами с нуля до PRO",
        "Умение работать с современными методологиями",
        "Практический опыт на реальных кейсах",
        "Сертификат для вашего резюме",
        "Поддержка куратора на всех этапах"
    ];
}