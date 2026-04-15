import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';

export default function Login() {
  const navigate = useNavigate();
  const [view, setView] = useState('login'); // 'login' | 'signup' | 'otp'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');

  const handleError = (err) => {
    console.error(err);
    if (err.code === 'auth/email-already-in-use') {
      setError('Account exists, login instead');
    } else if (err.code === 'auth/popup-closed-by-user') {
      // ignore
      setError('');
    } else {
      setError(err.message || 'Something went wrong');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!email || !password) throw new Error("Please fill in both email and password.");
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!name || !email || !password) throw new Error("Please fill in all fields.");
      
      // Attempt to register
      await createUserWithEmailAndPassword(auth, email, password);
      
      // Call send-otp API safely
      try {
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${apiUrl}/api/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        if (!res.ok) console.warn("Failed to send OTP via API, but continuing flow.");
      } catch (apiErr) {
        console.warn("API Error (send-otp):", apiErr);
      }
      
      setView('otp');
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!otp) throw new Error("Please enter the OTP.");
      
      // Call verify-otp API safely
      let isSuccess = true;
      try {
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${apiUrl}/api/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp })
        });
        if (!res.ok) {
          isSuccess = false;
          throw new Error("Invalid OTP");
        }
      } catch (apiErr) {
        console.warn("API Error (verify-otp):", apiErr);
        // Fallback for simple local test if APIs are down (or strict reject):
        if (apiErr.message === "Invalid OTP") throw apiErr;
        // If fetch fails entirely, we log it, but wait, the prompt says:
        // "if success -> navigate, if fail -> show error". Let's assume fetch failure means OTP verify failed unless we stub it.
        // I will throw if it wasn't ok, or if it failed to fetch.
        throw new Error("OTP verification failed. Please try again.");
      }
      
      if (isSuccess) {
        navigate('/dashboard');
      }
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>
          {view === 'login' && 'Welcome Back'}
          {view === 'signup' && 'Create Account'}
          {view === 'otp' && 'Verify Email'}
        </h2>
        
        {error && <div style={styles.error}>{error}</div>}

        {view === 'login' && (
          <form style={styles.form} onSubmit={handleLogin}>
            <input 
              style={styles.input} 
              type="email" 
              placeholder="Email address" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
            <input 
              style={styles.input} 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
            />
            <button disabled={loading} style={styles.button} type="submit">
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <div style={styles.toggleText}>
              Don't have an account?{' '}
              <span style={styles.link} onClick={() => { setView('signup'); setError(''); }}>Sign up</span>
            </div>
          </form>
        )}

        {view === 'signup' && (
          <form style={styles.form} onSubmit={handleSignup}>
            <input 
              style={styles.input} 
              type="text" 
              placeholder="Full Name" 
              value={name} 
              onChange={e => setName(e.target.value)} 
            />
            <input 
              style={styles.input} 
              type="email" 
              placeholder="Email address" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
            <input 
              style={styles.input} 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
            />
            <button disabled={loading} style={styles.button} type="submit">
              {loading ? 'Creating account...' : 'Register'}
            </button>
            <div style={styles.toggleText}>
              Already have an account?{' '}
              <span style={styles.link} onClick={() => { setView('login'); setError(''); }}>Login instead</span>
            </div>
          </form>
        )}

        {view === 'otp' && (
          <form style={styles.form} onSubmit={handleVerifyOtp}>
            <p style={styles.subtitle}>Enter the OTP sent to {email}</p>
            <input 
              style={styles.input} 
              type="text" 
              placeholder="Enter OTP" 
              value={otp} 
              onChange={e => setOtp(e.target.value)} 
            />
            <button disabled={loading} style={styles.button} type="submit">
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <div style={styles.toggleText}>
              Entered wrong email?{' '}
              <span style={styles.link} onClick={() => { setView('signup'); setError(''); }}>Go back</span>
            </div>
          </form>
        )}

        {view !== 'otp' && (
          <>
            <div style={styles.divider}>
              <span style={styles.dividerLine}></span>
              <span style={styles.dividerText}>OR</span>
              <span style={styles.dividerLine}></span>
            </div>
            
            <button disabled={loading} style={styles.googleButton} onClick={handleGoogleLogin} type="button">
              <svg style={styles.googleIcon} viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
    fontFamily: 'Inter, "DM Sans", sans-serif',
    padding: '20px',
    color: '#ffffff'
  },
  card: {
    backgroundColor: '#1e293b',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
    width: '100%',
    maxWidth: '350px',
    boxSizing: 'border-box'
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '24px',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: '14px',
    color: '#94a3b8',
    marginBottom: '20px',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #334155',
    backgroundColor: '#0f172a',
    color: '#ffffff',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  button: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  googleButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#ffffff',
    color: '#0f172a',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '16px',
    transition: 'background-color 0.2s',
  },
  googleIcon: {
    width: '20px',
    height: '20px'
  },
  error: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    color: '#ef4444',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
    textAlign: 'center'
  },
  toggleText: {
    marginTop: '16px',
    fontSize: '14px',
    textAlign: 'center',
    color: '#94a3b8'
  },
  link: {
    color: '#3b82f6',
    cursor: 'pointer',
    fontWeight: '500',
    textDecoration: 'none'
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '24px 0 8px',
    color: '#64748b',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  dividerLine: {
    flex: '1',
    height: '1px',
    backgroundColor: '#334155'
  },
  dividerText: {
    padding: '0 10px',
    fontWeight: '600'
  }
};
