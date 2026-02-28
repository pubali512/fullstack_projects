import { Link } from 'react-router-dom';
import { LayoutDashboard, ReceiptText, Tags } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col gap-6">
      <div className="text-blue-500 font-black text-2xl">Finance App</div>
      <div className="flex flex-col gap-2">
        <Link to="/" className="flex items-center gap-3 text-slate-300 hover:text-white p-2 rounded-lg hover:bg-slate-800">
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        <Link to="/transactions" className="flex items-center gap-3 text-slate-300 hover:text-white p-2 rounded-lg hover:bg-slate-800">
          <ReceiptText size={20} /> Transactions
        </Link>
        <Link to="/categories" className="flex items-center gap-3 text-slate-300 hover:text-white p-2 rounded-lg hover:bg-slate-800">
          <Tags size={20} /> Categories
        </Link>
      </div>
    </nav>
  );
}