import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowRight, User, Phone, KeyRound, Activity, BrainCircuit, Heart } from 'lucide-react';
import './Login.css';
import { authService } from '../../services/auth';

const Login = ({ onAuthSuccess }) => {
  const [view, setView] = useState('login'); // 'login', 'signup', 'otp'
  const [error, setError] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [recoveredPassword, setRecoveredPassword] = useState('');

  // Explicitly clear state on component mount
  React.useEffect(() => {
    setEmail('');
    setPassword('');
    setError('');
  }, [view]);

  const validateSignup = () => {
    if (!email.endsWith('@gmail.com')) {
      setError('Email must be a @gmail.com address.');
      return false;
    }
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      setError('Phone number must be exactly 10 digits.');
      return false;
    }
    setError('');
    return true;
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const result = authService.login(email, password);

    if (result.success) {
      setError('');
      if (onAuthSuccess) {
        onAuthSuccess(result.user.role);
      }
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (validateSignup()) {
      const result = authService.register({ name, email, phone, password });
      if (result.success) {
        setError('');
        setView('login');
      } else {
        setError(result.error);
      }
    }
  };

  const handlePhoneVerificationSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('livestock_users') || '[]');
    const user = users.find(u => u.phone === phone && u.email === email);

    if (user) {
      setError('');
      setRecoveredPassword(user.password);
      setView('forgot-show');
    } else {
      setError('User information could not be verified.');
    }
  };

  return (
    <section className="login-section bg-gradient">

      {/* 3D Animated Floating Background Elements */}
      <div className="floating-background-elements">
        <motion.div className="floating-item float-icon-1" animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}>
          <Activity size={48} className="float-svg" />
        </motion.div>
        <motion.div className="floating-item float-icon-2" animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 1 }}>
          <span role="img" aria-label="Cow" className="float-emoji">🐄</span>
        </motion.div>
        <motion.div className="floating-item float-icon-3" animate={{ y: [0, -15, 0], x: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 2 }}>
          <Heart fill="rgba(231, 76, 60, 0.4)" stroke="none" size={60} className="float-svg heart-svg" />
        </motion.div>
        <motion.div className="floating-item float-icon-4" animate={{ y: [0, 25, 0], rotate: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 9, ease: "easeInOut", delay: 0.5 }}>
          <span role="img" aria-label="Sheep" className="float-emoji">🐑</span>
        </motion.div>
        <motion.div className="floating-item float-icon-5" animate={{ y: [0, -25, 0], x: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 8.5, ease: "easeInOut", delay: 1.5 }}>
          <BrainCircuit size={55} className="float-svg" />
        </motion.div>
        {/* Slow rotating health sphere */}
        <motion.div className="floating-item float-sphere" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 25, ease: "linear" }}>
          <div className="sphere-inner"></div>
        </motion.div>
      </div>

      <div className="container login-container">
        <AnimatePresence mode="wait">
          {view === 'login' && (
            <motion.div
              key="login"
              className="login-card glass-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="login-header">
                <div className="login-icon-wrapper">
                  <LogIn size={32} className="login-icon" />
                </div>
                <h2>Welcome Back</h2>
                <p>Access your LivestockAI dashboard</p>
              </div>

              {error && <div className="error-message">{error}</div>}

              <form onSubmit={handleLoginSubmit} className="auth-form" autoComplete="off">
                <div className="input-group">
                  <label htmlFor="login-email">Email Address</label>
                  <div className="input-wrapper">
                    <Mail size={18} className="input-icon" />
                    <input
                      type="email"
                      id="login-email"
                      placeholder="farmer@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="new-password"
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="login-password">Password</label>
                  <div className="input-wrapper">
                    <Lock size={18} className="input-icon" />
                    <input
                      type="password"
                      id="login-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      required
                    />
                  </div>
                </div>

                <div className="form-options">
                  <label className="remember-me">
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>
                  <a href="#" className="forgot-password" onClick={(e) => { e.preventDefault(); setView('forgot-phone'); }}>Forgot Password?</a>
                </div>

                <button type="submit" className="btn btn-primary auth-btn">
                  Login to Dashboard <ArrowRight size={18} />
                </button>
                
                <div className="ent-divider">
                  <span>or</span>
                </div>

                <button 
                  type="button" 
                  className="btn btn-outline auth-btn ent-google-btn"
                  onClick={() => {
                    const res = authService.googleSignIn('farmer_demo@gmail.com', 'Demo Farmer');
                    if (res.success && onAuthSuccess) {
                      onAuthSuccess(res.user.role);
                    }
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z" fill="#4285F4"/>
                    <path d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7253 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853"/>
                    <path d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3633 11.0051 19.3826V13.2007H3.03296C-0.371021 20.0112 -0.371021 28.0079 3.03296 34.7825L11.0051 28.6006Z" fill="#FBBC05"/>
                    <path d="M24.48 9.49932C27.9016 9.44461 31.2086 10.7339 33.6866 13.0973L40.5387 6.24515C36.2058 2.18688 30.4226 -0.0695503 24.48 0.00161733C15.4056 0.00161733 7.10718 5.11644 3.03296 13.2007L11.0051 19.3826C12.91 13.7296 18.2275 9.49932 24.48 9.49932Z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>
              </form>

              <div className="auth-footer">
                <p>Don't have an account? <button className="text-btn" onClick={() => { setView('signup'); setError(''); }}>Sign Up</button></p>
              </div>
            </motion.div>
          )}

          {view === 'signup' && (
            <motion.div
              key="signup"
              className="login-card glass-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="login-header">
                <div className="login-icon-wrapper">
                  <User size={32} className="login-icon" />
                </div>
                <h2>Create Account</h2>
                <p>Register for LivestockAI</p>
              </div>

              {error && <div className="error-message">{error}</div>}

              <form onSubmit={handleSignupSubmit} className="auth-form" autoComplete="off">
                <div className="input-group">
                  <label htmlFor="signup-name">Full Name</label>
                  <div className="input-wrapper">
                    <User size={18} className="input-icon" />
                    <input
                      type="text"
                      id="signup-name"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="new-password"
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="signup-email">Email Address (@gmail.com)</label>
                  <div className="input-wrapper">
                    <Mail size={18} className="input-icon" />
                    <input
                      type="email"
                      id="signup-email"
                      placeholder="farmer@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="new-password"
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="signup-phone">Phone Number (10 digits)</label>
                  <div className="input-wrapper">
                    <Phone size={18} className="input-icon" />
                    <input
                      type="tel"
                      id="signup-phone"
                      placeholder="1234567890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      autoComplete="new-password"
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="signup-password">Create Password</label>
                  <div className="input-wrapper">
                    <Lock size={18} className="input-icon" />
                    <input
                      type="password"
                      id="signup-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary auth-btn">
                  Register to Dashboard <ArrowRight size={18} />
                </button>
              </form>

              <div className="auth-footer">
                <p>Already have an account? <button className="text-btn" onClick={() => { setView('login'); setError(''); }}>Log in</button></p>
              </div>
            </motion.div>
          )}

          {view === 'forgot-phone' && (
            <motion.div
              key="forgot-phone"
              className="login-card glass-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="login-header">
                <div className="login-icon-wrapper">
                  <KeyRound size={32} className="login-icon" />
                </div>
                <h2>Password Recovery</h2>
                <p>Step 1 — Identity Verification</p>
              </div>

              {error && <div className="error-message">{error}</div>}

              <form onSubmit={handlePhoneVerificationSubmit} className="auth-form" autoComplete="off">
                <div className="input-group">
                  <label htmlFor="recovery-email">Enter your registered email</label>
                  <div className="input-wrapper">
                    <Mail size={18} className="input-icon" />
                    <input
                      type="email"
                      id="recovery-email"
                      placeholder="e.g. farmer@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="recovery-phone">Enter your registered phone number</label>
                  <div className="input-wrapper">
                    <Phone size={18} className="input-icon" />
                    <input
                      type="tel"
                      id="recovery-phone"
                      placeholder="e.g. 1234567890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" className="btn btn-secondary auth-btn" style={{ flex: 1 }} onClick={() => setView('login')}>
                    Back
                  </button>
                  <button type="submit" className="btn btn-primary auth-btn" style={{ flex: 1 }}>
                    Verify <ArrowRight size={18} />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {view === 'forgot-show' && (
            <motion.div
              key="forgot-show"
              className="login-card glass-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="login-header">
                <div className="login-icon-wrapper">
                  <KeyRound size={32} className="login-icon" />
                </div>
                <h2>Password Recovery</h2>
                <p style={{ color: 'var(--color-soft-green)', fontWeight: 500 }}>Your identity has been successfully verified.</p>
              </div>

              <div className="auth-form">
                <div className="input-group">
                  <label>Your Password:</label>
                  <div className="input-wrapper" style={{ background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center' }}>
                    <Lock size={18} className="input-icon" style={{ color: 'var(--color-light)' }} />
                    <input
                      type="text"
                      value={recoveredPassword}
                      readOnly
                      style={{ background: 'transparent', boxShadow: 'none', border: 'none', fontSize: '1.2rem', letterSpacing: '2px', fontWeight: 'bold' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                  <button type="button" className="btn btn-secondary auth-btn" style={{ flex: 1 }} onClick={() => { setView('forgot-phone'); setPhone(''); }}>
                    Back
                  </button>
                  <button type="button" className="btn btn-primary auth-btn" style={{ flex: 1 }} onClick={() => setView('login')}>
                    Login <LogIn size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </section>
  );
};

export default Login;
