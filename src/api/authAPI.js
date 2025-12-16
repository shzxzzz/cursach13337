
const API_BASE_URL = 'http://localhost:3000/api';

async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            let errorMessage = `HTTP error! status: ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.error || errorMessage;
            } catch {

            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API request failed:', error.message);
        throw error;
    }
}

export const coursesAPI = {
    getAll: () => apiRequest('/courses'),

    getById: (id) => apiRequest(`/courses/${id}`),

    create: (data) => apiRequest('/courses', {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    update: (id, data) => apiRequest(`/courses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),

    delete: (id) => apiRequest(`/courses/${id}`, {
        method: 'DELETE',
    }),
};

export const usersAPI = {
    getById: (id) => apiRequest(`/users/${id}`),
    getAll: () => apiRequest('/users'),
};

export const modulesAPI = {
    getById: (id) => apiRequest(`/modules/${id}`),
    create: (data) => apiRequest('/modules', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
};

export const lessonsAPI = {
    getById: (id) => apiRequest(`/lessons/${id}`),
    getAll: () => apiRequest('/lessons'),
    // Новая функция для загрузки уроков по массиву ID
    getByIds: async (ids) => {
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return [];
        }

        try {
            // Если API поддерживает массовую загрузку
            const response = await apiRequest('/lessons/batch', {
                method: 'POST',
                body: JSON.stringify({ ids })
            });
            return response;
        } catch (error) {
            console.error('Error fetching lessons batch:', error);
            // Если нет массовой загрузки, загружаем по одному
            const promises = ids.map(id =>
                lessonsAPI.getById(id).catch(() => null)
            );
            const results = await Promise.all(promises);
            return results.filter(lesson => lesson !== null);
        }
    },
    create: (data) => apiRequest('/lessons', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
};