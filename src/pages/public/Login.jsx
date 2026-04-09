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
