import axios from 'axios';


// Currency Configurations
export const currencies = {
  EUR: { symbol: '€', rate: 1, label: 'Euro' },  // Base Currency 
  USD: { symbol: '$', rate: 1.18, label: 'US Dollar' },
  GBP: { symbol: '£', rate: 0.88, label: 'British Pound' },
  INR: { symbol: '₹', rate: 107.66, label: 'Indian Rupee' },
  JPY: { symbol: '¥', rate: 184.47, label: 'Japanese Yen' }
};
  
// Global Configuration
export const categories = ['Grocery', 'Income', 'Housing', 'Entertainment', 'Utilities'];

// Month Names
export const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Available years
export const years = [2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033];

// Pagination Options
export const paginationOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

// Mock Data (Use this while Flask is offline)
export const mockData = [
  { id: 1, date: '2026-02-25', description: 'Grocery Store', category: 'Grocery', amount: -85.50 },
  { id: 2, date: '2026-02-24', description: 'Salary', category: 'Income', amount: 5000.00 },
  { id: 3, date: '2026-02-23', description: 'Apartment Rent', category: 'Housing', amount: -800.00 },
  { id: 4, date: '2026-01-15', description: 'Old Rent', category: 'Housing', amount: -500.00 },
  { id: 5, date: '2026-02-10', description: 'Cinema', category: 'Entertainment', amount: -40.00 },
];

// API Configuration
const apiBaseUrl = 'http://127.0.0.1:5000/api'; 

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: { 'Content-Type': 'application/json' }
});

// Centralized API Services
export const apiService = {
  // --- DASHBOARD ---
  getDashboardStats: async (month, year) => {
    const response = await apiClient.get('/dashboard/stats', {
      params: { month, year }
    });
    return response.data;
  },

  // --- TRANSACTIONS ---
  /* Strictly handle the pagination limit and filters */
  getTransactions: async (params = {}) => {
    try {
      const response = await apiClient.get('/transactions', { params });
      return response.data;
    } catch (error) {
      console.warn("Backend unreachable. Falling back to Mock Data.");
      return mockData; 
    }
  },

  createTransaction: async (data) => {
    const response = await apiClient.post('/transactions', data);
    return response.data;
  },

  updateTransaction: async (id, data) => {
    const response = await apiClient.put(`/transactions/${id}`, data);
    return response.data;
  },

  deleteTransaction: async (id) => {
    const response = await apiClient.delete(`/transactions/${id}`);
    return response.data;
  },

  // --- CATEGORIES / ANALYTICS ---
  getCategoryAnalytics: async (month, year) => {
    const response = await apiClient.get('/categories/analytics', {
      params: { month, year }
    });
    return response.data;
  }
};