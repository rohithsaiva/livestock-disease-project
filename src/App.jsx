import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Solution from './components/Solution';
import AiModel from './components/AiModel';
import Login from './components/Login';
import DashboardUnderConstruction from './components/DashboardUnderConstruction';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import { authService } from './services/auth';

import './App.css';

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

const TAB_ORDER = ['home', 'features', 'solution', 'model', 'login', 'dashboard', 'admin', 'about', 'contact'];

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  React.useEffect(() => {
    setUser(authService.getCurrentUser());
  }, []);

  // Set up auth guard for admin route
  React.useEffect(() => {
    if (activeTab === 'admin' && (!user || user.role !== 'admin')) {
      setActiveTab('login');
      window.scrollTo(0, 0);
    }
  }, [activeTab, user]);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setActiveTab('home');
    window.scrollTo(0, 0);
  };

  // Simulate loading delay for the splash screen
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500); // 2.5 seconds loading time
    return () => clearTimeout(timer);
  }, []);

  // We are mapping the navigation keys to their respective components
  const renderTabContent = () => {
    switch(activeTab) {
      case 'home':
        return <Hero setActiveTab={setActiveTab} />;
      case 'features':
        return <Features />;
      case 'solution':
        return <Solution />;
      case 'model':
        return <AiModel />;
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
        return <DashboardUnderConstruction onHome={() => {
          setActiveTab('home');
          window.scrollTo(0, 0);
        }} />;
      case 'admin':
        return <AdminDashboard user={user} onLogout={handleLogout} />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      default:
        return <Hero setActiveTab={setActiveTab} />;
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
          <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
          
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

            {/* Slide Navigation Buttons */}
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
          </main>
          
          <Footer />
        </motion.div>
      )}
    </>
  );
}

export default App;
