import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiHome, FiUsers, FiFileText, FiSettings,
  FiLogOut, FiList, FiUserCheck, FiClipboard
} from 'react-icons/fi';

export default function Sidebar() {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="/logorssmweb.png" alt="Logo RSUD" />
        <h3>Reminder Kerjasama</h3>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section">Menu Utama</div>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="nav-icon"><FiHome /></span> Dashboard
        </NavLink>
        <NavLink to="/kerjasama" className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="nav-icon"><FiFileText /></span> Kerjasama
        </NavLink>

        {hasRole('MAKER', 'ADMIN') && (
          <>
            <div className="sidebar-section">Master Data</div>
            <NavLink to="/mitra" className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="nav-icon"><FiUsers /></span> Mitra
            </NavLink>
          </>
        )}

        {hasRole('CHECKER', 'ADMIN') && (
          <>
            <div className="sidebar-section">Monitoring</div>
            <NavLink to="/audit-trail" className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="nav-icon"><FiClipboard /></span> Audit Trail
            </NavLink>
          </>
        )}

        {hasRole('ADMIN') && (
          <>
            <div className="sidebar-section">Administrasi</div>
            <NavLink to="/users" className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="nav-icon"><FiUserCheck /></span> Manajemen User
            </NavLink>
            <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="nav-icon"><FiSettings /></span> Pengaturan
            </NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <strong>{user?.fullName || user?.username}</strong>
          <br />
          <span className="role-badge">{user?.role}</span>
        </div>
        <button onClick={handleLogout} className="btn btn-sm btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>
          <FiLogOut /> Logout
        </button>
      </div>
    </aside>
  );
}
