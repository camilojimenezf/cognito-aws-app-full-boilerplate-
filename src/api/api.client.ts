import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { env } from '../config/env/env';
import authAmplifyService from '../modules/auth/infrastructure/services/auth-amplify.service';

const authService = authAmplifyService;

// API Client Factory
export class ApiClientFactory {
  private static baseConfig: AxiosRequestConfig = {
    baseURL: env.VITE_API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  /**
   * Creates a public API client with no authentication
   */
  static createPublicClient(): AxiosInstance {
    return axios.create(this.baseConfig);
  }

  /**
   * Creates an authenticated API client with token refresh capabilities
   */
  static createAuthClient(): AxiosInstance {
    const apiClient = axios.create(this.baseConfig);

    // Add request interceptor for authentication
    apiClient.interceptors.request.use(
      async (config) => {
        const token = await authService.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Add response interceptor for token refresh
    apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          console.warn('Token expired, attempting to refresh session...');

          try {
            const newSession = await authService.refreshSession();

            if (newSession?.accessToken) {
              console.log('Session refreshed successfully, retrying request...');

              error.config.headers.Authorization = `Bearer ${newSession.accessToken}`;
              return apiClient(error.config);
            }
          } catch (refreshError) {
            console.error('Session refresh failed, logging out...', refreshError);
            await authService.signOut();
            window.location.reload();
          }
        }

        return Promise.reject(error);
      },
    );

    return apiClient;
  }
}
