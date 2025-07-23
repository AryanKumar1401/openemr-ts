import { openemrApi } from '@/lib/openemr-api';

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
}

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await openemrApi.post('/apis/api/auth/token', {
            grant_type: 'password',
            username: credentials.username,
            password: credentials.password,
            scope: 'default patient/*.read patient/*.write encounter/*.read encounter/*.write user/*.read user/*.write system/*.read system/*.write',
        });

        const { access_token } = response.data;
        localStorage.setItem('openemr_token', access_token);
        return response.data;
    },

    async logout(): Promise<void> {
        localStorage.removeItem('openemr_token');
    },

    isAuthenticated(): boolean {
        return !!localStorage.getItem('openemr_token');
    },

    getToken(): string | null {
        return localStorage.getItem('openemr_token');
    }
}; 