import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Search, Activity, Clock, ShieldAlert } from 'lucide-react';
import './Alerts.css';
import { authService } from '../../services/auth';

const Alerts = ({ onNavigate }) => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchInteractions = () => {
      const res = authService.getUserInteractions();
      if (res.success) {
        const predictions = res.interactions.filter(i => i.type === 'disease_prediction');
        const formattedReports = predictions.map(p => ({
          id: p.id,
          animalId: `${p.details.animalType} #${p.id.slice(-4).toUpperCase()}`,
          symptoms: [
            p.details.fever === 'Yes' ? 'Fever' : '',
            p.details.appetiteLoss === 'Yes' ? 'Appetite Loss' : '',
            p.details.weakness === 'Yes' ? 'Weakness' : ''
          ].filter(Boolean),
          model: 'NeuralNet v2.1',
          status: 'Analyzing',
          date: new Date(p.date)
        }));
        setReports(formattedReports);
      }
    };
    fetchInteractions();
  }, []);

  return (
    <div className="ent-layout-container ent-animate-fade-in">
      <button
        onClick={() => onNavigate('dashboard')}
        className="ent-btn ent-btn-secondary"
        style={{ marginBottom: '32px' }}
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div className="ent-hero-section" style={{ textAlign: 'left', marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div className="ent-icon-container gradient-blue" style={{ marginBottom: 0 }}>
            <Bell size={28} />
          </div>
          <h1 className="ent-hero-title" style={{ fontSize: '2.5rem', marginBottom: 0 }}>Prediction Reports</h1>
        </div>
        <p className="ent-hero-subtitle" style={{ marginLeft: 0 }}>
          Comprehensive log of AI-driven health predictions and diagnostic interactions for your livestock herd.
        </p>
      </div>

      <motion.div
        className="ent-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {reports.length === 0 ? (
          <div className="ent-empty-state" style={{ padding: '64px 0' }}>
            <ShieldAlert size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
            <h3 style={{ color: 'var(--text-secondary)' }}>No Active Reports</h3>
            <p>Your prediction history is currently empty.</p>
            <button
              className="ent-btn ent-btn-primary"
              style={{ marginTop: '24px' }}
              onClick={() => onNavigate('disease-prediction')}
            >
              Start Diagnostic
            </button>
          </div>
        ) : (
          <div className="ent-table-container">
            <table>
              <thead>
                <tr>
                  <th>Subject ID</th>
                  <th>Clinical Observations</th>
                  <th>AI Engine</th>
                  <th>Timestamp</th>
                  <th>Process Status</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report, index) => (
                  <motion.tr
                    key={report.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <td><strong>{report.animalId}</strong></td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {report.symptoms.length > 0 ? report.symptoms.map((s, i) => (
                          <span key={i} className="ent-badge tag-symptom">{s}</span>
                        )) : <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No symptoms reported</span>}
                      </div>
                    </td>
                    <td>
                      <span className="ent-model-pill">
                        <Activity size={12} /> {report.model}
                      </span>
                    </td>
                    <td>
                      <div className="ent-timestamp">
                        <Clock size={12} />
                        <span>{report.date.toLocaleDateString()}</span>
                        <span className="ent-time-sub">{report.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>
                    <td>
                      <span className="ent-status-pill analyzing">
                        <div className="ent-dot-pulse"></div>
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
  );
};

export default Alerts;
