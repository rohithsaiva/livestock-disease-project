
/**
 * Main Application Component (LivestockAI)
 * Handles global routing, notification state, and user authentication flow.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ChevronLeft, ChevronRight, LogOut, BrainCircuit, Heart } from 'lucide-react';
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
import { auth } from './config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

import './App.css';
import './pages/user/EnterpriseDashboard.css';

// Splash Screen
const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="splash-screen">
      <div className="splash-content">
        <div className="splash-logo-icon">
          <Activity size={64} color="var(--color-soft-green)" />
        </div>
        <h1>Livestock<span style={{ color: 'var(--color-soft-green)' }}>AI</span></h1>
        <p>Initializing Smart Agriculture...</p>
      </div>
    </div>
  );
};

// Protected Route
const ProtectedRoute = ({ user, requiredRole, children, fallbackAction }) => {
  if (!user) {
    return <Login onAuthSuccess={(role) => fallbackAction(role === 'admin' ? 'admin' : 'dashboard')} />;
  }
  if (requiredRole && !securityService.hasRole(user, requiredRole)) {
    return <Login onAuthSuccess={(role) => fallbackAction(role === 'admin' ? 'admin' : 'dashboard')} />;
  }
  return children;
};

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);

  // Seed admin user from localStorage so ProtectedRoute passes without Firebase
  const [user, setUser] = useState(() => {
    if (localStorage.getItem("isAdmin") === "true") {
      return { uid: 'admin', email: 'rohithsaiva8@gmail.com', role: 'admin' };
    }
    return null;
  });

  console.log("App State →", { loading, activeTab });
  console.log("Rendering tab:", activeTab);

  // Firebase auth listener
  useEffect(() => {
    if (!auth) return;

    // If admin session already set via localStorage, skip Firebase listener for initial tab
    if (localStorage.getItem("isAdmin") === "true") {
      setActiveTab('admin');
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (localStorage.getItem("otpEmail")) {
        console.log("OTP flow active — skip redirect");
        return;
      }
      if (firebaseUser) {
        console.log("User detected → dashboard");
        const loggedInUser = { uid: firebaseUser.uid, email: firebaseUser.email, role: 'user' };
        setUser(loggedInUser);
        setActiveTab(loggedInUser.role === 'admin' ? 'admin' : 'dashboard');
      } else {
        console.log("No user → home");
        setUser(null);
        setActiveTab('home');
      }
    });
    return () => unsubscribe();
  }, []);

  // Auto logout check
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      if (!authService.getCurrentUser()) handleLogout();
    }, 60000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = async () => {
    try {
      // Clear admin override first
      localStorage.removeItem('isAdmin');
      await signOut(auth);
      authService.logout();
      localStorage.removeItem('otpEmail');
      console.log('User logged out');
      window.location.href = '/';
    } catch (err) {
      console.error('Logout error:', err);
      localStorage.removeItem('isAdmin');
      setUser(null);
      setActiveTab('home');
    }
  };

  // Tab order for prev/next nav (public only)
  const TAB_ORDER = ['home', 'features', 'solution', 'model', 'about', 'login', 'contact'];
  const currentIdx = TAB_ORDER.indexOf(activeTab);
  const showBack = currentIdx > 0;
  const showNext = currentIdx < TAB_ORDER.length - 1;
  const handleNext = () => { if (showNext) { setActiveTab(TAB_ORDER[currentIdx + 1]); window.scrollTo(0, 0); } };
  const handleBack = () => { if (showBack) { setActiveTab(TAB_ORDER[currentIdx - 1]); window.scrollTo(0, 0); } };

  // Safe tab renderer — always returns something
  const renderTab = () => {
    try {
      switch (activeTab) {
        case 'home':        return <Home setActiveTab={setActiveTab} />;
        case 'features':    return <Features />;
        case 'solution':    return <Solution />;
        case 'model':       return <AIModel />;
        case 'about':       return <About />;
        case 'contact':     return <GetInTouch />;
        case 'login':
          return (
            <Login
              onAuthSuccess={(role) => {
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
        default:
          console.warn("Invalid tab:", activeTab);
          return <Home setActiveTab={setActiveTab} />;
      }
    } catch (err) {
      console.error("Render crash:", err);
      return <div style={{ color: 'red', padding: '2rem' }}>Render Error: {err.message}</div>;
    }
  };

  // SPLASH — early return, nothing else rendered
  if (loading) {
    return <SplashScreen onFinish={() => setLoading(false)} />;
  }

  // All known tabs
  const knownTabs = ['home', 'features', 'solution', 'model', 'about', 'contact',
    'login', 'dashboard', 'disease-prediction', 'prediction-result',
    'advisory-system', 'animal-records', 'ai-reports', 'user-about', 'admin'];

  // STEP 1 — renderSafe: wraps all tab rendering in try-catch for crash visibility
  const renderSafe = () => {
    try {
      if (activeTab === 'home')               return <Home setActiveTab={setActiveTab} />;
      if (activeTab === 'features')           return <Features />;
      if (activeTab === 'solution')           return <Solution />;
      if (activeTab === 'model')              return <AIModel />;
      if (activeTab === 'about')              return <About />;
      if (activeTab === 'contact')            return <GetInTouch />;
      if (activeTab === 'login')              return <Login onAuthSuccess={(role) => { setActiveTab(role === 'admin' ? 'admin' : 'dashboard'); window.scrollTo(0, 0); }} />;
      if (activeTab === 'dashboard')          return <ProtectedRoute user={user} requiredRole="user" fallbackAction={setActiveTab}><UserDashboard onNavigate={(tab) => { setActiveTab(tab); window.scrollTo(0, 0); }} /></ProtectedRoute>;
      if (activeTab === 'disease-prediction') return <ProtectedRoute user={user} requiredRole="user" fallbackAction={setActiveTab}><DiseasePrediction onNavigate={(tab) => { setActiveTab(tab); window.scrollTo(0, 0); }} /></ProtectedRoute>;
      if (activeTab === 'prediction-result')  return <ProtectedRoute user={user} requiredRole="user" fallbackAction={setActiveTab}><PredictionResult onNavigate={(tab) => { setActiveTab(tab); window.scrollTo(0, 0); }} /></ProtectedRoute>;
      if (activeTab === 'advisory-system')    return <ProtectedRoute user={user} requiredRole="user" fallbackAction={setActiveTab}><AdvisorySystem onNavigate={(tab) => { setActiveTab(tab); window.scrollTo(0, 0); }} /></ProtectedRoute>;
      if (activeTab === 'animal-records')     return <ProtectedRoute user={user} requiredRole="user" fallbackAction={setActiveTab}><AnimalRecords onNavigate={(tab) => { setActiveTab(tab); window.scrollTo(0, 0); }} /></ProtectedRoute>;
      if (activeTab === 'ai-reports')         return <ProtectedRoute user={user} requiredRole="user" fallbackAction={setActiveTab}><Alerts onNavigate={(tab) => { setActiveTab(tab); window.scrollTo(0, 0); }} /></ProtectedRoute>;
      if (activeTab === 'user-about')         return <ProtectedRoute user={user} requiredRole="user" fallbackAction={setActiveTab}><UserAbout onNavigate={(tab) => { setActiveTab(tab); window.scrollTo(0, 0); }} /></ProtectedRoute>;
      if (activeTab === 'admin')              return <ProtectedRoute user={user} requiredRole="admin" fallbackAction={setActiveTab}><AdminDashboard user={user} onLogout={handleLogout} /></ProtectedRoute>;
      // Final fallback
      return <Home setActiveTab={setActiveTab} />;
    } catch (err) {
      console.error("CRASH DETECTED:", err);
      return (
        <div style={{ padding: '20px', color: 'red', background: '#fff', fontFamily: 'monospace' }}>
          <h2>Crash Detected</h2>
          <p><strong>Tab:</strong> {activeTab}</p>
          <p><strong>Error:</strong> {err.message}</p>
          <pre style={{ fontSize: '12px', marginTop: '10px' }}>{err.stack}</pre>
        </div>
      );
    }
  };

  return (
    <div className={`tab-layout-wrapper ${user && user.role === 'user' ? 'enterprise-dashboard' : ''}`}>

      {/* Dashboard Ambient Particles */}
      {user && user.role === 'user' && (
        <div className="ent-floating-bg">
          <motion.div className="floating-item float-icon-1" animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}>
            <Activity size={50} style={{ color: "rgba(34, 197, 94, 0.7)" }} />
          </motion.div>
          <motion.div className="floating-item float-icon-2" animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 1 }}>
            <span role="img" aria-label="Cow" style={{ fontSize: "3.5rem", opacity: 0.85 }}>🐄</span>
          </motion.div>
          <motion.div className="floating-item float-icon-3" animate={{ y: [0, -15, 0], x: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 9, ease: "easeInOut", delay: 2 }}>
            <Heart fill="rgba(34, 197, 94, 0.45)" stroke="none" size={75} />
          </motion.div>
          <motion.div className="floating-item float-icon-4" animate={{ y: [0, 25, 0], rotate: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 11, ease: "easeInOut", delay: 0.5 }}>
            <span role="img" aria-label="Sheep" style={{ fontSize: "3.5rem", opacity: 0.85 }}>🐑</span>
          </motion.div>
          <motion.div className="floating-item float-icon-5" animate={{ y: [0, -25, 0], x: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 10.5, ease: "easeInOut", delay: 1.5 }}>
            <BrainCircuit size={65} style={{ color: "rgba(16, 185, 129, 0.65)" }} />
          </motion.div>
          <motion.div className="floating-item float-sphere" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 30, ease: "linear" }}>
            <div className="ent-sphere-inner"></div>
          </motion.div>
        </div>
      )}

      {/* Public navbar */}
      {!user && <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />}

      {/* Logged-in user nav */}
      {user && user.role === 'user' && (
        <nav className="enterprise-navbar">
          <div onClick={() => { setActiveTab('dashboard'); window.scrollTo(0, 0); }} className="ent-brand">
            <Activity className="ent-brand-icon" size={28} />
            <span className="ent-brand-text">Livestock<span className="ent-brand-accent">AI</span></span>
          </div>
          <div className="ent-nav-actions">
            <motion.button 
              onClick={() => { setActiveTab('user-about'); window.scrollTo(0, 0); }} 
              className="ent-btn ent-btn-secondary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Activity size={18} /> About
            </motion.button>
            <motion.button 
              onClick={handleLogout} 
              className="ent-btn ent-btn-danger"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <LogOut size={18} /> Logout
            </motion.button>
          </div>
        </nav>
      )}

      {/* Page content — renderSafe() handles all tabs with try-catch */}
      <main className="tab-content-area" style={user && user.role === 'user' ? { paddingTop: 0 } : {}}>

        {renderSafe()}

        {/* Prev / Next nav — public only */}
        {!user && (
          <div className="container slide-nav-container">
            <div className="nav-btn-group">
              {showBack && <button onClick={handleBack} className="btn-slide-nav back"><ChevronLeft size={20} /> Back</button>}
              <div className="nav-spacer"></div>
              {showNext && <button onClick={handleNext} className="btn-slide-nav next">Next <ChevronRight size={20} /></button>}
            </div>
          </div>
        )}
      </main>

      {/* Footer — rendered globally as requested */}
      <Footer />
    </div>
  );
}

export default App;

