     
const API_BASE_URL = 'http://localhost:3000/api';

class LessonApi {
    constructor() {
        this.baseUrl = API_BASE_URL;
    }

         
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

         

         
    async getById(id) {
        return await this.request(`/lessons/${id}`);
    }

         
    async getAll() {
        return await this.request('/lessons');
    }

         
    async getByIds(ids) {
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return [];
        }

        try {
            const response = await this.request('/lessons/batch', {
                method: 'POST',
                body: { ids }
            });
            return response;
        } catch (error) {
            console.error('Error fetching lessons batch:', error);
            const promises = ids.map(id =>
                this.getById(id).catch(() => null)
            );
            const results = await Promise.all(promises);
            return results.filter(lesson => lesson !== null);
        }
    }

         

         
    async getLessonFiles(lessonId) {
        const files = await this.request('/lesson-files');
             
        return files.filter(file => file.lesson_id === parseInt(lessonId));
    }

         
    async uploadFile(lessonId, fileData) {
        const formData = new FormData();
        formData.append('lesson_id', lessonId);
        formData.append('file_name', fileData.name);
        formData.append('file_type', fileData.type);
        if (fileData.file) {
            formData.append('file', fileData.file);
        }

        const url = `${this.baseUrl}/lesson-files`;
        const token = localStorage.getItem('token');

        const config = {
            method: 'POST',
            headers: {
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: formData
        };

        try {
            const response = await fetch(url, config);
            if (!response.ok) {
                throw new Error(`Ошибка ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    }

         
    async deleteFile(fileId) {
        return await this.request(`/lesson-files/${fileId}`, {
            method: 'DELETE'
        });
    }

         
    async downloadFile(fileId) {
        const url = `${this.baseUrl}/lesson-files/${fileId}/download`;
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        };

        return await fetch(url, config);
    }

         

         
    async getHomeworkForLesson(lessonId) {
        const assignments = await this.request('/homework-assignments');
             
        const homework = assignments.filter(hw => hw.lesson_id === parseInt(lessonId));
        return homework.length > 0 ? homework[0] : null;
    }

         
    async getHomeworkById(homeworkId) {
        return await this.request(`/homework-assignments/${homeworkId}`);
    }

         
    async getStudentHomeworks(studentId) {
        return await this.request(`/student-homeworks?student_id=${studentId}`);
    }

         
    async submitHomework(data) {
        return await this.request('/student-homeworks', {
            method: 'POST',
            body: data
        });
    }

         
    async updateHomework(homeworkId, data) {
        return await this.request(`/student-homeworks/${homeworkId}`, {
            method: 'PUT',
            body: data
        });
    }

         

         
    async getLessonProgress(lessonId) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) {
            return null;
        }

        const progress = await this.request('/student-lesson-progress');
             
        const userProgress = progress.filter(p =>
            p.student_id === user.id && p.lesson_id === parseInt(lessonId)
        );
        return userProgress.length > 0 ? userProgress[0] : null;
    }

         
    async markLessonCompleted(lessonId, timeSpentMinutes = 0) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) {
            throw new Error('Пользователь не авторизован');
        }

        return await this.request('/student-lesson-progress', {
            method: 'POST',
            body: {
                student_id: user.id,
                lesson_id: lessonId,
                is_completed: true,
                last_accessed_at: new Date().toISOString(),
                time_spent_minutes: timeSpentMinutes
            }
        });
    }

         
    async updateLessonProgress(progressId, data) {
        return await this.request(`/student-lesson-progress/${progressId}`, {
            method: 'PUT',
            body: data
        });
    }

         

         
    async getLessonModule(moduleId) {
        return await this.request(`/modules/${moduleId}`);
    }

         
    async getLessonCourse(courseId) {
        return await this.request(`/courses/${courseId}`);
    }

         
    async getAdjacentLessons(moduleId, currentOrderIndex) {
        const lessons = await this.request('/lessons');
             
        const moduleLessons = lessons.filter(l => l.module_id === parseInt(moduleId));
        const sortedLessons = moduleLessons.sort((a, b) => a.order_index - b.order_index);
        const currentIndex = sortedLessons.findIndex(l => l.order_index === currentOrderIndex);

        return {
            previous: currentIndex > 0 ? sortedLessons[currentIndex - 1] : null,
            next: currentIndex < sortedLessons.length - 1 ? sortedLessons[currentIndex + 1] : null
        };
    }

         
    async getFullLessonData(lessonId) {
        try {
                 
            const lesson = await this.getById(lessonId);

            console.log('Lesson data:', lesson);

                 
            const [files, homework, progress, module] = await Promise.all([
                this.getLessonFiles(lessonId).catch(() => []),
                this.getHomeworkForLesson(lessonId).catch(() => null),
                this.getLessonProgress(lessonId).catch(() => null),
                this.getLessonModule(lesson.module_id).catch(() => null)
            ]);

            console.log('Files for lesson:', files);
            console.log('Homework for lesson:', homework);

                 
            let course = null;
            if (module && module.course_id) {
                course = await this.getLessonCourse(module.course_id).catch(() => null);
            }

                 
            let adjacentLessons = { previous: null, next: null };
            if (module && lesson.order_index !== undefined) {
                adjacentLessons = await this.getAdjacentLessons(module.id, lesson.order_index).catch(() => ({ previous: null, next: null }));
            }

            return {
                lesson,
                module,
                course,
                files,
                homework,
                progress,
                adjacentLessons
            };
        } catch (error) {
            console.error('Error fetching full lesson data:', error);
            throw error;
        }
    }

         

         
    async searchLessons(query) {
        return await this.request(`/lessons/search?q=${encodeURIComponent(query)}`);
    }

         
    async getLessonsByModule(moduleId) {
        const lessons = await this.request('/lessons');
        return lessons.filter(l => l.module_id === parseInt(moduleId));
    }

         
    async getLessonsByCourse(courseId) {
             
        const modules = await this.request('/modules');
        const courseModules = modules.filter(m => m.course_id === parseInt(courseId));

             
        const allLessons = await this.request('/lessons');
        const courseLessons = allLessons.filter(l =>
            courseModules.some(m => m.id === l.module_id)
        );

        return courseLessons;
    }

         

         
    async checkLessonAccess(lessonId) {
        return await this.request(`/lessons/${lessonId}/access`);
    }

         
    async getLastAccessTime(lessonId) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) {
            return null;
        }

        return await this.request(`/lessons/${lessonId}/last-access?student_id=${user.id}`);
    }
}

     
const lessonAPI = new LessonApi();
export default lessonAPI;