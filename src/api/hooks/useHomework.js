     
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

         
    const loadHomeworks = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
                 
            const data = await homeworkAPI.getStudentHomeworksWithDetails();
            setHomeworks(data);

                 
            const statsData = await homeworkAPI.getHomeworkStats();
            setStats(statsData);
        } catch (err) {
            console.error('Error loading homeworks:', err);
            setError(err.message || 'Ошибка при загрузке домашних заданий');
        } finally {
            setLoading(false);
        }
    }, []);

         
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

                 
            if (file) {
                     
                     
            }

                 
            if (homework.id) {
                     
                await homeworkAPI.submitHomework(homeworkId, submissionData);
            } else {
                     
                submissionData.student_id = JSON.parse(localStorage.getItem('user'))?.id;
                submissionData.homework_assignment_id = homework.assignmentId;
                await homeworkAPI.createHomeworkSubmission(submissionData);
            }

                 
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

                 
            const statsData = await homeworkAPI.getHomeworkStats();
            setStats(statsData);

            return true;
        } catch (err) {
            console.error('Error submitting homework:', err);
            return false;
        }
    }, [homeworks]);

         
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

             
        const updatedStats = {
            total: updatedHomeworks.length,
            waiting: updatedHomeworks.filter(hw => hw.status === 'waiting').length,
            submitted: updatedHomeworks.filter(hw => hw.status === 'submitted').length,
            checked: updatedHomeworks.filter(hw => hw.status === 'checked').length
        };

        setStats(updatedStats);
    }, [homeworks]);

         
    const refresh = useCallback(async () => {
        setRefreshing(true);
        await loadHomeworks();
        setRefreshing(false);
    }, [loadHomeworks]);

    useEffect(() => {
        loadHomeworks();
    }, [loadHomeworks]);

    return {
             
        homeworks,
        stats,

             
        loading,
        error,
        refreshing,

             
        submitAnswer,
        changeGrade,
        changeStatus,
        refresh
    };
}