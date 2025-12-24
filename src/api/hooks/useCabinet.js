import { useState, useEffect, useCallback } from 'react';
import cabinetApi from '../cabinetAPI.js';

export function useCabinet() {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

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

    const loadDashboard = useCallback(async () => {
        setLoading(true);
        setError(null);

        const userData = getUserData();
        setUser(userData);

        try {
            const data = await cabinetApi.getDashboard();
            setDashboardData(data);
        } catch (err) {
            console.error('Error loading dashboard:', err);
            setError(err.message || 'Ошибка загрузки данных кабинета');
        } finally {
            setLoading(false);
        }
    }, [getUserData]);

    const loadStats = useCallback(async () => {
        try {
            const data = await cabinetApi.getStats();
            return data;
        } catch (err) {
            console.error('Error loading stats:', err);
            throw err;
        }
    }, []);

    const loadCourses = useCallback(async () => {
        try {
            const data = await cabinetApi.getMyCourses();
            return data;
        } catch (err) {
            console.error('Error loading courses:', err);
            throw err;
        }
    }, []);

    const loadLessons = useCallback(async () => {
        try {
            const data = await cabinetApi.getUpcomingLessons();
            return data;
        } catch (err) {
            console.error('Error loading lessons:', err);
            throw err;
        }
    }, []);

    const loadHomeworks = useCallback(async () => {
        try {
            const data = await cabinetApi.getHomeworks(); // <-- здесь тоже
            return data;
        } catch (err) {
            console.error('Error loading homeworks:', err);
            throw err;
        }
    }, []);

    const refresh = useCallback(() => {
        loadDashboard();
    }, [loadDashboard]);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    return {
        dashboardData,
        user,

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