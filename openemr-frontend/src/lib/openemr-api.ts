import axios from 'axios';

// Use Next.js proxy to avoid CORS issues
const OPENEMR_BASE_URL = '/api/openemr';

export const openemrApi = axios.create({
    baseURL: OPENEMR_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth interceptor
openemrApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('openemr_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add response interceptor for error handling
openemrApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('openemr_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
); 