import { createContext, useState, useContext, useEffect } from 'react';
import { currencies } from '../services/api';

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => {
    const saved = localStorage.getItem('user-currency');
    // Default to EUR if nothing is saved
    return saved && currencies[saved] ? saved : 'EUR';
  });

  useEffect(() => {
    localStorage.setItem('user-currency', currency);
  }, [currency]);

  const formatMoney = (amount) => {
    const config = currencies[currency];
    const converted = amount * config.rate;
    return `${config.symbol}${converted.toLocaleString(undefined, { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatMoney, currencies }}>
      {children}
    </CurrencyContext.Provider>
  );
}

// Custom hook for easy access
export const useCurrency = () => useContext(CurrencyContext);