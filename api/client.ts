import { Appointment, VisitType } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper function for API requests
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

// Appointment API
export const appointmentsAPI = {
  // Get all appointments with optional filters
  getAll: async (filters?: {
    status?: string;
    email?: string;
    date?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchAPI<Appointment[]>(`/appointments${query}`);
  },

  // Get appointment by ID
  getById: async (id: string) => {
    return fetchAPI<Appointment>(`/appointments/${id}`);
  },

  // Create new appointment
  create: async (data: {
    visitType: string;
    visitDuration: number;
    date: string;
    time: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    reasonForVisit: string;
    injuryDate?: string;
    painScale?: number;
    additionalNotes?: string;
    files?: string[];
  }) => {
    return fetchAPI<Appointment>('/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update appointment
  update: async (id: string, data: {
    status?: string;
    reasonForVisit?: string;
    injuryDate?: string;
    painScale?: number;
    additionalNotes?: string;
    reminder24hSent?: boolean;
    reminder2hSent?: boolean;
  }) => {
    return fetchAPI<Appointment>(`/appointments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Cancel appointment
  cancel: async (id: string) => {
    return fetchAPI<Appointment>(`/appointments/${id}`, {
      method: 'DELETE',
    });
  },

  // Get appointment stats
  getStats: async () => {
    return fetchAPI<{
      total: number;
      scheduled: number;
      completed: number;
      cancelled: number;
    }>('/appointments/stats/summary');
  },
};

// Visit Types API
export const visitTypesAPI = {
  // Get all visit types
  getAll: async () => {
    return fetchAPI<VisitType[]>('/visit-types');
  },

  // Get visit type by ID
  getById: async (id: string) => {
    return fetchAPI<VisitType>(`/visit-types/${id}`);
  },
};
