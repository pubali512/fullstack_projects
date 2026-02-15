import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

const linkStyle = ({ isActive }) => ({
    marginRight: '1rem',
    textDecoration: 'none',
    color: isActive ? 'blue' : 'black',
    backgroundColor: isActive ? '#f4d6d6' : 'transparent',
    borderRadius: '6px',
    padding: '0.5rem 1rem',
    fontSize: '1.5rem',
});


export default function NavBar({ links = { '/': 'Dashboard', '/projects': 'Projects', '/timesheet': 'Timesheet' } }) {
    return (
        <nav style={{padding: '1rem', borderBottom: '1px solid #ccc'}}>
            {Object.entries(links).map(([to, label]) => (
                <NavLink key={to} to={to} style={linkStyle}>
                    {label}
                </NavLink>
            ))}
        </nav>
    );
}
