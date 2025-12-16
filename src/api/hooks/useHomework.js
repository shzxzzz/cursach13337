// src/api/hooks/useHomework.js
import { useState, useEffect, useCallback } from 'react';
import homeworkAPI from '../homeworkAPI.js';

export function useHomework() {
    const [homeworks, setHomeworks] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        waiting: 0,
        submitted: 0,
        checked: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    // Загрузить все домашние задания
    const loadHomeworks = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // Получаем домашние задания с деталями
            const data = await homeworkAPI.getStudentHomeworksWithDetails();
            setHomeworks(data);

            // Получаем статистику
            const statsData = await homeworkAPI.getHomeworkStats();
            setStats(statsData);
        } catch (err) {
            console.error('Error loading homeworks:', err);
            setError(err.message || 'Ошибка при загрузке домашних заданий');
        } finally {
            setLoading(false);
        }
    }, []);

    // Отправить ответ на домашнее задание
    const submitAnswer = useCallback(async (homeworkId, answer, file = null) => {
        try {
            const homework = homeworks.find(hw => hw.id === homeworkId);
            if (!homework) {
                throw new Error('Домашнее задание не найдено');
            }

            const submissionData = {
                text_answer: answer,
                status: homeworkAPI.mapStatusToDb('submitted'),
                submitted_at: new Date().toISOString()
            };

            // Если есть файл, добавляем его URL
            if (file) {
                // Здесь должна быть логика загрузки файла
                // file_url: uploadedFileUrl
            }

            // Проверяем, существует ли уже отправка
            if (homework.id) {
                // Обновляем существующую запись
                await homeworkAPI.submitHomework(homeworkId, submissionData);
            } else {
                // Создаем новую запись
                submissionData.student_id = JSON.parse(localStorage.getItem('user'))?.id;
                submissionData.homework_assignment_id = homework.assignmentId;
                await homeworkAPI.createHomeworkSubmission(submissionData);
            }

            // Обновляем локальное состояние
            const updatedHomeworks = homeworks.map(hw => {
                if (hw.id === homeworkId) {
                    return {
                        ...hw,
                        status: 'submitted',
                        answer: answer,
                        submittedDate: new Date().toLocaleDateString('ru-RU')
                    };
                }
                return hw;
            });

            setHomeworks(updatedHomeworks);

            // Обновляем статистику
            const statsData = await homeworkAPI.getHomeworkStats();
            setStats(statsData);

            return true;
        } catch (err) {
            console.error('Error submitting homework:', err);
            return false;
        }
    }, [homeworks]);

    // Обновить оценку (для тестирования)
    const changeGrade = useCallback((homeworkId) => {
        const updatedHomeworks = homeworks.map(hw => {
            if (hw.id === homeworkId) {
                const newGrade = hw.grade === 5 ? 1 : hw.grade + 1;
                return {
                    ...hw,
                    grade: newGrade
                };
            }
            return hw;
        });

        setHomeworks(updatedHomeworks);
    }, [homeworks]);

    // Обновить статус (для тестирования)
    const changeStatus = useCallback((homeworkId, newStatus) => {
        const updatedHomeworks = homeworks.map(hw => {
            if (hw.id === homeworkId) {
                return {
                    ...hw,
                    status: newStatus
                };
            }
            return hw;
        });

        setHomeworks(updatedHomeworks);

        // Обновляем статистику
        const updatedStats = {
            total: updatedHomeworks.length,
            waiting: updatedHomeworks.filter(hw => hw.status === 'waiting').length,
            submitted: updatedHomeworks.filter(hw => hw.status === 'submitted').length,
            checked: updatedHomeworks.filter(hw => hw.status === 'checked').length
        };

        setStats(updatedStats);
    }, [homeworks]);

    // Обновить данные
    const refresh = useCallback(async () => {
        setRefreshing(true);
        await loadHomeworks();
        setRefreshing(false);
    }, [loadHomeworks]);

    useEffect(() => {
        loadHomeworks();
    }, [loadHomeworks]);

    return {
        // Данные
        homeworks,
        stats,

        // Статусы
        loading,
        error,
        refreshing,

        // Функции
        submitAnswer,
        changeGrade,
        changeStatus,
        refresh
    };
}