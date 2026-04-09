import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, ArrowLeft, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { authService } from '../../services/auth';
import './PredictionResult.css';

const PredictionResult = ({ onNavigate }) => {
  const [latestResult, setLatestResult] = useState(null);

  useEffect(() => {
    const result = authService.getUserInteractions();
    if (result.success && result.interactions.length > 0) {
      // Get the most recent interaction
      const recent = result.interactions.filter(i => i.type === 'disease_prediction')[0];
      setLatestResult(recent);
    }
  }, []);

  if (!latestResult || !latestResult.details.analysis) {
    return (
      <div className="ent-layout-container ent-animate-fade-in" style={{ textAlign: 'center', paddingTop: '100px' }}>
        <Activity size={48} className="ent-spinner text-accent" />
        <h2 style={{ marginTop: '24px' }}>Loading Diagnostics...</h2>
      </div>
    );
  }

  const { analysis } = latestResult.details;
  const isHealthy = analysis.ensemble.prediction === 'Healthy';

  return (
    <div className="ent-layout-container ent-animate-fade-in">
      <button
        onClick={() => onNavigate('disease-prediction')}
        className="ent-btn ent-btn-secondary"
        style={{ marginBottom: '32px' }}
      >
        <ArrowLeft size={16} /> New Diagnostic
      </button>

      <div className="ent-hero-section" style={{ textAlign: 'left', marginBottom: '32px' }}>
        <h1 className="ent-hero-title" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Diagnostic Report</h1>
        <p className="ent-hero-subtitle" style={{ marginLeft: 0 }}>
          Comprehensive ML model analysis for {latestResult.details.animalType} #{latestResult.id.slice(-4).toUpperCase()}
        </p>
      </div>

      <motion.div
        className={`ent-ensemble-banner ${isHealthy ? 'healthy' : 'warning'}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="ensemble-header">
          {isHealthy ? <ShieldCheck size={32} /> : <AlertTriangle size={32} />}
          <div>
            <h2>Ensemble Verdict</h2>
            <p>Weighted synthesis favoring Random Forest architecture</p>
          </div>
        </div>
        <div className="ensemble-result">
          <div className="pred-name">{analysis.ensemble.prediction}</div>
          <div className="pred-conf">{analysis.ensemble.confidence}% Confidence</div>
        </div>
      </motion.div>

      <h3 className="ent-section-title" style={{ marginTop: '48px', fontSize: '1.25rem' }}>Individual Model Outputs</h3>
      
      <div className="ent-grid-2">
        {analysis.individual.map((model, idx) => (
          <motion.div
            key={model.model}
            className="ent-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + (idx * 0.1) }}
          >
            <div className="model-card-header">
              <h4>{model.model}</h4>
              <span className={`ent-badge ${model.prediction === 'Healthy' ? 'safe' : 'pending'}`}>
                {model.prediction}
              </span>
            </div>
            
            <div className="model-conf-bar-bg">
              <div 
                className={`model-conf-bar-fill ${model.prediction === 'Healthy' ? 'bg-green' : 'bg-warn'}`}
                style={{ width: `${model.confidence}%` }}
              ></div>
            </div>
            <div className="model-conf-text">{model.confidence}% Certainty</div>
          </motion.div>
        ))}
      </div>

      <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
        <button 
          className="ent-btn ent-btn-primary"
          onClick={() => onNavigate('advisory-system')}
        >
          View Restorative Advisory Guidelines
        </button>
      </div>
    </div>
  );
};

export default PredictionResult;
