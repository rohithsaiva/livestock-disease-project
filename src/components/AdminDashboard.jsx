import React, { useState, useEffect } from 'react';
import { Users, LogIn, Trash2, LogOut, Activity } from 'lucide-react';
import { authService } from '../services/auth';
import './AdminDashboard.css';
import { motion } from 'framer-motion';

const AdminDashboard = ({ user, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, recentLogins: 0 });

  const loadData = () => {
    const result = authService.getAllUsers();
    if (result.success) {
      setUsers(result.users);
      
      // Calculate basic stats
      const total = result.users.length;
      // Recent means in the last 24 hours
      const now = new Date();
      const recent = result.users.filter(u => {
        if (!u.lastLogin) return false;
        const lastLogin = new Date(u.lastLogin);
        const diffMs = now - lastLogin;
        return diffMs < 24 * 60 * 60 * 1000;
      }).length;

      setStats({ totalUsers: total, recentLogins: recent });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const result = authService.deleteUser(userId);
      if (result.success) {
        loadData();
      } else {
        alert(result.error || 'Failed to delete user');
      }
    }
  };

  return (
    <section className="admin-dashboard-section bg-gradient">
      <div className="container admin-container">
        
        {/* Sidebar Replacement for simpler tab layout integration */}
        <div className="admin-header glass-card">
          <div className="admin-title-area">
            <Activity className="admin-logo-icon" size={32} />
            <h2>Admin Control Panel</h2>
          </div>
          <div className="admin-actions">
            <p className="admin-user">Logged in as: <strong>{user?.name || 'Admin'}</strong></p>
            <button className="btn btn-primary logout-btn" onClick={onLogout}>
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="admin-stats-grid">
          <motion.div 
            className="stat-card glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="stat-icon-wrapper">
              <Users size={24} />
            </div>
            <div className="stat-info">
              <h3>Total Users</h3>
              <p className="stat-number">{stats.totalUsers}</p>
            </div>
          </motion.div>

          <motion.div 
            className="stat-card glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="stat-icon-wrapper">
              <LogIn size={24} />
            </div>
            <div className="stat-info">
              <h3>Recent Logins (24h)</h3>
              <p className="stat-number">{stats.recentLogins}</p>
            </div>
          </motion.div>
        </div>

        {/* User Table */}
        <motion.div 
          className="admin-table-container glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="table-header">
            <h3>Registered Users</h3>
          </div>
          
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">No users found.</td>
                  </tr>
                ) : (
                  users.map((userData) => (
                    <tr key={userData.id}>
                      <td>{userData.name}</td>
                      <td>{userData.email}</td>
                      <td>{userData.phone}</td>
                      <td>
                        <span className={`role-badge ${userData.role === 'admin' ? 'admin' : 'user'}`}>
                          {userData.role}
                        </span>
                      </td>
                      <td>
                        {userData.lastLogin 
                          ? new Date(userData.lastLogin).toLocaleString() 
                          : 'Never'}
                      </td>
                      <td>
                        {userData.role !== 'admin' && (
                          <button 
                            className="btn-icon delete-btn"
                            onClick={() => handleDelete(userData.id)}
                            title="Delete User"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default AdminDashboard;
