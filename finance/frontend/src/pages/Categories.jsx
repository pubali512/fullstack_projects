import { useState, useEffect } from 'react';
import { apiService, monthNames, years } from '../services/api';
import { useCurrency } from '../context/CurrencyContext';
import { CalendarDays, ChevronRight } from 'lucide-react';

export default function Categories() {
  // Date and Currency Configuration
  const { currency, setCurrency, formatMoney, currencies } = useCurrency();
  
  const [selectedMonth, setSelectedMonth] = useState(
    (new Date().getMonth() + 1).toString().padStart(2, '0')
  );
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
 
  // Fetch Analytics Data using apiService
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const data = await apiService.getCategoryAnalytics(
          parseInt(selectedMonth), 
          parseInt(selectedYear)
        );
        setAnalytics(data);
      } catch (error) {
        console.error("Error fetching category analytics:", error);
        setAnalytics([]);       /* Safety fallback */
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedMonth, selectedYear]);  /* Runs whenever the dropdowns change */


  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* --- HEADER & FILTERS --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Analytics Overview</h1>
        </div>
        
        <div className="flex gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800 shadow-xl">
          <select 
            className="bg-slate-800 text-white px-3 py-2 rounded-lg outline-none text-xs font-bold border border-transparent focus:border-blue-500 transition-all cursor-pointer hover:bg-slate-700"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            {Object.keys(currencies).map(code => (
              <option key={code} value={code}>{code} ({currencies[code].symbol})</option>
            ))}
          </select>

          <select 
            className="bg-slate-800 text-white px-4 py-2 rounded-lg outline-none text-sm font-semibold border border-transparent focus:border-blue-500 transition-all cursor-pointer hover:bg-slate-700"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            {monthNames.map((m, i) => {
              const val = (i + 1).toString().padStart(2, '0'); // Matches "01", "02" backend format
              return <option key={val} value={val}>{m}</option>;
            })}
          </select>

          <select 
            className="bg-slate-800 text-white px-4 py-2 rounded-lg outline-none text-sm font-semibold border border-transparent focus:border-blue-500 transition-all cursor-pointer hover:bg-slate-700"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* --- CATEGORY GRID --- */}
      <div className="space-y-6">
        {/* Check if the backend is still loading or if the array is empty */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-slate-500 mt-4">Loading your analytics...</p>
          </div>
        ) : analytics.length === 0 ? (
          /* Empty State - No data returned from Flask */
          <div className="py-24 text-center bg-slate-900/40 rounded-3xl border-2 border-dashed border-slate-800">
            <CalendarDays className="mx-auto text-slate-700 mb-4" size={56} />
            <p className="text-slate-500 font-medium text-lg">No expenses found for this period.</p>
            <p className="text-slate-600 text-sm mt-1">Select a different month or year to view data.</p>
          </div>
        ) : (
          /* Card Grid - Filtering out Income so only Expenses show as cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {analytics.filter(item => !item.is_income).map((item) => (
              <div key={item.name} className="group bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-blue-500/50 transition-all shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Category</span>
                    <h3 className="text-slate-200 font-bold text-lg leading-tight">{item.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold text-xl tabular-nums">
                      {formatMoney(item.total_amount)}
                    </p>
                  </div> 
                </div>

                {/* Progress Visual - Using data directly from Flask */}
                <div className="space-y-2">
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                      /* Use fallback in case backend key is 'percentage' instead of 'contribution_pct' */
                      style={{ width: `${item.contribution_pct || item.percentage || 0}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                    <span className="text-slate-500">Contribution</span>
                    <span className="text-blue-400">
                      {Number(item.contribution_pct || item.percentage || 0).toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                <button className="mt-6 w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-blue-600 hover:text-white transition-all">
                  Analyze Details <ChevronRight size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}