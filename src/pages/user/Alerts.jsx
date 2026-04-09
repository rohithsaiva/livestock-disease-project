/**
 * Health Alerts Page
 * Displays a comprehensive list of all AI-detected health warnings 
 * and critical notifications for the user's livestock.
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Search, Activity, Clock } from 'lucide-react';
import './Alerts.css';
import { authService } from '../../services/auth';

const Alerts = ({ onNavigate }) => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // Fetch user's disease prediction interactions
    const fetchInteractions = () => {
      const res = authService.getUserInteractions();
      if (res.success) {
        // Filter out disease prediction submissions
        const predictions = res.interactions.filter(i => i.type === 'disease_prediction');

        const formattedReports = predictions.map(p => {
          return {
            id: p.id,
            animalId: `${p.details.animalType} ${p.id.slice(-4).toUpperCase()}`,
            symptoms: [
              p.details.fever === 'Yes' ? 'Fever' : '',
              p.details.appetiteLoss === 'Yes' ? 'Appetite Loss' : '',
              p.details.weakness === 'Yes' ? 'Weakness' : ''
            ].filter(Boolean).join(', ') || 'None reported',
            model: 'Hybrid AI (future feature)', // Placeholder for future feature requirement
            status: 'Pending AI Analysis',
            date: new Date(p.date)
          };
        });

        setReports(formattedReports);
      }
    };

    fetchInteractions();
  }, []);

  return (
    <div className="reports-wrapper">
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 1rem' }}>
        <button
          onClick={() => onNavigate('dashboard')}
          className="btn btn-secondary back-btn-top"
          style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div className="reports-header text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="reports-icon-block"
          >
            <Bell size={40} className="text-accent" style={{ color: '#e74c3c' }} />
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            AI Prediction Reports
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="subtitle-text"
          >
            Review all prediction requests submitted for AI analysis.
          </motion.p>
        </div>

        <motion.div
          className="reports-list glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {reports.length === 0 ? (
            <div className="empty-reports text-center">
              <Search size={48} style={{ color: 'rgba(255,255,255,0.1)', marginBottom: '1rem' }} />
              <h3>No Reports Found</h3>
              <p>You haven't submitted any disease prediction requests yet.</p>
              <button
                className="btn btn-primary"
                style={{ marginTop: '1.5rem' }}
                onClick={() => onNavigate('disease-prediction')}
              >
                Start New Prediction
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="reports-table">
                <thead>
                  <tr>
                    <th>Animal ID</th>
                    <th>Symptoms Submitted</th>
                    <th>Prediction Model</th>
                    <th>Date Submitted</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report, index) => (
                    <motion.tr
                      key={report.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + (index * 0.1) }}
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                    >
                      <td><strong>{report.animalId}</strong></td>
                      <td className="symptoms-cell">{report.symptoms}</td>
                      <td>
                        <span className="model-badge">
                          <Activity size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                          {report.model}
                        </span>
                      </td>
                      <td>
                        <div className="date-cell">
                          <Clock size={14} className="date-icon" />
                          <span>{report.date.toLocaleDateString()}</span>
                          <span className="time-sub">{report.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </td>
                      <td>
                        <span className="status-badge pending">
                          <Activity size={14} className="spinner" style={{ display: 'inline', marginRight: '6px' }} />
                          {report.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
};

export default Alerts;
