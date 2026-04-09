import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowRight, User, Phone, KeyRound } from 'lucide-react';
import './Login.css';
import { authService } from '../services/auth';

const Login = ({ onAuthSuccess }) => {
  const [view, setView] = useState('login'); // 'login', 'signup', 'otp'
  const [error, setError] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

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
      setError(result.error);
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (validateSignup()) {
      const result = authService.register({ name, email, phone, password });
      if (result.success) {
        setError('');
        if (onAuthSuccess) {
          onAuthSuccess(result.user.role);
        }
      } else {
        setError(result.error);
      }
    }
  };

  return (
    <section className="login-section bg-gradient">
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

              <form onSubmit={handleLoginSubmit} className="auth-form">
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
                      required 
                    />
                  </div>
                </div>

                <div className="form-options">
                  <label className="remember-me">
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>
                  <a href="#" className="forgot-password">Forgot Password?</a>
                </div>

                <button type="submit" className="btn btn-primary auth-btn">
                  Login to Dashboard <ArrowRight size={18} />
                </button>
              </form>

              <div className="auth-footer">
                <p>Don't have an account? <button className="text-btn" onClick={() => { setView('signup'); setError(''); }}>Sign up</button></p>
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

              <form onSubmit={handleSignupSubmit} className="auth-form">
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


        </AnimatePresence>
      </div>
    </section>
  );
};

export default Login;
