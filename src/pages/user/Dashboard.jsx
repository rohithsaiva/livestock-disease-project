import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';

export default function Dashboard({ user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Logout failed", error);
      alert("Failed to log out: " + error.message);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.logo}>LiveStock AI Hub</h1>
          <div style={styles.userSection}>
            <span style={styles.emailBadge}>
              {user?.email ? user.email : "Authenticated User"}
            </span>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Welcome to your Dashboard</h2>
          <p style={styles.cardText}>
            This is a securely protected area. You have successfully authenticated.
          </p>
          
          <div style={styles.grid}>
            <div style={styles.widget}>
              <h3>System Status</h3>
              <p>All services are operational.</p>
              <div style={styles.statusDot}></div>
            </div>
            <div style={styles.widget}>
              <h3>Recent Alerts</h3>
              <p>No new alerts for your flock.</p>
            </div>
            <div style={styles.widget}>
              <h3>Quick Actions</h3>
              <button style={styles.actionBtn}>New Scan</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    fontFamily: 'Inter, "DM Sans", sans-serif',
    color: '#333'
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e9ecef',
    padding: '16px 20px',
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#0f5132',
    margin: 0
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  emailBadge: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500'
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    color: '#dc3545',
    border: '1px solid #dc3545',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
  },
  cardTitle: {
    marginTop: 0,
    fontSize: '28px',
    color: '#1a1a1a',
    marginBottom: '8px'
  },
  cardText: {
    color: '#6c757d',
    marginBottom: '32px',
    fontSize: '16px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px'
  },
  widget: {
    backgroundColor: '#f8f9fa',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    padding: '24px',
    position: 'relative'
  },
  statusDot: {
    width: '12px',
    height: '12px',
    backgroundColor: '#198754',
    borderRadius: '50%',
    position: 'absolute',
    top: '24px',
    right: '24px'
  },
  actionBtn: {
    backgroundColor: '#0f5132',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '12px'
  }
};
