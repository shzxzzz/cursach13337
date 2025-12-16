// src/api/cabinetAPI.js
const API_BASE_URL = 'http://localhost:3000/api';

class CabinetApi {
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

    // Получить всю информацию для дашборда
    async getDashboard() {
        return await this.request('/cabinet/dashboard');
    }

    // Получить только статистику
    async getStats() {
        return await this.request('/cabinet/stats');
    }

    // Отметить урок как пройденный
    async completeLesson(lessonId, timeSpentMinutes = 0) {
        return await this.request('/cabinet/complete-lesson', {
            method: 'POST',
            body: { lessonId, timeSpentMinutes }
        });
    }
}

// Создаем и экспортируем один экземпляр
const cabinetApi = new CabinetApi();
export default cabinetApi;