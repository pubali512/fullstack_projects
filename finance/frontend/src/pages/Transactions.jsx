import { useState, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { transactionService, categories, mockData } from '../services/api';
import { Pencil, Check, X, Trash2, Loader2 } from 'lucide-react';

export default function Transactions() {
  const { currency, formatMoney } = useCurrency();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
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
          <h1 className="text-3xl font-bold text-white tracking-tight">Transactions</h1>
          <p className="text-slate-500 text-sm">View and manage records in {currency}</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-500/20">
          + Add Transaction
        </button>
        
        <div className="flex gap-3">
           <span className="text-xs bg-slate-800 text-slate-500 px-3 py-2 rounded-lg border border-slate-700">
             Mode: {transactions === mockData ? 'Offline/Mock' : 'Live/API'}
           </span>
        </div>
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
            {transactions.map((t) => (
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
                      <span className="bg-slate-800 text-slate-400 px-3 py-1 rounded-full text-xs border border-slate-700">
                        {t.cat}
                      </span>
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
    </div>
  );
}