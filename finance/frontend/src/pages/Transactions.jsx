import { useState, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { transactionService, categories, mockData } from '../services/api';
import { Pencil, Check, X, Trash2, Loader2, Search } from 'lucide-react';

export default function Transactions() {
  const { currency, formatMoney } = useCurrency();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10);     // Pagination
  const [searchTerm, setSearchTerm] = useState("");         // Search while editing/viewing
  const [isModalOpen, setIsModalOpen] = useState(false);    // Add Modal
  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString().split('T')[0],
    desc: '',
    cat: categories[0],
    amount: '',
    recurring: 'non-recurring'          // Default value
  });

  // Logic: Filter by search first, then sort by date, then slice for pagination
  const filteredTransactions = transactions
    .filter(t => 
      t.desc.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.cat.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const displayTransactions = filteredTransactions.slice(0, visibleCount);

  
  // State for Inline Editing
  const [editId, setEditId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // 1. Load data from the Service on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await transactionService.getAll();
      // If the service returns data (even from its own internal fallback), set it
      setTransactions(data);
    } catch (error) {
      console.error("API Error, using local mockData fallback:", error);
      // Manual fallback to the imported mockData if the service fails entirely
      setTransactions(mockData);
    } finally {
      setLoading(false);
    }
  };

  // 2. Prepare the row for editing
  const handleEditClick = (transaction) => {
    setEditId(transaction.id);
    setEditFormData({ ...transaction });
  };

  // 3. Save changes (Logic for both Mock and API)
  const handleSave = async () => {
    try {
      await transactionService.update(editId, editFormData);
      setEditId(null);
      await loadData(); // Refresh list
    } catch (error) {
      // If API fails, update local state only so you can still test the UI
      setTransactions(transactions.map(t => t.id === editId ? editFormData : t));
      setEditId(null);
      console.warn("Saved to local state only (Flask offline)");
    }
  };

  // 4. Delete Logic
  const handleDelete = async (id) => {
    if (window.confirm("Delete this transaction?")) {
      try {
        await transactionService.delete(id);
        await loadData();
      } catch (error) {
        setTransactions(transactions.filter(t => t.id !== id));
        console.warn("Deleted from local state only (Flask offline)");
      }
    }
  };


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-slate-400 gap-4">
        <Loader2 className="animate-spin text-blue-500" size={40} />
        <p className="text-lg font-medium">Connecting to Flask Services...</p>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Transactions Overview</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* --- PAGINATION DROPDOWN --- */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl">
            <span className="text-[10px] font-black text-slate-500 uppercase">Show</span>
            <select 
              value={visibleCount} 
              onChange={(e) => setVisibleCount(Number(e.target.value))}
              className="bg-transparent text-white text-xs font-bold outline-none cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={40}>40</option>
              <option value={50}>50</option>
              <option value={60}>60</option>
              <option value={70}>70</option>
              <option value={80}>80</option>
              <option value={90}>90</option>
              <option value={100}>100</option>
            </select>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20"
          >
            + Add Transaction
          </button>
        </div>
      </div>


      {/* --- SEARCH BAR (Use during editing/finding entries) --- */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
        <input 
          type="text"
          placeholder="Search description or category or recurring transactions to edit..."
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-white outline-none focus:border-blue-500/50 transition-all shadow-inner"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>


      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-800/50 text-slate-400 text-sm uppercase tracking-wider">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Description</th>
              <th className="p-4">Category</th>
              <th className="p-4 text-right">Amount ({currency})</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-slate-300 divide-y divide-slate-800">
            {displayTransactions.map((t) => (
              <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                {editId === t.id ? (
                  /* --- EDIT MODE --- */
                  <>
                    <td className="p-2"><input type="date" className="bg-slate-800 border border-slate-700 p-2 rounded text-sm w-full text-white" value={editFormData.date} onChange={(e) => setEditFormData({...editFormData, date: e.target.value})}/></td>
                    <td className="p-2"><input type="text" className="bg-slate-800 border border-slate-700 p-2 rounded text-sm w-full text-white" value={editFormData.desc} onChange={(e) => setEditFormData({...editFormData, desc: e.target.value})}/></td>
                    <td className="p-2">
                      <select className="bg-slate-800 border border-slate-700 p-2 rounded text-sm w-full text-white" value={editFormData.cat} onChange={(e) => setEditFormData({...editFormData, cat: e.target.value})}>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </td>
                    <td className="p-2"><input type="number" className="bg-slate-800 border border-slate-700 p-2 rounded text-sm w-full text-white text-right" value={editFormData.amount} onChange={(e) => setEditFormData({...editFormData, amount: parseFloat(e.target.value)})}/></td>
                    <td className="p-2 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={handleSave} className="text-emerald-400 hover:bg-emerald-400/10 p-1 rounded"><Check size={20}/></button>
                        <button onClick={() => setEditId(null)} className="text-slate-500 hover:bg-slate-700 p-1 rounded"><X size={20}/></button>
                      </div>
                    </td>
                  </>
                ) : (
                  /* --- READ MODE --- */
                  <>
                    <td className="p-4 font-mono text-sm">{t.date}</td>
                    <td className="p-4 font-medium text-white">{t.desc}</td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="bg-slate-800 text-slate-400 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-slate-700 w-fit">
                          {t.cat}
                        </span>
                        {/* RECURRING INDICATOR */}
                        <span className={`text-[9px] mt-1 font-bold ${t.recurring === 'recurring' ? 'text-indigo-400' : 'text-slate-600'}`}>
                          {t.recurring === 'recurring' ? '● Recurring' : '○ Non-recurring'}
                        </span>
                      </div>
                    </td>
                    <td className={`p-4 text-right font-bold ${t.amount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {formatMoney(t.amount)} 
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-3">
                        <button onClick={() => handleEditClick(t)} className="text-slate-500 hover:text-blue-400"><Pencil size={18} /></button>
                        <button onClick={() => handleDelete(t.id)} className="text-slate-500 hover:text-rose-400"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </>
                )}
              </tr> 
            ))}
          </tbody>
        </table>
      </div>
      {/* --- POP-UP MODAL (ADD TRANSACTION) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-8 shadow-2xl scale-in-center">
            <h2 className="text-2xl font-bold text-white mb-6">New Entry</h2>
      
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Category</label>
                <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500" 
                  onChange={(e) => setNewTransaction({...newTransaction, cat: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Description</label>
                <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500" 
                  onChange={(e) => setNewTransaction({...newTransaction, desc: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Amount ({currency})</label>
                  <input type="number" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500" 
                    onChange={(e) => setNewTransaction({...newTransaction, amount: parseFloat(e.target.value)})} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Date</label>
                  <input type="date" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500" 
                    value={newTransaction.date} onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Status</label>
                 <select className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500"
                    onChange={(e) => setNewTransaction({...newTransaction, recurring: e.target.value})}>
                    <option value="non-recurring">One-time Expense</option>
                    <option value="recurring">Monthly Recurring</option>
                    <option value="recurring">Yearly Recurring</option>
                  </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-700 transition-all">Cancel</button>
                <button onClick={async () => {
                  // Logic to call transactionService.create(newTransaction)
                  setIsModalOpen(false);
                  loadData();
                }} className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/30">Save Transaction</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}