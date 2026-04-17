import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowRight, User, KeyRound, Activity, BrainCircuit, Heart } from 'lucide-react';
import './Login.css';
import { authService } from '../../services/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updatePassword, fetchSignInMethodsForEmail } from "firebase/auth";
import { auth } from '../../config/firebase';

// ── Admin Override Credentials ──────────────────────────────────────────
const ADMIN_EMAIL    = "rohithsaiva8@gmail.com";
const ADMIN_PASSWORD = "12345678";
// ─────────────────────────────────────────────────────────────────────────

const Login = ({ onAuthSuccess }) => {
  const [view, setView] = useState('login'); // 'login', 'signup', 'otp'
  const [error, setError] = useState('');

  console.log("Current View:", view);

  useEffect(() => {
    const otpEmail = localStorage.getItem("otpEmail");

    if (otpEmail) {
      setEmail(otpEmail);
      setView("otp");
    }
  }, []);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [name, setName] = useState('');
  const [resetToken, setResetToken] = useState('');

  // OTP States
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isSendingOTP, setIsSendingOTP] = useState(false);

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

  // State-clearing on view change deliberately removed to prevent data loss during transitions

  // handleSendOTP functionally deprecated as Login routing natively omits it

  const handleVerifyOTP = async (e) => {
    if (e) e.preventDefault();

    try {
      const email = localStorage.getItem("otpEmail");

      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, otp })
      });

      const data = await res.json();

      if (data.success) {
        const purpose = localStorage.getItem("otpPurpose");
        if (purpose === "reset") {
          setView("resetPassword");
          return;
        }

        localStorage.removeItem("otpEmail");
        alert("Verified successfully");

        // LOGIN USER AFTER VERIFY
        await signInWithEmailAndPassword(auth, email, password);

        window.location.href = "/";

      } else {
        alert("Invalid OTP");
      }

    } catch (err) {
      console.error(err);
      alert("Verification failed");
    }
  };

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

    setError('');
    return true;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (showCaptcha) {
      if (parseInt(captchaAnswer) !== captchaValues.num1 + captchaValues.num2) {
        setError('Incorrect captcha combination.');
        generateCaptcha();
        return;
      }
    }

    // ── ADMIN OVERRIDE (no Firebase dependency) ───────────────────────────
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      console.log("Admin login detected — bypassing Firebase");
      localStorage.setItem("isAdmin", "true");
      if (onAuthSuccess) onAuthSuccess('admin');
      return;
    }
    // ─────────────────────────────────────────────────────────────────────

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError('');
      setFailedAttempts(0);
      setShowCaptcha(false);
      setCaptchaAnswer('');
      if (onAuthSuccess) {
        onAuthSuccess('user');
      }
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setError("User not found");
      } else if (error.code === "auth/wrong-password") {
        setError("Incorrect password");
      } else {
        setError(error.message);
      }
      setFailedAttempts(prev => prev + 1);
      if (failedAttempts >= 2 && !showCaptcha) {
        generateCaptcha();
        setShowCaptcha(true);
      }
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google login success:", result.user);
      // Force full reload so onAuthStateChanged picks up the session and sets dashboard tab
      window.location.href = "/";
    } catch (error) {
      console.error("Google login failed:", error);
      alert(error.message);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (validateSignup()) {
      try {
        // 🔥 SET SHIELD EARLY BEFORE FIREBASE AUTO-LOGINS
        localStorage.setItem("otpEmail", email);

        await createUserWithEmailAndPassword(auth, email, password);

        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/send-otp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email })
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "OTP failed");
        }

        setView("otp"); // 🔥 THIS ENSURES OTP PAGE SHOWS

      } catch (err) {
        // If anything fails (like backend down), remove the shield and log them out
        localStorage.removeItem("otpEmail");
        auth.signOut();
        alert(err.message);
      }
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!data.success) throw new Error("Failed to send OTP");

      localStorage.setItem("otpEmail", email);
      localStorage.setItem("otpPurpose", "reset");

      setView("otp");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const resetEmail = localStorage.getItem("otpEmail");

      // 1. LOGIN WITH OLD PASSWORD TEMPORARILY
      const userCred = await signInWithEmailAndPassword(auth, resetEmail, password);

      // 2. UPDATE PASSWORD
      await updatePassword(userCred.user, newPassword);

      // 3. CLEAN STORAGE
      localStorage.removeItem("otpEmail");
      localStorage.removeItem("otpPurpose");

      alert("Password updated successfully");

      // 4. REDIRECT
      window.location.href = "/";
    } catch (err) {
      console.error("Reset error:", err);
      alert("Failed to reset password");
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
                <h2>Dashboard Login</h2>
                <p>Welcome back securely</p>
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
                      autoComplete="username"
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
                      autoComplete="current-password"
                      required
                    />
                  </div>
                </div>

                <div className="form-options">
                  <label className="remember-me">
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>
                  <a href="#" className="forgot-password" onClick={(e) => { e.preventDefault(); setView('forgot'); }}>Forgot Password?</a>
                </div>

                <button type="submit" className="btn btn-primary auth-btn">
                  Login to Dashboard <ArrowRight size={18} />
                </button>
              </form>

              <div className="login-divider">
                <span>OR</span>
              </div>

              <div className="google-btn-wrapper">
                <button type="button" className="btn btn-secondary auth-btn" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} onClick={handleGoogleLogin}>
                  <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" style={{ width: '20px', height: '20px' }} />
                  Continue with Google
                </button>
              </div>

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
                  OTP Verification <ArrowRight size={18} />
                </button>
              </form>

              <div className="login-divider">
                <span>OR</span>
              </div>

              <div className="google-btn-wrapper">
                <button type="button" className="btn btn-secondary auth-btn" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} onClick={handleGoogleLogin}>
                  <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" style={{ width: '20px', height: '20px' }} />
                  Continue with Google
                </button>
              </div>

              <div className="auth-footer">
                <p>Already have an account? <button className="text-btn" onClick={() => { setView('login'); setError(''); }}>Log in</button></p>
              </div>
            </motion.div>
          )}

          {view === 'otp' && (
            <motion.div
              key="otp"
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
                <h2>Verify Email</h2>
                <p>Enter the 6-digit code sent to your email</p>
              </div>

              {error && <div className="error-message">{error}</div>}

              <form onSubmit={handleVerifyOTP} className="auth-form" autoComplete="off">
                 <div className="input-group">
                    <label htmlFor="verify-otp">One-Time Password (OTP)</label>
                    <div className="input-wrapper">
                      <KeyRound size={18} className="input-icon" />
                      <input
                        type="text"
                        id="verify-otp"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        autoComplete="one-time-code"
                        required
                      />
                    </div>
                  </div>
                <button type="submit" className="btn btn-primary auth-btn">
                  Verify & Access Dashboard <ArrowRight size={18} />
                </button>
              </form>
            </motion.div>
          )}

          {view === 'forgot' && (
            <motion.div
              key="forgot"
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
                <p>Enter your email to receive an OTP code</p>
              </div>

              {error && <div className="error-message">{error}</div>}

              <form onSubmit={handleForgotPassword} className="auth-form" autoComplete="off">
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
                    Send OTP
                  </button>
                </div>
              </form>

              <div className="auth-footer" style={{ marginTop: '24px' }}>
                <p>Not registered? <button className="text-btn" onClick={() => { setView('signup'); setError(''); }}>Sign Up</button></p>
              </div>
            </motion.div>
          )}

          {view === 'resetPassword' && (
            <motion.div
              key="resetPassword"
              className="login-card glass-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="login-header">
                <div className="login-icon-wrapper">
                  <Lock size={32} className="login-icon" />
                </div>
                <h2>Reset Password</h2>
                <p>Enter your new password below</p>
              </div>

              {error && <div className="error-message">{error}</div>}

              <form onSubmit={handleResetPassword} className="auth-form" autoComplete="off">
                <div className="input-group" style={{ marginBottom: '16px' }}>
                  <label htmlFor="old-password">Old Password (Authorization)</label>
                  <div className="input-wrapper">
                    <Lock size={18} className="input-icon" />
                    <input
                      type="password"
                      id="old-password"
                      placeholder="Current Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary auth-btn" style={{ marginTop: '1rem' }}>
                  Update Password and Login to Dashboard <ArrowRight size={18} />
                </button>
              </form>
            </motion.div>
          )}



        </AnimatePresence>
      </div>
    </section>
  );
};

export default Login;
