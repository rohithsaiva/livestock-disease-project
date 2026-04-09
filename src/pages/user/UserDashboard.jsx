import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, FileText, ClipboardList, Activity, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { authService } from '../../services/auth';
import { interactionService } from '../../services/interactionService';
import { dateFormatter } from '../../utils/dateFormatter';
import './UserDashboard.css';

const UserDashboard = ({ onNavigate }) => {
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);

    const fetchInteractions = () => {
      const alerts = interactionService.getRecentAlerts(3);
      const formattedAlerts = alerts.map(p => ({
        id: p.id,
        animal: `${p.details.animalType} #${p.id.slice(-4).toUpperCase()}`,
        issue: 'Analysis Pending',
        timeAgo: dateFormatter.formatTimeAgo(p.date)
      }));
      setRecentAlerts(formattedAlerts);
    };
    fetchInteractions();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" }
    })
  };

  return (
    <div className="ent-layout-container ent-animate-fade-in">
      <div className="ent-hero-section">
        <motion.h1 
          className="ent-hero-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Livestock Intelligence <span className="ent-text-gradient">Hub</span>
        </motion.h1>
        <motion.p 
          className="ent-hero-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Welcome back, {currentUser?.name || 'Farmer'}. Monitor livestock vitals, predict health anomalies, and get AI-driven advisory across your farm.
        </motion.p>

        {/* Animated Stat Pills */}
        <motion.div 
          className="ent-stat-pills"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="ent-pill">
            <ShieldCheck size={16} className="ent-icon-green" /> System Healthy
          </div>
          <div className="ent-pill">
            <Activity size={16} className="ent-icon-blue" /> 3 AI Models Active
          </div>
          <div className="ent-pill">
            <AlertCircle size={16} className={recentAlerts.length > 0 ? 'ent-icon-warn' : 'ent-icon-gray'} /> {recentAlerts.length} Alerts
          </div>
        </motion.div>
      </div>

      <div className="ent-dashboard-grid">
        <div className="ent-tools-section">
          <h2 className="ent-section-title">Health Management Tools</h2>
          <div className="ent-grid-3">
            
            <motion.div
              className="ent-card ent-card-clickable"
              custom={0} initial="hidden" animate="visible" variants={cardVariants}
              onClick={() => onNavigate('disease-prediction')}
            >
              <div className="ent-icon-container gradient-purple">
                <BrainCircuit size={28} />
              </div>
              <h3>Disease Prediction</h3>
              <p>Analyze livestock symptoms and conditions to predict potential diseases using cutting-edge neural networks.</p>
              <div className="ent-card-action">
                Run Diagnostics <ArrowRight size={16} />
              </div>
            </motion.div>

            <motion.div
              className="ent-card ent-card-clickable"
              custom={1} initial="hidden" animate="visible" variants={cardVariants}
              onClick={() => onNavigate('advisory-system')}
            >
              <div className="ent-icon-container gradient-blue">
                <FileText size={28} />
              </div>
              <h3>AI Advisory</h3>
              <p>Get data-driven expert recommendations and precision livestock health guidance from our AI vet bank.</p>
              <div className="ent-card-action">
                View Guidelines <ArrowRight size={16} />
              </div>
            </motion.div>

            <motion.div
              className="ent-card ent-card-clickable"
              custom={2} initial="hidden" animate="visible" variants={cardVariants}
              onClick={() => onNavigate('animal-records')}
            >
              <div className="ent-icon-container gradient-green">
                <ClipboardList size={28} />
              </div>
              <h3>Animal Records</h3>
              <p>Securely store and track historical livestock health and vaccination data in organized, encrypted logs.</p>
              <div className="ent-card-action">
                Manage Logs <ArrowRight size={16} />
              </div>
            </motion.div>

          </div>
        </div>

        <div className="ent-alerts-section">
            <h2 className="ent-section-title">Recent Alerts</h2>
            <motion.div
              className="ent-card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="ent-alerts-list">
                {recentAlerts.length === 0 ? (
                  <div className="ent-empty-state">
                    <ShieldCheck size={32} />
                    <p>No active health alerts detected across your herd.</p>
                  </div>
                ) : (
                  recentAlerts.map((alert, idx) => (
                    <motion.div
                      key={alert.id}
                      className="ent-alert-item"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + (idx * 0.1) }}
                    >
                      <div className="ent-alert-content">
                        <h4>{alert.animal}</h4>
                        <span className="ent-alert-time">{alert.timeAgo}</span>
                      </div>
                      <div className="ent-badge pending">{alert.issue}</div>
                    </motion.div>
                  ))
                )}
              </div>
              {recentAlerts.length > 0 && (
                <button
                  className="ent-btn ent-btn-secondary w-full"
                  style={{ marginTop: '24px' }}
                  onClick={() => onNavigate('ai-reports')}
                >
                  View All Alerts
                </button>
              )}
            </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
