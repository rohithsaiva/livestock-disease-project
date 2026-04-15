
/**
 * Main Application Component (LivestockAI)
 * Handles global routing, notification state, and user authentication flow.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
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
import { onAuthStateChanged } from 'firebase/auth';

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
  const [user, setUser] = useState(null);

  console.log("App State →", { loading, activeTab });

  // Firebase auth listener
  useEffect(() => {
    if (!auth) return;
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

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setActiveTab('home');
    window.scrollTo(0, 0);
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

  return (
    <div className="tab-layout-wrapper">

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
            <button onClick={() => { setActiveTab('user-about'); window.scrollTo(0, 0); }} className="ent-btn ent-btn-secondary">
              <Activity size={18} /> About
            </button>
            <button onClick={handleLogout} className="ent-btn ent-btn-danger">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </nav>
      )}

      {/* Page content — conditional rendering */}
      <main className="tab-content-area" style={user && user.role === 'user' ? { paddingTop: 0 } : {}}>

        {activeTab === 'home'        && <Home setActiveTab={setActiveTab} />}
        {activeTab === 'features'    && <Features />}
        {activeTab === 'solution'    && <Solution />}
        {activeTab === 'model'       && <AIModel />}
        {activeTab === 'about'       && <About />}
        {activeTab === 'contact'     && <GetInTouch />}
        {activeTab === 'login'       && (
          <Login onAuthSuccess={(role) => { setActiveTab(role === 'admin' ? 'admin' : 'dashboard'); window.scrollTo(0, 0); }} />
        )}
        {activeTab === 'dashboard'   && (
          <ProtectedRoute user={user} requiredRole="user" fallbackAction={setActiveTab}>
            <UserDashboard onNavigate={(tab) => { setActiveTab(tab); window.scrollTo(0, 0); }} />
          </ProtectedRoute>
        )}
        {activeTab === 'disease-prediction' && (
          <ProtectedRoute user={user} requiredRole="user" fallbackAction={setActiveTab}>
            <DiseasePrediction onNavigate={(tab) => { setActiveTab(tab); window.scrollTo(0, 0); }} />
          </ProtectedRoute>
        )}
        {activeTab === 'prediction-result' && (
          <ProtectedRoute user={user} requiredRole="user" fallbackAction={setActiveTab}>
            <PredictionResult onNavigate={(tab) => { setActiveTab(tab); window.scrollTo(0, 0); }} />
          </ProtectedRoute>
        )}
        {activeTab === 'advisory-system' && (
          <ProtectedRoute user={user} requiredRole="user" fallbackAction={setActiveTab}>
            <AdvisorySystem onNavigate={(tab) => { setActiveTab(tab); window.scrollTo(0, 0); }} />
          </ProtectedRoute>
        )}
        {activeTab === 'animal-records' && (
          <ProtectedRoute user={user} requiredRole="user" fallbackAction={setActiveTab}>
            <AnimalRecords onNavigate={(tab) => { setActiveTab(tab); window.scrollTo(0, 0); }} />
          </ProtectedRoute>
        )}
        {activeTab === 'ai-reports'  && (
          <ProtectedRoute user={user} requiredRole="user" fallbackAction={setActiveTab}>
            <Alerts onNavigate={(tab) => { setActiveTab(tab); window.scrollTo(0, 0); }} />
          </ProtectedRoute>
        )}
        {activeTab === 'user-about'  && (
          <ProtectedRoute user={user} requiredRole="user" fallbackAction={setActiveTab}>
            <UserAbout onNavigate={(tab) => { setActiveTab(tab); window.scrollTo(0, 0); }} />
          </ProtectedRoute>
        )}
        {activeTab === 'admin'       && (
          <ProtectedRoute user={user} requiredRole="admin" fallbackAction={setActiveTab}>
            <AdminDashboard user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        )}

        {/* FINAL SAFETY — unknown tab → always show Home */}
        {!knownTabs.includes(activeTab) && <Home setActiveTab={setActiveTab} />}

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

      {/* Footer — public only */}
      {!user && <Footer />}
    </div>
  );
}

export default App;

