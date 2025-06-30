import { useState } from 'react';

// Типы для API запросов и ответов
export interface CareerAdviceRequest {
  user_goal: string;
  experience_level: string;
  current_role?: string;
  interests?: string[];
}

export interface CareerAdviceResponse {
  advice: string;
  recommendations: string[];
  next_steps: string[];
  timestamp: string;
}

export interface ResumeAnalysisRequest {
  resume_text: string;
  target_position?: string;
}

export interface ResumeAnalysisResponse {
  score: number;
  strengths: string[];
  improvements: string[];
  missing_skills: string[];
  recommendations: string[];
}

export interface CareerTestRequest {
  answers: number[];
  test_type: string;
}

export interface CareerTestResponse {
  result_type: string;
  description: string;
  recommended_careers: string[];
  development_areas: string[];
}

// Новые интерфейсы для логирования
export interface ProfessionSelectionRequest {
  user_id?: string;
  selected_profession: string;
  user_role?: string;
  user_goal?: string;
  timestamp?: string;
}

export interface ProfessionSelectionResponse {
  success: boolean;
  message: string;
  session_id: string;
}

export interface JobMatchingRequest {
  session_id: string;
  profession: string;
  user_role?: string;
  user_goal?: string;
  job_url?: string;
}

export interface JobMatchingResponse {
  jobs: any[];
  total_count: number;
  session_id: string;
}

// Конфигурация API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Утилита для API запросов
const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Неизвестная ошибка' }));
      throw new Error(errorData.detail || `HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Хук для работы с API
export const useAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Получение карьерных советов
  const getCareerAdvice = async (request: CareerAdviceRequest): Promise<CareerAdviceResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest<CareerAdviceResponse>('/career-advice', {
        method: 'POST',
        body: JSON.stringify(request),
      });
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка получения карьерных советов';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Анализ резюме
  const analyzeResume = async (request: ResumeAnalysisRequest): Promise<ResumeAnalysisResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest<ResumeAnalysisResponse>('/resume-analysis', {
        method: 'POST',
        body: JSON.stringify(request),
      });
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка анализа резюме';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Обработка карьерного теста
  const processCareerTest = async (request: CareerTestRequest): Promise<CareerTestResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest<CareerTestResponse>('/career-test', {
        method: 'POST',
        body: JSON.stringify(request),
      });
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка обработки теста';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Проверка статуса API
  const checkAPIStatus = async (): Promise<boolean> => {
    try {
      await apiRequest('/');
      return true;
    } catch {
      return false;
    }
  };

  // Логирование выбора профессии
  const logProfessionSelection = async (request: ProfessionSelectionRequest): Promise<ProfessionSelectionResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest<ProfessionSelectionResponse>('/log-profession-selection', {
        method: 'POST',
        body: JSON.stringify(request),
      });
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка логирования выбора профессии';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Получение подходящих вакансий
  const getJobMatches = async (request: JobMatchingRequest): Promise<JobMatchingResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest<JobMatchingResponse>('/get-job-matches', {
        method: 'POST',
        body: JSON.stringify(request),
      });
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка получения вакансий';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getCareerAdvice,
    analyzeResume,
    processCareerTest,
    checkAPIStatus,
    logProfessionSelection,
    getJobMatches,
    clearError: () => setError(null),
  };
};

// Хук для кэширования результатов
export const useAPICache = () => {
  const [cache, setCache] = useState<Map<string, any>>(new Map());

  const getCachedData = (key: string) => {
    return cache.get(key);
  };

  const setCachedData = (key: string, data: any) => {
    setCache(prev => new Map(prev.set(key, data)));
  };

  const clearCache = () => {
    setCache(new Map());
  };

  return {
    getCachedData,
    setCachedData,
    clearCache,
  };
};