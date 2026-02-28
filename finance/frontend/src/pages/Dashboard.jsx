import { useState, useMemo } from 'react';
import { transactionService, mockData } from '../services/api';
import { useCurrency } from '../context/CurrencyContext';
import { Search, Wallet, ArrowUpRight, ArrowDownLeft, FileText, Download, Calendar, Filter } from 'lucide-react';

export default function Dashboard() {
  // 1. State Management
  const [searchTerm, setSearchTerm] = useState("");
  // Defaulting to the current year 2026 based on your project scope
  const [dateRange, setDateRange] = useState({ 
    start: '2026-01-01', 
    end: '2026-12-31' 
  });
  // Currency Context
  const { currency, setCurrency, formatMoney, currencies } = useCurrency();

  // 2. Data Calculation (Total Account Balance)
  const currentBalance = useMemo(() => {
    return mockData.reduce((acc, t) => acc + t.amount, 0);
  }, []);

  // 3. Statement Filtering Logic
  const filteredStatement = useMemo(() => {
    return mockData.filter(t => {
      const matchesSearch = 
        t.desc.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.cat.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDate = t.date >= dateRange.start && t.date <= dateRange.end;
      
      return matchesSearch && matchesDate;
    }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Newest at top
  }, [searchTerm, dateRange]);


  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- PAGE HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Financial Overview
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          System Live: Feb 26, 2026
        </div>
        {/* --- CURRENCY DROPDOWN --- */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
          <span className="text-[10px] font-black text-slate-500 uppercase ml-2">Currency</span>
          <select 
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            // Updated to use uppercase CURRENCIES from context
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

      

      {/* --- TOP ROW: BALANCE & SEARCH --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CURRENT BALANCE CARD */}
        <div className="lg:col-span-2 bg-linear-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-blue-100 text-sm font-bold uppercase tracking-widest opacity-80">
              <Wallet size={16} />
              Current Balance
            </div>
            <h2 className="text-5xl font-black text-white mt-3 tabular-nums">
              {formatMoney(currentBalance)}
            </h2>
            <div className="flex gap-3 mt-8">
              <button className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95">
                Transfer
              </button>
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all border border-white/10">
                Insights
              </button>
            </div>

          </div>
          {/* Decorative background icon */}
          <Wallet className="absolute -right-6 -bottom-6 text-white/10 w-56 h-56 rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
        </div>

        {/* QUICK SEARCH BOX */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-lg flex flex-col justify-center gap-4">
            <div>
              <label className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2 block">
                History Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text"
                  placeholder="Search description..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3.5 pl-10 pr-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
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
          
          <div className="flex items-center gap-3 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 px-2">
              <Calendar size={14} className="text-slate-500" />
              <input 
                type="date" 
                className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              />
            </div>
            <span className="text-slate-700 font-bold">-</span>
            <div className="flex items-center gap-2 px-2 border-r border-slate-800">
              <input 
                type="date" 
                className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              />
            </div>
            <button className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors">
              <Download size={18} />
            </button>
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
                <th className="p-6 text-right">Amount ({currency})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {filteredStatement.map((t) => (
                <tr key={t.id} className="hover:bg-blue-500/3 transition-colors group">
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
                      <span className="text-white font-semibold group-hover:text-blue-400 transition-colors">
                        {t.desc}
                      </span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="text-[10px] font-black text-slate-400 bg-slate-800 px-2.5 py-1.5 rounded-md border border-slate-700 uppercase tracking-wider">
                      {t.cat}
                    </span>
                  </td>
                  <td className={`p-6 text-right font-bold text-lg tabular-nums ${t.amount > 0 ? 'text-emerald-400' : 'text-white'}`}>
                    {t.amount > 0 ? `+${formatMoney(t.amount)}` : `-${formatMoney(Math.abs(t.amount))}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* EMPTY SEARCH STATE */}
          {filteredStatement.length === 0 && (
            <div className="p-24 text-center">
              <div className="inline-flex p-6 bg-slate-800/50 rounded-full mb-4">
                <Search className="text-slate-600" size={40} />
              </div>
              <h4 className="text-white font-bold text-lg">No records found</h4>
              <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
                We couldn't find any transactions matching your current search or date period.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}