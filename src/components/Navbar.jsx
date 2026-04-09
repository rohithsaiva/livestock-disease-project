import React, { useState, useEffect } from 'react';
import { Menu, X, Activity } from 'lucide-react';
import { authService } from '../services/auth';
import './Navbar.css';

const Navbar = ({ activeTab, setActiveTab }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = authService.getCurrentUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Features', id: 'features' },
    { name: 'Solution', id: 'solution' },
    { name: 'AI Model', id: 'model' },
    user 
      ? (user.role === 'admin' ? { name: 'Admin', id: 'admin' } : { name: 'Dashboard', id: 'dashboard' })
      : { name: 'Login', id: 'login' },
    { name: 'About', id: 'about' },
  ];

  const handleNavClick = (e, id) => {
    e.preventDefault();
    setActiveTab(id);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0); // Reset scroll position when switching tabs
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled glass-card' : ''}`}>
      <div className="container nav-container">
        <a 
          href="#" 
          onClick={(e) => handleNavClick(e, 'home')}
          className="logo"
        >
          <Activity className="logo-icon" size={28} />
          <span className="logo-text">Livestock<span className="logo-accent">AI</span></span>
        </a>

        {/* Desktop Menu */}
        <div className="nav-links desktop-only">
          {navLinks.map((link) => (
            <a 
              key={link.id} 
              href={`#${link.id}`} 
              onClick={(e) => handleNavClick(e, link.id)}
              className={`nav-link ${activeTab === link.id ? 'active-tab' : ''}`}
            >
              {link.name}
            </a>
          ))}
          <button 
            onClick={(e) => handleNavClick(e, 'contact')} 
            className="btn btn-primary nav-btn"
          >
            Get in Touch
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-toggle mobile-only"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open glass-card' : ''}`}>
        {navLinks.map((link) => (
          <a 
            key={link.id} 
            href={`#${link.id}`} 
            className={`mobile-link ${activeTab === link.id ? 'active-mobile-tab' : ''}`}
            onClick={(e) => handleNavClick(e, link.id)}
          >
            {link.name}
          </a>
        ))}
        <button 
          onClick={(e) => handleNavClick(e, 'contact')} 
          className="btn btn-primary mobile-btn"
        >
          Get in Touch
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
