import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Database, LogOut } from 'lucide-react';
import { authService } from '../../services/auth';
import './AdminDashboard.css';
import developerAvatar from '../../assets/developer_avatar.png';

import SignedUsers from './SignedUsers';
import ProjectData from './ProjectData';

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('signed_users');
  const [users, setUsers] = useState([]);
  const [interactions, setInteractions] = useState([]);

  const loadData = () => {
    const usersResult = authService.getAllUsers();
    const interactionsResult = authService.getAllInteractions();
    if (usersResult.success) setUsers(usersResult.users.filter(u => u.role !== 'admin'));
    if (interactionsResult.success) setInteractions(interactionsResult.interactions);
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
      case 'signed_users':
        return <SignedUsers users={users} />;
      case 'project_data':
        return <ProjectData projectData={projectData} />;
      default:
        return <SignedUsers users={users} />;
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
              className={`admin-nav-item ${activeTab === 'signed_users' ? 'active' : ''}`}
              onClick={() => setActiveTab('signed_users')}
            >
              <Users size={20} /> User Data
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'project_data' ? 'active' : ''}`}
              onClick={() => setActiveTab('project_data')}
            >
              <Database size={20} /> Animal Records
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
