import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Configuração base da API
 */
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com';

/**
 * Interface para resposta da API
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

/**
 * Classe de serviço de API
 * Centraliza todas as chamadas HTTP com tratamento de erros
 */
class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Configura interceptors para tratamento global de erros e autenticação
   */
  private setupInterceptors() {
    // Interceptor de request
    this.api.interceptors.request.use(
      (config) => {
        // Adicionar token de autenticação se existir
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        console.log('API Request:', config);
        return config;
      },
      (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Interceptor de response
    this.api.interceptors.response.use(
      (response) => {
        console.log('API Response:', response);
        return response;
      },
      (error) => {
        console.error('API Response Error:', error);
        this.handleApiError(error);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Obtém token de autenticação do storage
   */
  private getAuthToken(): string | null {
    try {
      // Implementar lógica para obter token do AsyncStorage
      return null;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  /**
   * Tratamento genérico de erros da API
   */
  private handleApiError(error: any) {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Não autorizado - redirecionar para login
          this.handleUnauthorized();
          break;
        case 403:
          // Proibido
          console.error('Access forbidden');
          break;
        case 404:
          // Não encontrado
          console.error('Resource not found');
          break;
        case 500:
          // Erro interno do servidor
          console.error('Internal server error');
          break;
        default:
          console.error('API Error:', data?.message || 'Unknown error');
      }
    } else if (error.request) {
      console.error('Network Error:', error.request);
    } else {
      console.error('Error:', error.message);
    }
  }

  /**
   * Trata erro de não autorização
   */
  private handleUnauthorized() {
    // Implementar lógica para redirecionar para login
    console.warn('User not authenticated');
  }

  /**
   * Requisição GET genérica
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.api.get(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Requisição POST genérica
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.api.post(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Requisição PUT genérica
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.api.put(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Requisição DELETE genérica
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.api.delete(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Upload de arquivo
   */
  async upload<T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.api.post(url, formData, {
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...config?.headers,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

// Instância singleton do serviço de API
export const apiService = new ApiService();

/**
 * Hook personalizado para usar o serviço de API
 */
export function useApi() {
  return {
    api: apiService,
    get: apiService.get.bind(apiService),
    post: apiService.post.bind(apiService),
    put: apiService.put.bind(apiService),
    delete: apiService.delete.bind(apiService),
    upload: apiService.upload.bind(apiService),
  };
}
