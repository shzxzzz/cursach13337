// src/api/hooks/useLesson.js
import { useState, useEffect, useCallback } from 'react';
import lessonAPI from '../lessonAPI.js';

export function useLesson(lessonId) {
    const [lesson, setLesson] = useState(null);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [relatedData, setRelatedData] = useState({
        files: [],
        homework: null,
        previousLesson: null,
        nextLesson: null,
        progress: null
    });

    const fetchLesson = useCallback(async () => {
        console.log('Fetching lesson with ID:', lessonId);

        if (!lessonId) {
            setError('Lesson ID is required');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Получаем полные данные урока
            const data = await lessonAPI.getFullLessonData(lessonId);

            console.log('Full lesson data:', data);

            // Форматируем данные для компонента
            const formattedLesson = {
                id: data.lesson.id,
                title: data.lesson.title || 'Без названия',
                description: data.lesson.description || '',
                video_url: data.lesson.video_url || '',
                order_index: data.lesson.order_index || 0,
                module_id: data.lesson.module_id
            };

            setLesson(formattedLesson);

            // Сохраняем курс
            if (data.course) {
                const formattedCourse = {
                    id: data.course.id,
                    title: data.course.title || 'Курс',
                    teacher: data.course.teacher ?
                        `${data.course.teacher.first_name || ''} ${data.course.teacher.last_name || ''}`.trim() :
                        'Преподаватель'
                };
                setCourse(formattedCourse);
            }

            // Форматируем файлы
            const formattedFiles = (data.files || []).map(file => {
                const fileName = file.file_name || '';
                const fileType = file.file_type || '';
                const extension = getFileExtension(fileName);

                return {
                    id: file.id,
                    type: getFileType(fileType, extension),
                    name: fileName,
                    format: extension,
                    size: formatFileSize(file.file_size || 0),
                    icon: getFileIcon(fileType, extension),
                    fileData: file,
                    downloadUrl: file.file_url || null
                };
            });

            // Форматируем домашнее задание
            let formattedHomework = null;
            if (data.homework) {
                formattedHomework = {
                    id: data.homework.id,
                    title: data.homework.title || 'Домашнее задание',
                    description: data.homework.description || '',
                    deadline: formatDeadline(data.homework.deadline_days),
                    deadline_days: data.homework.deadline_days,
                    status: 'pending'
                };
            }

            // Форматируем соседние уроки
            const formattedPrevious = data.adjacentLessons?.previous ? {
                id: data.adjacentLessons.previous.id,
                title: data.adjacentLessons.previous.title,
                course: data.course?.title || 'Курс'
            } : null;

            const formattedNext = data.adjacentLessons?.next ? {
                id: data.adjacentLessons.next.id,
                title: data.adjacentLessons.next.title,
                course: data.course?.title || 'Курс'
            } : null;

            setRelatedData({
                files: formattedFiles,
                homework: formattedHomework,
                previousLesson: formattedPrevious,
                nextLesson: formattedNext,
                progress: data.progress || null
            });

        } catch (err) {
            console.error('Error fetching lesson:', err);
            setError(err.message || 'Ошибка при загрузке урока');
            setLesson(null);
            setCourse(null);
        } finally {
            setLoading(false);
        }
    }, [lessonId]);

    // Вспомогательные функции
    const getFileType = (fileType, extension) => {
        const typeMap = {
            'pdf': 'PDF документ',
            'doc': 'Word документ',
            'docx': 'Word документ',
            'xls': 'Excel таблица',
            'xlsx': 'Excel таблица',
            'ppt': 'Презентация',
            'pptx': 'Презентация',
            'txt': 'Текстовый файл',
            'zip': 'Архив',
            'rar': 'Архив',
            'jpg': 'Изображение',
            'jpeg': 'Изображение',
            'png': 'Изображение',
            'gif': 'Изображение',
            'mp4': 'Видео',
            'avi': 'Видео',
            'mov': 'Видео',
            'mp3': 'Аудио',
            'wav': 'Аудио'
        };

        const typeFromFileType = typeMap[fileType?.toLowerCase()];
        if (typeFromFileType) return typeFromFileType;

        const typeFromExtension = typeMap[extension?.toLowerCase()];
        if (typeFromExtension) return typeFromExtension;

        return 'Файл';
    };

    const getFileExtension = (fileName) => {
        const parts = fileName.split('.');
        return parts.length > 1 ? parts.pop().toUpperCase() : '';
    };

    const getFileIcon = (fileType, extension) => {
        const icons = {
            'pdf': 'pdf',
            'doc': 'word',
            'docx': 'word',
            'xls': 'excel',
            'xlsx': 'excel',
            'ppt': 'presentation',
            'pptx': 'presentation',
            'txt': 'text',
            'zip': 'archive',
            'rar': 'archive',
            'jpg': 'image',
            'jpeg': 'image',
            'png': 'image',
            'gif': 'image',
            'mp4': 'video',
            'avi': 'video',
            'mov': 'video',
            'mp3': 'audio',
            'wav': 'audio'
        };

        const iconFromFileType = icons[fileType?.toLowerCase()];
        if (iconFromFileType) return iconFromFileType;

        const iconFromExtension = icons[extension?.toLowerCase()];
        if (iconFromExtension) return iconFromExtension;

        return 'document';
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDeadline = (deadlineDays) => {
        if (!deadlineDays) return 'Без дедлайна';
        const deadlineDate = new Date();
        deadlineDate.setDate(deadlineDate.getDate() + deadlineDays);
        return `До ${deadlineDate.toLocaleDateString('ru-RU')}`;
    };

    // Загрузить файл
    const downloadFile = useCallback(async (file) => {
        try {
            if (file.downloadUrl) {
                window.open(file.downloadUrl, '_blank');
                return true;
            }

            const response = await lessonAPI.downloadFile(file.id);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = file.name || 'download';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                return true;
            }
            return false;
        } catch (err) {
            console.error('Error downloading file:', err);
            return false;
        }
    }, []);

    useEffect(() => {
        fetchLesson();
    }, [fetchLesson]);

    const refresh = () => {
        fetchLesson();
    };

    return {
        // Данные
        lesson,
        course,
        relatedData,

        // Статусы
        loading,
        error,

        // Функции
        refresh,
        downloadFile
    };
}