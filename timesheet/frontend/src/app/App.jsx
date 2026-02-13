import { BrowserRouter } from 'react-router-dom';
import '../styles/App.css';


import NavBar  from '../components/NavBar';
import AppRouter from './Router';  

const NavItems = {'/':'Dashboard', '/projects':'Projects', '/timesheet':'Timesheet'};


function App() {
    return (
        <div>
            <BrowserRouter>
            <h1>Timesheet App</h1>
            {NavBar(NavItems)}
            <AppRouter />
            </BrowserRouter>
        </div>
    );
}

export default App
