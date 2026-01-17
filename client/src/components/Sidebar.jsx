import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, Ghost, Link as LinkIcon, Settings, LogOut } from 'lucide-react';

export default function Sidebar({ onLogout }) {
  const menuItems = [
    { id: 'dashboard', path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'connect', path: '/connect', icon: LinkIcon, label: 'Integrations' },
    { id: 'reaper', path: '/reaper', icon: Ghost, label: 'Shred List' },
  ];

  const location = useLocation();

  const handleLogoutClick = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      onLogout();
    }
  };

  return (
    <div className="sidebar">
      <div className="logo-container">
        <Ghost color="var(--accent-primary)" size={32} />
        <span className="logo-text">Spend<span className="reaper-text">SHRED</span></span>
      </div>

      <nav className="nav-menu">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <Link to="/settings" className="nav-item">
          <Settings size={20} />
          <span>Settings</span>
        </Link>
        <button className="nav-item logout" onClick={handleLogoutClick}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      <style>{`
        .sidebar {
          width: 260px;
          height: 100vh;
          background: var(--bg-card);
          border-right: 1px solid var(--glass-border);
          display: flex;
          flex-direction: column;
          padding: 24px;
          box-sizing: border-box;
          position: fixed;
          left: 0;
          top: 0;
          overflow-y: auto; /* Fix bottom cutoff */
          z-index: 100;    /* Ensure above main content */
        }
        .logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 48px;
          padding-left: 12px;
          flex-shrink: 0; /* Prevent Logo crushing */
        }
        .logo-text {
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }
        .reaper-text {
          color: var(--accent-primary);
        }
        .nav-menu {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
          overflow-y: auto;
          min-height: 0;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE/Edge */
        }
        .nav-menu::-webkit-scrollbar {
          display: none; /* Chrome/Safari */
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 14px;
          font-weight: 500;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.2s;
          width: 100%;
          text-decoration: none;
          white-space: nowrap;      /* Prevent wrap */
          overflow: hidden;         /* Clip overflow */
          text-overflow: ellipsis;  /* Add dots */
          flex-shrink: 0;           /* Prevent item squashing */
        }
        .nav-item:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
        }
        .nav-item.active {
          background: rgba(255, 77, 77, 0.1);
          color: var(--accent-primary);
        }
        .sidebar-footer {
          border-top: 1px solid var(--glass-border);
          padding-top: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex-shrink: 0; /* Prevent footer crushing */
          margin-top: auto; /* Push to bottom if space permits */
          padding-bottom: 24px; /* Lift up from very bottom */
        }
        .logout:hover {
          color: var(--accent-primary);
        }
      `}</style>
    </div>
  );
}
