import React, { useEffect, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

const WhatsAppButton = () => {
  const location = useLocation();
  const [isMobileOrTab, setIsMobileOrTab] = useState(false);

  const phoneNumber = '919884248531'; // Replace with your WhatsApp number
  const message = 'Hello, I have a question about...';

  const hideOnRoutes = ["/login", "/register"];

  useEffect(() => {
    const handleResize = () => {
      setIsMobileOrTab(window.innerWidth <= 991);
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (hideOnRoutes.includes(location.pathname)) {
    return null;
  }

  return (
    <div 
      className="whatsapp-button"
      style={{
        position: 'fixed',
        bottom: isMobileOrTab ? '50px' : '20px',
        right: '20px',
        zIndex: 10000,
      }}
    >
      <a
        href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-success chat-button rounded-circle p-3"
        style={{
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        }}
      >
        <FaWhatsapp size={30} />
      </a>
    </div>
  );
};

export default WhatsAppButton;
