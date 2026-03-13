import { useState, useMemo, useEffect } from 'react';
import { apiService, monthNames, years } from '../services/api';
import { useCurrency } from '../context/CurrencyContext';
import { Search, Wallet, ArrowUpRight, ArrowDownLeft, FileText, Download, Calendar, Loader2, Filter } from 'lucide-react';

export default function Dashboard() {
  // Helper Function (To get "2026-03" dynamically)
  const getInitialMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  // State Management
  const now = new Date();

  const [selMonth, setSelMonth] = useState(String(now.getMonth() + 1).padStart(2, '0'));
  const [selYear, setSelYear] = useState(String(now.getFullYear())); /* Defaulting to the current year */
  const [stats, setStats] = useState({ currentBalance: 0, monthlySpend: 0 });

  const [searchTerm, setSearchTerm] = useState("");
  const [transactions, setTransactions] = useState([]);   /* Real data state */
  const [loading, setLoading] = useState(false);

  /* Pagination Logic */
  const [offset, setOffset] = useState(0);                /* Tracks how many records have loaded */
  const [hasMore, setHasMore] = useState(false);           /* To hide button if no more data */

  /*Defaulting to the current year 2026 based on the project scope */
  const [dateRange, setDateRange] = useState({ 
    start: '', 
    end: ''   
  });
  // Currency Context
  const { currency, setCurrency, formatMoney, currencies } = useCurrency();

  // Load real data from Flask
  // --- Fetch Stats using apiService ---
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiService.getDashboardStats(
          parseInt(selMonth), 
          parseInt(selYear)
        );
        console.log("Stats received from Flask:", data); // DEBUG: Check your browser console!
        setStats(data);
      } catch (error) {
        console.error("Stats Fetch Error:", error);
      }
    };
    fetchStats();
  }, [selMonth, selYear]);

  // --- Fetch Statement using apiService ---
  const fetchStatement = async (isLoadMore = false) => {
  setLoading(true);
  try {
    /* If it's a date change, we start from 0. If it's "Load More", we use the current offset. */
    const currentOffset = isLoadMore ? offset : 0;
    
    const newData = await apiService.getTransactions({
      start_date: dateRange.start,
      end_date: dateRange.end,
      limit: 10,
      offset: currentOffset
    });

    if (isLoadMore) {
      /* Append for pagination */
      setTransactions(prev => [...prev, ...newData]);
      setOffset(prev => prev + newData.length);
    } else {
      /* Fresh overwrite for new date selection */
      setTransactions(newData);
      setOffset(newData.length);
    }

    /* Button only shows if there are exactly 10 records (meaning more might exist) */
    setHasMore(newData.length === 10);
    
  } catch (error) {
    console.error("Statement Load Error:", error);
  } finally {
    setLoading(false);
  }
};

  // --- Initial load for the table ---
  useEffect(() => {
    /* Guard Clause: Only fetch if BOTH dates are picked */
    /* This prevents sending "?start_date=&end_date=" to your Flask backend */
    if (dateRange.start && dateRange.end) {
      fetchStatement(false);
    } else {
      // Optional: Clear the table if dates are cleared
      setTransactions([]);
      setHasMore(false);
    }
  }, [dateRange.start, dateRange.end]);

  // CSV Download Handler 
  const handleDownloadCSV = () => {
    if (transactions.length === 0) {
      alert("No transactions available to export.");
      return;
    }

    /* Create headers */
    const headers = ["Date,Description,Category,Status,Amount\n"];
    
    /* Format rows */
    const rows = transactions.map(t => 
      `${t.date},"${t.description}",${t.category},${t.status},${t.amount}`
    ).join("\n");

    /* Create Blob and trigger download */
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `transactions_${selMonth}_${selYear}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };


  // Statement Filtering Logic
  const filteredStatement = useMemo(() => {
    return transactions.filter(t => {
      const search = searchTerm.toLowerCase();
      return (
        t.description.toLowerCase().includes(search) || 
        t.category.toLowerCase().includes(search)
      );
    });
  }, [transactions, searchTerm]);


  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- PAGE HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Financial Overview
          </h1>
        </div>
        
        {/* --- CURRENCY DROPDOWN --- */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
          <span className="text-[10px] font-black text-slate-500 uppercase ml-2">Currency</span>
          <select 
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            // Updated to use uppercase currencies from context
            className="bg-slate-800 text-white text-xs font-bold p-2 rounded-lg outline-none cursor-pointer hover:bg-slate-700 transition-colors border border-transparent focus:border-blue-500"
          >
            {Object.keys(currencies).map(code => (
              <option key={code} value={code}>
                {code} ({currencies[code].symbol})
              </option>
              ))}
          </select>
        </div>
      </div>

      

      {/* --- TOP ROW: STATS & SELECTOR --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 1. CURRENT BALANCE CARD */}
        <div className="bg-linear-to-br from-blue-600 to-indigo-700 p-3 rounded-3xl shadow-xl relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-blue-100 text-[10px] font-black uppercase tracking-widest opacity-80">
              <Wallet size={16} />
              Current Balance
            </div>
            <h2 className="text-4xl font-black text-white mt-3 tabular-nums">
              {formatMoney(stats.currentBalance)}
            </h2>
          </div>
          <Wallet className="absolute -right-6 -bottom-6 text-white/10 w-32 h-32 rotate-12" />
        </div>

        {/* 2. MONTHLY EXPENDITURE CARD */}
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-3xl shadow-lg flex flex-col justify-center relative overflow-hidden">
          <div className="flex items-center gap-2 text-rose-500 text-[10px] font-black uppercase tracking-widest mb-2">
            <ArrowDownLeft size={16} />
            Monthly Expenditure
          </div>
          {/* Date Selector (The Bridge) */}
          <div className="flex items-center gap-2 px-2">
            <Calendar size={14} className="text-slate-500" />
          
            <span className="text-[10px] font-black text-slate-500 uppercase ml-2">Select Month & Year</span>
            
               {/* Month dropdown */}
              <select 
                value={selMonth}
                onChange={(e) => setSelMonth(e.target.value)}
                className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer px-3 py-1 hover:text-blue-400 transition-colors"
              >
                {monthNames.map((name, i) => {
                  const val = (i + 1).toString().padStart(2, '0');
                  return (
                    <option key={val} value={val} className="bg-slate-900">
                      {name}
                    </option>
                  );
                })}
              </select>

              <span className="text-slate-700 font-bold px-1">/</span>

               {/* Year dropdown */}
              <select 
                value={selYear}
                onChange={(e) => setSelYear(e.target.value)}
                className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer px-3 py-1 hover:text-blue-400 transition-colors"
              >
                {years.map(year => (
                  <option key={year} value={year} className="bg-slate-900">
                    {year}
                  </option>
                ))}
              </select>
          </div>
          <h3 className="text-4xl font-black text-white tabular-nums">
            {formatMoney(stats?.monthlySpend || 0)}
          </h3>
        </div>

        {/* 3.QUICK SEARCH BOX */}
        <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-3xl shadow-lg flex flex-col justify-center gap-0.5">
            <div>
              <label className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2 block">
                History Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text"
                  placeholder="Search description..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-1 pl-10 pr-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <p className="text-[10px] text-slate-600 leading-relaxed italic">
              *Searching through all categories in real-time.
            </p>
        </div>
      </div>
      
      {/* --- STATEMENT SECTION --- */}
      
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* STATEMENT HEADER & PERIOD PICKER */}
        <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
              <FileText size={20} />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">Transaction Statement</h3>
          </div>
          
          <div className="flex items-center gap-3 bg-slate-950 p-0.5 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 px-2">
              <Calendar size={14} className="text-slate-500" />
              <input 
                type="date" 
                className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              />
            </div>
            <span className="text-slate-700 font-bold">-</span>
            <div className="flex items-center gap-2 px-2 border-r border-slate-800">
              <input 
                type="date" 
                className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>
            {/* Download Button */}
            <div className="flex items-center gap-3 ml-auto">
              <button 
                onClick={() => handleDownloadCSV()}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white px-4 py-2.5 rounded-xl transition-all shadow-lg active:scale-95"
                title="Download Transactions"
              >
                <Download size={18} />
                <span className="text-xs font-bold">Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* STATEMENT TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-950/30 text-slate-500 text-[10px] uppercase font-black tracking-[0.2em] border-b border-slate-800">
              <tr>
                <th className="p-6">Posting Date</th>
                <th className="p-6">Transaction Description</th>
                <th className="p-6">Category</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right">Amount ({currency})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {filteredStatement.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/50 transition-colors group cursor-default">
                  <td className="p-6 text-sm font-mono text-slate-500">{t.date}</td>
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full border ${
                        t.amount > 0 
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {t.amount > 0 ? <ArrowUpRight size={14}/> : <ArrowDownLeft size={14}/>}
                      </div>
                      <span className="text-white font-semibold transition-colors group-hover:text-blue-400">
                        {t.description} 
                      </span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="text-[10px] font-black text-slate-400 bg-slate-800 px-2.5 py-1.5 rounded-md border border-slate-700 uppercase tracking-wider">
                      {t.category} 
                    </span>
                  </td>
                  <td className="p-6">
                    <span className={`text-[10px] font-black px-2 py-1 rounded-md border transition-all ${
                      t.status === 'Recurring' 
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 group-hover:border-blue-400/50' 
                      : 'bg-slate-800 text-slate-400 border-slate-700 group-hover:border-slate-500'
                      }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className={`p-6 text-right font-bold text-lg tabular-nums ${t.amount > 0 ? 'text-emerald-400' : 'text-white'}`}>
                    {t.amount > 0 ? `+${formatMoney(t.amount)}` : `-${formatMoney(Math.abs(t.amount))}`}
                  </td>
                </tr>
              ))}
              {/* LOAD MORE BUTTON */}
              {hasMore && transactions.length > 0 && (
                <tr>
                  <td colSpan="5" className="p-10 border-t border-slate-800">
                    <div className="flex justify-center">
                      <button 
                        onClick={() => fetchStatement(true)}
                        disabled={loading}     // Disable during fetch
                        className={`flex items-center gap-2 px-8 py-4 rounded-2xl border transition-all font-bold text-sm shadow-lg active:scale-95 ${
                          loading 
                            ? 'bg-slate-800/50 border-slate-700 text-slate-500 cursor-not-allowed'            // Style when loading
                            : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700 hover:scale-105' // Style when ready
                        }`}
                      >
                        {loading ? (
                          // The Spinner State
                          <>
                            <Loader2 size={18} className="animate-spin text-blue-400" />
                            <span>Fetching Data...</span>
                          </>
                        ) : (
                          // The Default State
                          <>
                            <ArrowDownLeft size={16} className="-rotate-90 text-blue-400" />
                            <span>Load Next Entries</span>
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {/* EMPTY SEARCH STATE */}
          {!dateRange.start || !dateRange.end ? (
            <div className="p-24 text-center">
              <div className="inline-flex p-6 bg-blue-500/5 rounded-full mb-4">
                <Calendar className="text-blue-500/40" size={40} />
              </div>
              <h4 className="text-white font-bold text-lg">Select a Date Range</h4>
              <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
                Please choose a start and end date above to view your transaction statement.
              </p>
            </div>
          ) : filteredStatement.length === 0 && !loading ? (
            <div className="p-24 text-center">
              <div className="inline-flex p-6 bg-slate-800/50 rounded-full mb-4">
                <Search className="text-slate-600" size={40} />
              </div>
              <h4 className="text-white font-bold text-lg">No records found</h4>
              <p className="text-slate-500 text-sm mt-1">
                No transactions match the selected period.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}