import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ClipboardList, Thermometer, Droplets, Syringe, Calendar } from 'lucide-react';
import { authService } from '../../services/auth';
import './AnimalRecords.css';

const AnimalRecords = ({ onNavigate }) => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const result = authService.getUserInteractions();
    if (result.success) {
      const predictionRecords = result.interactions.filter(i => i.type === 'disease_prediction');
      setRecords(predictionRecords);
    }
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

      <div className="ent-hero-section" style={{ marginBottom: '40px', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div className="ent-icon-container gradient-green" style={{ marginBottom: 0 }}>
            <ClipboardList size={28} />
          </div>
          <h1 className="ent-hero-title" style={{ fontSize: '2.5rem', marginBottom: 0 }}>Animal Records</h1>
        </div>
        <p className="ent-hero-subtitle" style={{ marginLeft: 0 }}>
          View comprehensive health histories, prediction logs, and symptom tracking for your entire herd.
        </p>
      </div>

      <div className="ent-grid-2">
        {records.length === 0 ? (
          <motion.div
            className="ent-card"
            style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '64px 24px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="ent-empty-state">
              <ClipboardList size={48} style={{ opacity: 0.5 }} />
              <h3 style={{ color: 'var(--text-secondary)' }}>No records formulated</h3>
              <p>You haven't submitted any diagnostics or health records yet.</p>
              <button 
                onClick={() => onNavigate('disease-prediction')} 
                className="ent-btn ent-btn-primary"
                style={{ marginTop: '16px' }}
              >
                Log New Diagnostic
              </button>
            </div>
          </motion.div>
        ) : (
          records.map((record, index) => {
            const details = record.details || {};
            const dateObj = new Date(record.date);

            return (
              <motion.div
                key={record.id}
                className="ent-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className="ent-record-header">
                  <h3>{details.animalType} Profile</h3>
                  <span className="ent-badge tag-animal">{details.animalType}</span>
                </div>

                <div className="ent-record-grid">
                  <div className="ent-record-item">
                    <Calendar size={18} className="ent-icon-warn" />
                    <div className="ent-record-meta">
                      <span>Age</span>
                      <strong>{details.age} yrs</strong>
                    </div>
                  </div>

                  <div className="ent-record-item">
                    <Thermometer size={18} className="ent-icon-danger" style={{ color: '#ef4444' }} />
                    <div className="ent-record-meta">
                      <span>Temp</span>
                      <strong>{details.temperature}°C</strong>
                    </div>
                  </div>

                  <div className="ent-record-item">
                    <Droplets size={18} className="ent-icon-blue" />
                    <div className="ent-record-meta">
                      <span>Humidity</span>
                      <strong>{details.humidity}%</strong>
                    </div>
                  </div>

                  <div className="ent-record-item">
                    <Syringe size={18} className="ent-icon-purple" style={{ color: '#a855f7' }} />
                    <div className="ent-record-meta">
                      <span>Vaccination</span>
                      <strong>{details.vaccination}</strong>
                    </div>
                  </div>
                </div>

                <div className="ent-record-symptoms">
                  <h4>Observed Symptoms</h4>
                  <div className="symptom-tags">
                    <span className={`symptom-tag ${details.fever === 'Yes' ? 'active' : ''}`}>
                      Fever: {details.fever}
                    </span>
                    <span className={`symptom-tag ${details.appetiteLoss === 'Yes' ? 'active' : ''}`}>
                      Appetite Loss: {details.appetiteLoss}
                    </span>
                    <span className={`symptom-tag ${details.weakness === 'Yes' ? 'active' : ''}`}>
                      Weakness: {details.weakness}
                    </span>
                  </div>
                </div>

                <div className="ent-record-footer">
                  Logged: {dateObj.toLocaleDateString()} at {dateObj.toLocaleTimeString()}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AnimalRecords;
