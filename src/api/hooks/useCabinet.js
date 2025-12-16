// src/hooks/useCabinet.js
import { useState, useEffect, useCallback } from 'react';
// Импортируем правильно - это default export, поэтому без фигурных скобок
import cabinetApi from '../cabinetAPI.js'; // <-- с маленькой 'p'

export function useCabinet() {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    // Получить данные пользователя из localStorage
    const getUserData = useCallback(() => {
        try {
            const userData = localStorage.getItem('user');
            if (userData) {
                return JSON.parse(userData);
            }
        } catch (err) {
            console.error('Error parsing user data:', err);
        }
        return null;
    }, []);

    // Загрузить все данные кабинета
    const loadDashboard = useCallback(async () => {
        setLoading(true);
        setError(null);

        // Сначала получаем данные пользователя
        const userData = getUserData();
        setUser(userData);

        try {
            const data = await cabinetApi.getDashboard(); // <-- здесь тоже 'cabinetApi'
            setDashboardData(data);
        } catch (err) {
            console.error('Error loading dashboard:', err);
            setError(err.message || 'Ошибка загрузки данных кабинета');
        } finally {
            setLoading(false);
        }
    }, [getUserData]);

    // Загрузить только статистику
    const loadStats = useCallback(async () => {
        try {
            const data = await cabinetApi.getStats(); // <-- здесь тоже
            return data;
        } catch (err) {
            console.error('Error loading stats:', err);
            throw err;
        }
    }, []);

    // Загрузить только курсы
    const loadCourses = useCallback(async () => {
        try {
            const data = await cabinetApi.getMyCourses(); // <-- здесь тоже
            return data;
        } catch (err) {
            console.error('Error loading courses:', err);
            throw err;
        }
    }, []);

    // Загрузить только уроки
    const loadLessons = useCallback(async () => {
        try {
            const data = await cabinetApi.getUpcomingLessons(); // <-- здесь тоже
            return data;
        } catch (err) {
            console.error('Error loading lessons:', err);
            throw err;
        }
    }, []);

    // Загрузить домашние задания
    const loadHomeworks = useCallback(async () => {
        try {
            const data = await cabinetApi.getHomeworks(); // <-- здесь тоже
            return data;
        } catch (err) {
            console.error('Error loading homeworks:', err);
            throw err;
        }
    }, []);

    // Обновить данные
    const refresh = useCallback(() => {
        loadDashboard();
    }, [loadDashboard]);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    return {
        // Данные
        dashboardData,
        user,

        // Статусы
        loading,
        error,

        // Функции загрузки
        loadStats,
        loadCourses,
        loadLessons,
        loadHomeworks,

        // Обновление
        refresh,

        // Утилиты
        getStats: () => dashboardData?.stats || null,
        getCourses: () => dashboardData?.courses || [],
        getUpcomingLessons: () => dashboardData?.upcomingLessons || [],
        getHomeworks: () => dashboardData?.homeworks || []
    };
}