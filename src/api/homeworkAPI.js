// src/api/homeworkAPI.js
const API_BASE_URL = 'http://localhost:3000/api';

class HomeworkApi {
    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    // Общая функция для запросов
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const token = localStorage.getItem('token');

        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        };

        const config = {
            ...options,
            headers,
            body: options.body ? JSON.stringify(options.body) : null
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                    throw new Error('Требуется авторизация');
                }

                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Ошибка ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API Error (${endpoint}):`, error.message);
            throw error;
        }
    }

    // === ДОМАШНИЕ ЗАДАНИЯ СТУДЕНТА ===

    // Получить все домашние задания студента
    async getStudentHomeworks() {
        return await this.request('/student-homeworks');
    }

    // Получить домашнее задание студента по ID
    async getStudentHomeworkById(homeworkId) {
        return await this.request(`/student-homeworks/${homeworkId}`);
    }

    // Получить домашние задания с детальной информацией
    async getStudentHomeworksWithDetails() {
        try {
            const homeworks = await this.getStudentHomeworks();

            // Получаем информацию о заданиях
            const detailedHomeworks = await Promise.all(
                homeworks.map(async (homework) => {
                    try {
                        // Получаем информацию о задании
                        const assignment = await this.request(`/homework-assignments/${homework.homework_assignment_id}`);

                        // Получаем информацию об уроке
                        const lesson = await this.request(`/lessons/${assignment.lesson_id}`);

                        // Получаем информацию о модуле
                        const module = await this.request(`/modules/${lesson.module_id}`);

                        // Получаем информацию о курсе
                        const course = await this.request(`/courses/${module.course_id}`);

                        return {
                            id: homework.id,
                            title: assignment.title || 'Домашнее задание',
                            description: assignment.description || '',
                            course: course.title || 'Курс',
                            lesson: lesson.title || 'Урок',
                            status: this.mapHomeworkStatus(homework.status),
                            deadline: this.formatDeadline(assignment.deadline_days),
                            submittedDate: homework.submitted_at ? new Date(homework.submitted_at).toLocaleDateString('ru-RU') : '',
                            grade: homework.grade || 0,
                            teacherComment: homework.teacher_comment || '',
                            answer: homework.text_answer || homework.file_url || '',
                            assignmentId: assignment.id,
                            lessonId: lesson.id,
                            courseId: course.id
                        };
                    } catch (error) {
                        console.error('Error loading homework details:', error);
                        return null;
                    }
                })
            );

            return detailedHomeworks.filter(hw => hw !== null);
        } catch (error) {
            console.error('Error getting student homeworks with details:', error);
            throw error;
        }
    }

    // Отправить домашнее задание
    async submitHomework(homeworkId, data) {
        return await this.request(`/student-homeworks/${homeworkId}`, {
            method: 'PUT',
            body: data
        });
    }

    // Создать новую отправку домашнего задания
    async createHomeworkSubmission(data) {
        return await this.request('/student-homeworks', {
            method: 'POST',
            body: data
        });
    }

    // === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===

    // Преобразовать статус из БД в наш формат
    mapHomeworkStatus(dbStatus) {
        const statusMap = {
            'pending': 'waiting',
            'submitted_for_review': 'submitted',
            'graded': 'checked'
        };
        return statusMap[dbStatus] || 'waiting';
    }

    // Преобразовать наш формат статуса в формат БД
    mapStatusToDb(status) {
        const statusMap = {
            'waiting': 'pending',
            'submitted': 'submitted_for_review',
            'checked': 'graded'
        };
        return statusMap[status] || 'pending';
    }

    // Форматировать дедлайн
    formatDeadline(deadlineDays) {
        if (!deadlineDays) return 'Без дедлайна';
        const deadlineDate = new Date();
        deadlineDate.setDate(deadlineDate.getDate() + deadlineDays);
        return `До ${deadlineDate.toLocaleDateString('ru-RU')}`;
    }

    // Получить статистику по домашним заданиям
    async getHomeworkStats() {
        try {
            const homeworks = await this.getStudentHomeworksWithDetails();

            const total = homeworks.length;
            const waiting = homeworks.filter(hw => hw.status === 'waiting').length;
            const submitted = homeworks.filter(hw => hw.status === 'submitted').length;
            const checked = homeworks.filter(hw => hw.status === 'checked').length;

            return {
                total,
                waiting,
                submitted,
                checked
            };
        } catch (error) {
            console.error('Error getting homework stats:', error);
            return {
                total: 0,
                waiting: 0,
                submitted: 0,
                checked: 0
            };
        }
    }

    // Получить незавершенные домашние задания
    async getPendingHomeworks() {
        try {
            const homeworks = await this.getStudentHomeworksWithDetails();
            return homeworks.filter(hw => hw.status === 'waiting');
        } catch (error) {
            console.error('Error getting pending homeworks:', error);
            return [];
        }
    }
}

// Создаем и экспортируем один экземпляр
const homeworkAPI = new HomeworkApi();
export default homeworkAPI;