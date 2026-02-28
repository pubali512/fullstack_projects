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

// Optional: Supported years
// export const years = [2024, 2025, 2026];

// Mock Data (Use this while Flask is offline)
export const mockData = [
  { id: 1, date: '2026-02-25', desc: 'Grocery Store', cat: 'Grocery', amount: -85.50 },
  { id: 2, date: '2026-02-24', desc: 'Salary', cat: 'Income', amount: 5000.00 },
  { id: 3, date: '2026-02-23', desc: 'Apartment Rent', cat: 'Housing', amount: -800.00 },
  { id: 4, date: '2026-01-15', desc: 'Old Rent', cat: 'Housing', amount: -500.00 },
  { id: 5, date: '2026-02-10', desc: 'Cinema', cat: 'Entertainment', amount: -40.00 },
];

// API Configuration
const apiBaseUrl = 'http://127.0.0.1:5001/api'; 

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: { 'Content-Type': 'application/json' }
});

// API Services
export const transactionService = {
  getAll: async () => {
    try {
      const response = await api.get('/transactions');
      return response.data;
    } catch (error) {
      console.warn("Flask Backend unreachable. Falling back to Mock Data.");
      return mockData;     // Returns mock data if API fails
    }
  },

  create: async (data) => {
    const response = await api.post('/transactions', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/transactions/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  }
};