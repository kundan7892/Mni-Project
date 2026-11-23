import axios, { AxiosError } from 'axios';
import { handleLocalRequest } from './localApi';

const baseURL = import.meta.env.VITE_API_URL || '/api';

/*
 * Backend selection.
 * VITE_API_MODE=server -> always use the Express + MongoDB backend
 * VITE_API_MODE=local  -> always use the in-browser API (services/localApi.js)
 * unset (default)      -> use the backend if /api/health reports a connected database,
 *                         otherwise fall back to the in-browser API.
 */
const API_MODE = (import.meta.env.VITE_API_MODE || 'auto').toLowerCase();
let modePromise = null;

export function getApiMode() {
  if (!modePromise) {
    modePromise =
      API_MODE === 'local' || API_MODE === 'server'
        ? Promise.resolve(API_MODE)
        : (async () => {
            try {
              const controller = new AbortController();
              const timer = setTimeout(() => controller.abort(), 2500);
              const res = await fetch(`${baseURL}/health`, { signal: controller.signal });
              clearTimeout(timer);
              const json = await res.json();
              return json?.success && json?.data?.database?.connected ? 'server' : 'local';
            } catch {
              return 'local';
            }
          })();
    modePromise.then((mode) => {
      if (mode === 'local') console.info('DroneHub: backend not available, using in-browser data (localStorage).');
    });
  }
  return modePromise;
}

const networkAdapter = axios.getAdapter(axios.defaults.adapter);

async function localAdapter(config) {
  const headers = config.headers;
  const authorization = typeof headers?.get === 'function' ? headers.get('Authorization') : headers?.Authorization;
  try {
    const { status, body } = await handleLocalRequest({
      method: config.method,
      url: config.url,
      params: config.params,
      data: config.data,
      headers: { Authorization: authorization }
    });
    return { data: body, status, statusText: 'OK', headers: {}, config, request: {} };
  } catch (err) {
    const status = err.status || 500;
    const response = { data: { success: false, message: err.message }, status, statusText: 'Error', headers: {}, config, request: {} };
    throw new AxiosError(err.message, String(status), config, {}, response);
  }
}

/**
 * Reusable Axios Client Instance for DRONEHUB
 */
const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000,
  adapter: async (config) => ((await getApiMode()) === 'local' ? localAdapter(config) : networkAdapter(config))
});

// Request Interceptor: Automatically attach JWT Bearer Token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('dronehub_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Expired Tokens & Centralized Error Formatting
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const status = error.response ? error.response.status : null;
    const errorData = error.response ? error.response.data : null;

    // Handle Expired Token / Unauthorized
    if (status === 401) {
      const isAuthRoute =
        error.config?.url?.includes('/auth/login') ||
        error.config?.url?.includes('/auth/register');

      if (!isAuthRoute) {
        console.warn('⚠️ Authentication token expired or invalid. Clearing session...');
        localStorage.removeItem('dronehub_token');
        localStorage.removeItem('dronehub_user');

        // Broadcast session expiration event for auth context to react
        window.dispatchEvent(new CustomEvent('dronehub_session_expired'));
      }
    }

    const message =
      errorData?.message ||
      (errorData?.errors && errorData.errors[0]?.message) ||
      error.message ||
      'An unexpected network error occurred';

    const enhancedError = new Error(message);
    enhancedError.status = status;
    enhancedError.data = errorData;
    enhancedError.response = error.response;

    return Promise.reject(enhancedError);
  }
);

/**
 * Universal API Client Wrapper
 * Supports both functional invocation: `apiClient('/drones', { method: 'POST', body: {...} })`
 * and Axios direct method invocation: `apiClient.get('/drones')`, `apiClient.post(...)`
 */
export const apiClient = async (endpoint, options = {}) => {
  const method = (options.method || 'GET').toUpperCase();
  const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  const config = {
    method,
    url,
    headers: options.headers || {},
    params: options.params
  };

  if (options.body) {
    config.data = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
  } else if (options.data) {
    config.data = options.data;
  }

  return axiosInstance(config);
};

// Bind Axios convenience methods
apiClient.get = (url, config) => axiosInstance.get(url, config);
apiClient.post = (url, data, config) => axiosInstance.post(url, data, config);
apiClient.put = (url, data, config) => axiosInstance.put(url, data, config);
apiClient.patch = (url, data, config) => axiosInstance.patch(url, data, config);
apiClient.delete = (url, config) => axiosInstance.delete(url, config);
apiClient.axios = axiosInstance;

export const api = apiClient;
export default apiClient;
