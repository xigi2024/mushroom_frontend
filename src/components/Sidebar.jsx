import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiMonitor, FiPackage, FiUser, FiSettings, FiCreditCard, FiLogOut, FiBell } from 'react-icons/fi';
import './styles/sidebar.css';

const Sidebar = ({ activeSection, setActiveSection, userRole = 'user' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const adminSidebarItems = [
    { id: 'dashboard', icon: FiHome, label: 'Admin Dashboard', path: '/admin-dashboard' },
    { id: 'iot-monitoring', icon: FiMonitor, label: 'IoT Monitoring', path: '/admin/iot-monitoring' },
    { id: 'products', icon: FiPackage, label: 'Products Order', path: '/admin/product-order' },
    { id: 'accounts', icon: FiUser, label: 'Accounts', path: '/accounts' },
    { id: 'settings', icon: FiSettings, label: 'Settings', path: '/settings' },
    { id: 'payment', icon: FiCreditCard, label: 'Payment History', path: '/payment-history' }
  ];

  const userSidebarItems = [
    { id: 'dashboard', icon: FiHome, label: 'User Dashboard', path: '/user-dashboard' },
    { id: 'iot-monitoring', icon: FiMonitor, label: 'IoT Monitoring', path: '/user/iot-monitoring' },
    { id: 'products', icon: FiPackage, label: 'Products Order', path: '/user/product-order' },
    { id: 'profile', icon: FiUser, label: 'Profile', path: '/profile' },
    { id: 'payment', icon: FiCreditCard, label: 'My Payments', path: '/user-payments' }
  ];

  const sidebarItems = userRole === 'admin' ? adminSidebarItems : userSidebarItems;

  // Set active section based on current path when component mounts or location changes
  useEffect(() => {
    const currentItem = sidebarItems.find(item => item.path === location.pathname);
    if (currentItem) {
      setActiveSection(currentItem.id);
    }
  }, [location.pathname, sidebarItems, setActiveSection]);

  const handleNavigation = (item) => {
    if (item.path) {
      navigate(item.path);
      setActiveSection(item.id);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    const { first_name } = user;
    if (first_name) {
      return first_name.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getUserDisplayName = () => {
    if (!user) return 'User';
    const { first_name, last_name } = user;
    if (first_name && last_name) {
      return `${first_name} ${last_name}`;
    } else if (first_name) {
      return first_name;
    } else if (last_name) {
      return last_name;
    }
    return user.email || 'User';
  };

  return (
    <div className="sidebar-container">
      {/* Topbar */}
      <div className="topbar">
        <div className="topbar-content">
          <h2 className="dashboard-title">
            {userRole === 'admin' ? 'Admin Dashboard' : 'User Dashboard'}
          </h2>
          <div className="topbar-right">
           
            <span className="welcome-text">Welcome, {getUserDisplayName()}</span>
            <div className="user-avatar">{getUserInitials()}</div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100vh', position: 'fixed', left: 0, top: 0 }}>
        <div className="sidebar-header">
          <img src="../src/assets/logo2.png" alt="Logo" className="img-fluid" style={{ width:"200px", height:"100px", objectFit:"contain", margin:"auto" }} />
        </div>
        <div className="sidebar-menu" style={{ flex: 1 }}>
          {sidebarItems.map(item => (
            <div 
              key={item.id}
              className={`sidebar-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => handleNavigation(item)}
            >
              <item.icon className="sidebar-icon" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        <div className="sidebar-footer" style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
          <div className="sidebar-item logout-item" onClick={handleLogout}>
            <FiLogOut className="sidebar-icon text-black" />
            <span className='text-black'>Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;