import { Routes, Route } from 'react-router-dom';
import ProjectsPage from '../pages/Projects';
import TimesheetPage from '../pages/Timesheet';
import DashboardPage from '../pages/Dashboard';

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/timesheet" element={<TimesheetPage />} />
        </Routes>
    );
}