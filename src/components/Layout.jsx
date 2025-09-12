// components/Layout.js
import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children, activeSection, setActiveSection, userRole }) => {
  return (
    <div className="dashboard-container">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} userRole={userRole} />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default Layout;