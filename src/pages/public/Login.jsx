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
  const [resetToken, setResetToken] = useState('');

  // Security Simulation States (Phase 1)
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaValues, setCaptchaValues] = useState({ num1: 0, num2: 0 });
  const [captchaAnswer, setCaptchaAnswer] = useState('');

  const generateCaptcha = () => {
    setCaptchaValues({
      num1: Math.floor(Math.random() * 10) + 1,
      num2: Math.floor(Math.random() * 10) + 1
    });
    setCaptchaAnswer('');
  };

  // Explicitly clear state on component mount
  React.useEffect(() => {
    setEmail('');
    setPassword('');
    setError('');
  }, [view]);

  const validateSignup = () => {
    // Phase 2: Validate email format robustly
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    
    // Add simple password constraint
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
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

    if (showCaptcha) {
      if (parseInt(captchaAnswer) !== captchaValues.num1 + captchaValues.num2) {
        setError('Security Check: Incorrect math answer.');
        generateCaptcha();
        return;
      }
    }

    const result = authService.login(email, password);

    if (result.success) {
      setError('');
      setFailedAttempts(0);
      setShowCaptcha(false);
      setCaptchaAnswer('');
      if (onAuthSuccess) {
        onAuthSuccess(result.user.role);
      }
    } else {
      setError(result.error);
      if (result.locked) {
        setShowCaptcha(false);
      } else if (result.failedAttempts && result.failedAttempts >= 3) {
        if (!showCaptcha) generateCaptcha();
        setShowCaptcha(true);
      }
    }
  };

  const decodeJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (err) {
      console.error("JWT decode failed:", err);
      return null;
    }
  };

  React.useEffect(() => {
    if (!['login', 'signup', 'forgot-request'].includes(view)) return;

    const handleGoogleResponse = (response) => {
      try {
        const token = response.credential;
        // Decode JWT payload safely
        const payload = decodeJwt(token);
        if (!payload) {
          setError("Google login failed");
          return;
        }

        const sessionData = {
          user: payload.name,
          email: payload.email,
          token: token,
          expiry: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString()
        };

        // Store in sessionStorage
        sessionStorage.setItem('google_session', JSON.stringify(sessionData));

        // Use backend auth mapping
        const result = authService.googleLogin({
          name: payload.name,
          email: payload.email
        });

        if (result.success) {
          setError('');
          if (onAuthSuccess) {
            onAuthSuccess(result.user.role);
          }
        } else {
          setError('Google Login failed.');
        }
      } catch (err) {
        console.error('Error processing Google login:', err);
        setError('Error processing Google login.');
      }
    };

    const initializeGoogle = () => {
      if (!window.google?.accounts?.id) return;

      window.google.accounts.id.initialize({
        client_id: '503037661664-rpt8278k8bk4v9uitp55q1jg5nj47thd.apps.googleusercontent.com',
        callback: handleGoogleResponse
      });

      const btnContainer = document.getElementById('google-btn-container');
      if (btnContainer) {
        btnContainer.innerHTML = "";
        window.google.accounts.id.renderButton(
          btnContainer,
          { theme: 'outline', size: 'large', type: 'standard', text: 'continue_with', width: '100%', shape: 'rectangular' }
        );
      }
    };

    const loadGoogleScript = () => {
      if (window.google?.accounts?.id) {
        initializeGoogle();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      document.head.appendChild(script);
    };

    loadGoogleScript();

  }, [view, onAuthSuccess]);

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (validateSignup()) {
      const result = authService.register({ name, email, phone, password });
      if (result.success) {
        setError('');
        setView('login');
      } else {
        // Phase 2: Always generic fallback
        setError('Request processed. Please proceed to login.');
      }
    }
  };

  const handlePasswordResetRequest = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    
    authService.requestPasswordReset(email);
    setError('Request processed. If the email is registered, a reset token has been dispatched. (Check console for simulation).');
    setView('forgot-token');
  };

  const handlePasswordResetSubmit = (e) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    
    const result = authService.resetPassword(resetToken, password);
    if (result.success) {
      setError('');
      setView('login');
    } else {
      setError(result.error);
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
                  <a href="#" className="forgot-password" onClick={(e) => { e.preventDefault(); setView('forgot-request'); }}>Forgot Password?</a>
                </div>

                {/* Phase 1 Security: CAPTCHA */}
                {showCaptcha && (
                  <motion.div 
                    className="captcha-container input-group"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <label>Security Check: What is {captchaValues.num1} + {captchaValues.num2}?</label>
                    <div className="input-wrapper">
                      <Lock size={18} className="input-icon" style={{ color: 'var(--color-accent)' }} />
                      <input
                        type="number"
                        placeholder="Enter answer"
                        value={captchaAnswer}
                        onChange={(e) => setCaptchaAnswer(e.target.value)}
                        required
                        className="captcha-input"
                      />
                    </div>
                  </motion.div>
                )}

                <button type="submit" className="btn btn-primary auth-btn">
                  Login to Dashboard <ArrowRight size={18} />
                </button>
              </form>

              <div className="login-divider">
                <span>OR</span>
              </div>

              <div id="google-btn-container" className="google-btn-wrapper"></div>

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

              <div className="login-divider">
                <span>OR</span>
              </div>

              <div id="google-btn-container" className="google-btn-wrapper"></div>

              <div className="auth-footer">
                <p>Already have an account? <button className="text-btn" onClick={() => { setView('login'); setError(''); }}>Log in</button></p>
              </div>
            </motion.div>
          )}

          {view === 'forgot-request' && (
            <motion.div
              key="forgot-request"
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
                <p>Enter your email to request a reset link</p>
              </div>

              {error && <div className="error-message">{error}</div>}

              <form onSubmit={handlePasswordResetRequest} className="auth-form" autoComplete="off">
                <div className="input-group">
                  <label htmlFor="recovery-email">Email Address</label>
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

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" className="btn btn-secondary auth-btn" style={{ flex: 1 }} onClick={() => setView('login')}>
                    Back
                  </button>
                  <button type="submit" className="btn btn-primary auth-btn" style={{ flex: 1 }}>
                    Request Reset
                  </button>
                </div>
              </form>

              <div className="login-divider">
                <span>OR</span>
              </div>

              <div id="google-btn-container" className="google-btn-wrapper"></div>

            </motion.div>
          )}

          {view === 'forgot-token' && (
            <motion.div
              key="forgot-token"
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
                <h2>Verify Reset</h2>
                <p>Provide your reset token securely</p>
              </div>

              {error && <div className="error-message" style={{ background: 'rgba(255,152,0,0.1)', color: '#d84315', border: '1px dashed rgba(255,152,0,0.3)' }}>{error}</div>}

              <form onSubmit={handlePasswordResetSubmit} className="auth-form" autoComplete="off">
                <div className="input-group">
                  <label htmlFor="recovery-token">Reset Token (from console log)</label>
                  <div className="input-wrapper">
                    <KeyRound size={18} className="input-icon" />
                    <input
                      type="text"
                      id="recovery-token"
                      placeholder="Paste simulation token here"
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="new-password">New Password</label>
                  <div className="input-wrapper">
                    <Lock size={18} className="input-icon" />
                    <input
                      type="password"
                      id="new-password"
                      placeholder="Enter new 8+ char password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" className="btn btn-secondary auth-btn" style={{ flex: 1 }} onClick={() => { setView('forgot-request'); setResetToken(''); }}>
                    Back
                  </button>
                  <button type="submit" className="btn btn-primary auth-btn" style={{ flex: 1 }}>
                    Update <ArrowRight size={18} />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </section>
  );
};

export default Login;
