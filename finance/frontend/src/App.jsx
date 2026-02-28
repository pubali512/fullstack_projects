import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CurrencyProvider } from './context/CurrencyContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';

function App() {
  return (
    <CurrencyProvider>
      <Router>
        <div className="flex min-h-screen bg-slate-950">
          <Navbar />
          <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
            <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/categories" element={<Categories />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CurrencyProvider>  
  );
}

export default App;