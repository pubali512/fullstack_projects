// Global components and libraries
import { BrowserRouter } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

// Import of local components and pages 
import '../styles/App.css';
import ProjectsPage from '../pages/Projects';
import TimesheetPage from '../pages/Timesheet';
import DashboardPage from '../pages/Dashboard';
import { getProjects } from '../services/Api'; 


/* Navigation Bar */
const NavItems = {
    '/': 'Dashboard',
    '/projects': 'Projects',
    '/timesheet': 'Timesheet'
};

const linkStyle = ({ isActive }) => ({
    marginRight: '1rem',
    textDecoration: 'none',
    color: isActive ? 'blue' : 'black',
    backgroundColor: isActive ? '#f4d6d6' : 'transparent',
    borderRadius: '6px',
    padding: '0.5rem 1rem',
    fontSize: '1.5rem',
});

function NavBar({ links = NavItems }) {
    return (
        <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
            {Object.entries(links).map(([to, label]) => (
                <NavLink key={to} to={to} style={linkStyle}>
                    {label}
                </NavLink>
            ))}
        </nav>
    );
}

/* Main App Component */
export default function App() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        getProjects().then(setProjects);
    }, []);


    return (
        <div>
            <BrowserRouter>
                <h1>Timesheet App</h1>
                <NavBar links={NavItems} />
                <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/projects" element={<ProjectsPage projects={projects} />} />
                    <Route path="/timesheet" element={<TimesheetPage projects={projects} />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

