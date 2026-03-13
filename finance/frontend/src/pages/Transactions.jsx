import { useState, useEffect, useMemo } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { apiService, categories, paginationOptions } from '../services/api';
import { Pencil, Check, X, Trash2, Loader2, Search } from 'lucide-react';

export default function Transactions() {
  const { currency, formatMoney } = useCurrency();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10);     /* Pagination */
  const [currentPage, setCurrentPage] = useState(0);        /* 0 is the first page */
  const [searchTerm, setSearchTerm] = useState("");         /* Search while editing/viewing */
  const [isModalOpen, setIsModalOpen] = useState(false);    /* Add Modal */
  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    category  : categories[0],
    amount: '',
    status: 'One-time'          /* Default value */
  });
  const [isSaving, setIsSaving] = useState(false);

  // Logic: Filter by search, category, recurring status, then slice
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      /* Clean the search term */
      const search = searchTerm.toLowerCase().trim();
      if (!search) return true;

      /* Map to the NEW keys from the Flask Backend */
      /* Using || "" to prevent crashes if a field is somehow null */
      const description = (t.description || "").toLowerCase();
      const category = (t.category || "").toLowerCase();
      const status = (t.status || "").toLowerCase();    /* "One-time" or "Recurring" */
      
      /*  Match against the search term */
      return (
        description.includes(search) || 
        category.includes(search) || 
        status.includes(search)
      );
    });
    
  }, [transactions, searchTerm]);

  const displayTransactions = filteredTransactions;


  // State for Inline Editing
  const [editId, setEditId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    date: '',
    description: '',
    category: '',
    status: 'One-time',
    amount: ''
  });
  

  // Load data from the API on component mount 
  useEffect(() => {
    loadData();
  }, [visibleCount, currentPage]);  /* Reload when pagination changes */

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await apiService.getTransactions({ 
        limit: visibleCount,
        offset: currentPage * visibleCount 
      });
      setTransactions(data);
    } catch (error) {
      console.error("Error loading data from backend:", error);
      setTransactions([]); 
    } finally {
      setLoading(false);
    }
  };

  // Prepare the row for editing (Populates the pop-up/modal)
  const handleEditClick = (transaction) => {
    setEditId(transaction.id);
    /* Ensure the form matches the keys expected by the backend */
    setEditFormData({ 
      ...transaction,
      /* If backend sends 'category' as a string, it maps correctly here */
      status: transaction.status === 'Recurring' ? 'Recurring' : 'One-time'
    });
    /* If a modal is used, set the open state */
    // setIsModalOpen(true); 
  };

  // Save changes (Logic for both Mock and API)
  const handleSave = async () => {
    try {
      const payload = {
        category: editFormData.category,
        description: editFormData.description,
        amount: parseFloat(editFormData.amount),
        date: editFormData.date,
        status: editFormData.status    /* Should be "One-time" or "Recurring" */
      };

      // Use the apiService instead of fetch
      if (editId) {
        /* CASE A: Use updateTransaction service */
        await apiService.updateTransaction(editId, payload);
      } else {
        /* CASE B: Use createTransaction service */
        await apiService.createTransaction(payload);
      }

      /* Refresh the UI by calling the existing loadData function */
      await loadData();

      /* Reset UI states */
      setEditId(null);
      setIsModalOpen(false);
      console.log("Saved to Database successfully!");

    } catch (error) {
      console.error("Save error:", error);
      alert("Could not save transaction. Please check if Flask is running.");
    }
  };

  // Delete Logic
  const handleDelete = async (id) => {
  if (window.confirm("Delete this transaction?")) {
    try {
      /* Call the centralized API service */
      await apiService.deleteTransaction(id);

      /* Optimistic Update: Remove from local state immediately */
      setTransactions(prev => prev.filter(t => t.id !== id));
      
      console.log(`Transaction ${id} deleted successfully.`);
    } catch (error) {
      console.error("Delete error:", error);
      alert("Server error: Could not delete the transaction.");
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
              onChange={(e) => {
                setVisibleCount(Number(e.target.value));
                setCurrentPage(0);        // --- Reset to first page when changing items per page
              }}
              className="bg-transparent text-white text-xs font-bold outline-none cursor-pointer pr-1"
            >
              {paginationOptions.map(num => (
                <option key={num} value={num} className="bg-slate-900">
                  {num}
                </option>
              ))}
            </select>
          </div>

          <button 
            onClick={() => {
              setNewTransaction({
                date: new Date().toISOString().split('T')[0],
                description: '',
                category: categories[0],
                amount: '',
                status: 'One-time'
              });
              setIsModalOpen(true);
            }}
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
              <th className="p-4">Status</th>
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
                    <td className="p-2"><input type="text" className="bg-slate-800 border border-slate-700 p-2 rounded text-sm w-full text-white" value={editFormData.description} onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}/></td>
                    <td className="p-2">
                      <select className="bg-slate-800 border border-slate-700 p-2 rounded text-sm w-full text-white" value={editFormData.category} onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </td>
                    <td className="p-2">
                      <select 
                        className="bg-slate-800 border border-slate-700 p-2 rounded text-sm w-full text-white font-bold" value={editFormData.status} onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                      >
                        <option value="One-time">One-time</option>
                        <option value="Recurring">Recurring</option>
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
                    <td className="p-4 font-medium text-white">{t.description}</td>
                    <td className="p-4">
                      <span className="bg-slate-800 text-slate-400 px-3 py-1 rounded-full text-xs border border-slate-700">
                          {t.category}
                        </span>
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded border ${
                        t.status === 'Recurring' 
                          ? 'text-indigo-400 border-indigo-500/30 bg-indigo-500/5' 
                          : 'text-slate-500 border-slate-700 bg-slate-800/50'
                      }`}>
                        {t.status}
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

      {/* --- PAGINATION CONTROLS --- */}
      <div className="flex items-center gap-3 mt-6 px-4 py-3 ml-auto justify-end">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
          disabled={currentPage === 0}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-black rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-black rounded-xl transition-all">
          Page <span className="text-white">{currentPage + 1}</span>
        </div>

        <button 
          onClick={() => setCurrentPage(prev => prev + 1)}
          // --- Disable if the current fetch returned fewer items than the limit (end of data)
          disabled={transactions.length < visibleCount}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-black rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      

      {/* --- POP-UP MODAL (ADD TRANSACTION) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-8 shadow-2xl scale-in-center">
            <h2 className="text-2xl font-bold text-white mb-6">New Entry</h2>
      
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Category</label>
                <select 
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500"
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Description</label>
                <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500" 
                  onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})} />
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
                    onChange={(e) => setNewTransaction({...newTransaction, status: e.target.value})}>
                    <option value="One-time">One-time Expense</option>
                    <option value="Recurring">Monthly Recurring</option>
                    <option value="Recurring">Yearly Recurring</option>
                  </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-700 transition-all">Cancel</button>
                <button 
                  disabled={isSaving}
                  onClick={async () => {
                    setIsSaving(true);
                    try {
                      // Using apiService to send the data
                      await apiService.createTransaction({
                        category: newTransaction.category,
                        description: newTransaction.description,
                        amount: parseFloat(newTransaction.amount),
                        date: newTransaction.date,
                        status: newTransaction.status
                      });

                      // Success logic: Close modal and refresh the list
                      setIsModalOpen(false);
                      await loadData();
                      console.log("Transaction added successfully!");
                    } catch (error) {
                      console.error("Save failed:", error);
                      // --- Axios errors often store the message in error.response.data.error
                      const errorMsg = error.response?.data?.error || "Could not connect to the backend.";
                      alert(`Error: ${errorMsg}`);
                    }finally {
                      // --- Always stop the spinner, even if it fails
                      setIsSaving(false);
                    }
                  }} 
                  className={`flex-1 px-4 py-3 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/30 ${
                    isSaving 
                      ? 'bg-blue-800 cursor-not-allowed opacity-80' 
                      : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/30'
                  }`}
                >
                  {isSaving ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" size={20} />
                      <span>Saving...</span>
                    </div>
                  ) : (
                    "Save Transaction"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}