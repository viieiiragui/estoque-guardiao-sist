import { authUtils } from '../utils/auth';
import type { RequestConfig, ApiResponse } from '../types/http';

class HttpClient {
  private baseURL: string;

  constructor(baseURL: string = '') {
    this.baseURL = baseURL;
  }

  private async request<T>(config: RequestConfig): Promise<ApiResponse<T>> {
    const { url, skipAuth = false, ...options } = config;

    // Adicionar token automaticamente se não for skipAuth
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (!skipAuth) {
      const token = authUtils.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        ...options,
        headers,
      });

      // Interceptar respostas de token expirado
      if (authUtils.isTokenExpired(response)) {
        console.warn('Token expirado, fazendo logout...');
        authUtils.logout();
        throw new Error('Token expirado');
      }

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();

      return {
        data,
        status: response.status,
      };
    } catch (error) {
      console.error('Erro na requisição:', error);
      throw error;
    }
  }

  async get<T>(
    url: string,
    config?: Omit<RequestConfig, 'url' | 'method'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'GET',
      ...config,
    });
  }

  async post<T>(
    url: string,
    data?: any,
    config?: Omit<RequestConfig, 'url' | 'method' | 'body'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'POST',
      body: JSON.stringify(data),
      ...config,
    });
  }

  async put<T>(
    url: string,
    data?: any,
    config?: Omit<RequestConfig, 'url' | 'method' | 'body'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'PUT',
      body: JSON.stringify(data),
      ...config,
    });
  }

  async delete<T>(
    url: string,
    config?: Omit<RequestConfig, 'url' | 'method'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'DELETE',
      ...config,
    });
  }
}

// Instância global do cliente HTTP
export const httpClient = new HttpClient(
  import.meta.env.VITE_API_BASE_URL || ''
);
