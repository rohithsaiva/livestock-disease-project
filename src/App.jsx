/**
 * Main Application Component (LivestockAI)
 * Handles global routing, notification state, and user authentication flow.
 * Organizes the application into Public, User, and Admin page tiers.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ChevronLeft, ChevronRight, User, LogOut } from 'lucide-react';
import Navbar from './components/Navbar';
import Home from './pages/public/Home';
import Features from './pages/public/Features';
import Solution from './pages/public/Solution';
import AIModel from './pages/public/AIModel';
import Login from './pages/public/Login';
import UserDashboard from './pages/user/UserDashboard';
import DiseasePrediction from './pages/user/DiseasePrediction';
import PredictionResult from './pages/user/PredictionResult';
import AdvisorySystem from './pages/user/AdvisorySystem';
import AnimalRecords from './pages/user/AnimalRecords';
import Alerts from './pages/user/Alerts';
import About from './pages/public/About';
import UserAbout from './pages/user/UserAbout';
import GetInTouch from './pages/public/GetInTouch';
import Footer from './components/Footer';
import AdminDashboard from './pages/admin/AdminDashboard';
import { authService } from './services/auth';
import { securityService } from './services/securityService';

import './App.css';
import './pages/user/EnterpriseDashboard.css';


// Simple Splash Screen Component
const SplashScreen = () => (
  <motion.div
    className="splash-screen"
    initial={{ opacity: 1 }}
    exit={{ opacity: 0, scale: 1.1 }}
    transition={{ duration: 0.8, ease: "easeInOut" }}
  >
    <div className="splash-content">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="splash-logo-icon"
      >
        <Activity size={64} color="var(--color-soft-green)" />
      </motion.div>
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Livestock<span style={{ color: "var(--color-soft-green)" }}>AI</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Initializing Smart Agriculture...
      </motion.p>
    </div>
  </motion.div>
);

// Phase 5: RBAC Middleware / Protected Route Pattern
// Strictly fail closed if roles misalign preventing direct renders
const ProtectedRoute = ({ user, requiredRole, children, fallbackAction }) => {
  if (!user) {
    fallbackAction('login');
    return null;
  }
  
  if (requiredRole && !securityService.hasRole(user, requiredRole)) {
    fallbackAction(user.role === 'admin' ? 'admin' : 'dashboard');
    return null;
  }
  
  return children;
};

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  React.useEffect(() => {
    setUser(authService.getCurrentUser());
  }, []);

  // Dynamically generate the valid tabs sequence based on user role
  const getTabOrder = () => {
    if (!user) {
      // Public users get the full landing page experience
      return ['home', 'features', 'solution', 'model', 'about', 'login', 'contact'];
    }
    if (user.role === 'admin') {
      // Admin only sees admin panel
      return ['admin'];
    }
    // Normal logged-in user only sees the dashboard and its sub-pages
    return ['dashboard', 'disease-prediction', 'prediction-result', 'advisory-system', 'animal-records', 'ai-reports', 'user-about', 'contact'];
  };

  const TAB_ORDER = getTabOrder();

  // Set up auth guard for protected routes
  React.useEffect(() => {
    // Kick out unauthorized attempts to reach admin
    if (activeTab === 'admin' && (!user || user.role !== 'admin')) {
      setActiveTab('login');
      window.scrollTo(0, 0);
    }
    // Kick out unauthorized attempts to reach dashboard
    if (activeTab === 'dashboard' && !user) {
      setActiveTab('login');
      window.scrollTo(0, 0);
    }
    // Force Admin back to admin panel if they somehow reach public spaces
    if (user && user.role === 'admin' && activeTab !== 'admin') {
      setActiveTab('admin');
      window.scrollTo(0, 0);
    }
    // Force normal User back to dashboard if they somehow reach public spaces (except contact)
    if (user && user.role === 'user' && !['dashboard', 'disease-prediction', 'prediction-result', 'advisory-system', 'animal-records', 'ai-reports', 'user-about', 'contact'].includes(activeTab)) {
      setActiveTab('dashboard');
      window.scrollTo(0, 0);
    }
  }, [activeTab, user]);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setActiveTab('home');
    window.scrollTo(0, 0);
  };

  // Phase 3: Auto Logout Interval (Session Expiry checks)
  React.useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        // Session mechanically expired, force visual logout globally
        handleLogout();
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [user, activeTab]);

  // Simulate loading delay for the splash screen
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500); // 2.5 seconds loading time
    return () => clearTimeout(timer);
  }, []);

  // We are mapping the navigation keys to their respective components
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home setActiveTab={setActiveTab} />;
      case 'features':
        return <Features />;
      case 'solution':
        return <Solution />;
      case 'model':
        return <AIModel />;
      case 'login':
        return (
          <Login
            onAuthSuccess={(role) => {
              setUser(authService.getCurrentUser());
              setActiveTab(role === 'admin' ? 'admin' : 'dashboard');
              window.scrollTo(0, 0);
            }}
          />
        );
      case 'dashboard':
        return (
          <ProtectedRoute user={user} requiredRole="user" fallbackAction={setActiveTab}>
            <UserDashboard onNavigate={(tab) => { setActiveTab(tab); window.scrollTo(0, 0); }} />
          </ProtectedRoute>
        );
      case 'disease-prediction':
        return (
          <ProtectedRoute user={user} requiredRole="user" fallbackAction={setActiveTab}>
            <DiseasePrediction onNavigate={(tab) => { setActiveTab(tab); window.scrollTo(0, 0); }} />
          </ProtectedRoute>
        );
      case 'prediction-result':
        return (
          <ProtectedRoute user={user} requiredRole="user" fallbackAction={setActiveTab}>
            <PredictionResult onNavigate={(tab) => { setActiveTab(tab); window.scrollTo(0, 0); }} />
          </ProtectedRoute>
        );
      case 'advisory-system':
        return (
          <ProtectedRoute user={user} requiredRole="user" fallbackAction={setActiveTab}>
            <AdvisorySystem onNavigate={(tab) => { setActiveTab(tab); window.scrollTo(0, 0); }} />
          </ProtectedRoute>
        );
      case 'animal-records':
        return (
          <ProtectedRoute user={user} requiredRole="user" fallbackAction={setActiveTab}>
            <AnimalRecords onNavigate={(tab) => { setActiveTab(tab); window.scrollTo(0, 0); }} />
          </ProtectedRoute>
        );
      case 'ai-reports':
        return (
          <ProtectedRoute user={user} requiredRole="user" fallbackAction={setActiveTab}>
            <Alerts onNavigate={(tab) => { setActiveTab(tab); window.scrollTo(0, 0); }} />
          </ProtectedRoute>
        );
      case 'user-about':
        return (
          <ProtectedRoute user={user} requiredRole="user" fallbackAction={setActiveTab}>
            <UserAbout onNavigate={(tab) => { setActiveTab(tab); window.scrollTo(0, 0); }} />
          </ProtectedRoute>
        );
      case 'admin':
        return (
          <ProtectedRoute user={user} requiredRole="admin" fallbackAction={setActiveTab}>
            <AdminDashboard user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        );
      case 'about':
        return <About />;
      case 'contact':
        return <GetInTouch />;
      default:
        return <Home setActiveTab={setActiveTab} />;
    }
  };

  const currentIdx = TAB_ORDER.indexOf(activeTab);
  const showBack = currentIdx > 0;
  const showNext = currentIdx < TAB_ORDER.length - 1;

  const handleNext = () => {
    if (showNext) {
      setActiveTab(TAB_ORDER[currentIdx + 1]);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (showBack) {
      setActiveTab(TAB_ORDER[currentIdx - 1]);
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      <AnimatePresence>
        {loading && <SplashScreen key="splash" />}
      </AnimatePresence>

      {!loading && (
        <motion.div
          className="tab-layout-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {/* Only show public navbar for unauthenticated users */}
          {!user && (
            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
          )}

          {/* User Dashboard Header */}
          {user && user.role === 'user' && (
            <div className="enterprise-dashboard">
              <nav className="enterprise-navbar">
                <div onClick={() => { setActiveTab('dashboard'); window.scrollTo(0, 0); }} className="ent-brand">
                  <Activity className="ent-brand-icon" size={28} />
                  <span className="ent-brand-text">Livestock<span className="ent-brand-accent">AI</span></span>
                </div>

                <div className="ent-nav-actions">
                  <button onClick={() => { setActiveTab('user-about'); window.scrollTo(0, 0); }} className="ent-btn ent-btn-secondary">
                    <Activity size={18} /> About
                  </button>
                  <button onClick={handleLogout} className="ent-btn ent-btn-danger">
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              </nav>

              <main className="tab-content-area" style={{ paddingTop: 0 }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4 }}
                    className="tab-slide"
                  >
                    {renderTabContent()}
                  </motion.div>
                </AnimatePresence>
              </main>
            </div>
          )}

          {/* Fallback to original layout for Admin/Public */}
          {(!user || user.role !== 'user') && (
            <main className="tab-content-area">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="tab-slide"
                >
                  {renderTabContent()}
                </motion.div>
              </AnimatePresence>

              {/* Slide Navigation Buttons - Only show for public Unauthenticated users */}
              {!user && (
                <div className="container slide-nav-container">
                  <div className="nav-btn-group">
                    {showBack && (
                      <button onClick={handleBack} className="btn-slide-nav back">
                        <ChevronLeft size={20} /> Back
                      </button>
                    )}
                    <div className="nav-spacer"></div>
                    {showNext && (
                      <button onClick={handleNext} className="btn-slide-nav next">
                        Next <ChevronRight size={20} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </main>
          )}

          {/* Only show public footer for unauthenticated users */}
          {!user && <Footer />}
        </motion.div>

      )}
    </>
  );
}

export default App;
