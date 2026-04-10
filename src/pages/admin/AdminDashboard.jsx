import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Users, MessageSquare, Database, LogOut, Trash2, Shield } from 'lucide-react';
import { authService } from '../../services/auth';
import { loginHistoryStorage } from '../../data/loginHistory';
import './AdminDashboard.css';
import developerAvatar from '../../assets/developer_avatar.png';

import LoginHistory from './LoginHistory';
import SignedUsers from './SignedUsers';
import Comments from './Comments';
import ProjectData from './ProjectData';
import SecurityLogs from './SecurityLogs';
import { loggingService } from '../../services/loggingService';

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('login_users');
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);
  const [securityLogs, setSecurityLogs] = useState([]);

  const loadData = () => {
    const usersResult = authService.getAllUsers();
    const messagesResult = authService.getAllMessages();
    const interactionsResult = authService.getAllInteractions();
    const historyData = loginHistoryStorage.getHistory();
    const secLogs = loggingService.getLogs();

    if (usersResult.success) setUsers(usersResult.users.filter(u => u.role !== 'admin'));
    if (messagesResult.success) setMessages(messagesResult.messages);
    if (interactionsResult.success) setInteractions(interactionsResult.interactions);
    setLoginHistory(historyData.sort((a, b) => b.timestamp - a.timestamp));
    setSecurityLogs(secLogs);
  };

  useEffect(() => {
    loadData();
  }, []);

  const projectData = interactions.filter(i => i.type === 'disease_prediction');

  const handleDeleteInteraction = (id) => {
    if (window.confirm('Delete this record?')) {
      if (authService.deleteInteraction(id).success) loadData();
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'login_users':
        return <LoginHistory loginHistory={loginHistory} />;
      case 'signed_users':
        return <SignedUsers users={users} />;
      case 'comments':
        return <Comments messages={messages} />;
      case 'project_data':
        return <ProjectData projectData={projectData} />;
      case 'security_logs':
        return <SecurityLogs logs={securityLogs} />;
      default:
        return null;
    }
  };

  return (
    <div className="admin-layout-wrapper bg-gradient">
      <div className="admin-layout">
        {/* Left Navigation Sidebar */}
        <aside className="admin-sidebar glass-card">
          <div className="admin-profile">
            <div className="avatar-wrapper">
              <img src={developerAvatar} alt="Admin Avatar" className="admin-avatar" />
            </div>
            <h2 className="admin-name">Admin {user?.name || 'Rohith'}</h2>
            <span className="admin-badge">System Administrator</span>
          </div>

          <nav className="admin-nav">
            <button
              className={`admin-nav-item ${activeTab === 'login_users' ? 'active' : ''}`}
              onClick={() => setActiveTab('login_users')}
            >
              <LogIn size={20} /> Login Users
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'signed_users' ? 'active' : ''}`}
              onClick={() => setActiveTab('signed_users')}
            >
              <Users size={20} /> Signed Users
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'comments' ? 'active' : ''}`}
              onClick={() => setActiveTab('comments')}
            >
              <MessageSquare size={20} /> Comments
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'project_data' ? 'active' : ''}`}
              onClick={() => setActiveTab('project_data')}
            >
              <Database size={20} /> Project Data
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'security_logs' ? 'active' : ''}`}
              onClick={() => setActiveTab('security_logs')}
              style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '0.5rem', paddingTop: '1rem' }}
            >
              <Shield size={20} color="var(--color-primary)" /> Security Logs
            </button>
          </nav>

          <div className="admin-logout">
            <button className="btn btn-secondary logout-btn" onClick={onLogout}>
              <LogOut size={18} /> Logout
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="admin-main-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="admin-tab-content"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
