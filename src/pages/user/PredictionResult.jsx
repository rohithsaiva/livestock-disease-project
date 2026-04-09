import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import './PredictionResult.css';

const PredictionResult = ({ onNavigate }) => {
  return (
    <div className="ent-layout-container ent-animate-fade-in" style={{ maxWidth: '800px' }}>
      <button
        onClick={() => onNavigate('dashboard')}
        className="ent-btn ent-btn-secondary"
        style={{ marginBottom: '32px' }}
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <motion.div 
        className="ent-card p-lg text-center"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="ent-icon-container gradient-blue" style={{ margin: '0 auto 24px auto', width: '80px', height: '80px' }}>
           <Loader2 size={40} className="ent-spinner" style={{ animation: 'spin 2s linear infinite' }} />
        </div>
        
        <h2 className="ent-hero-title" style={{ fontSize: '2.2rem', marginBottom: '16px' }}>
          Analysis in <span className="ent-text-gradient">Progress</span>
        </h2>
        
        <div className="ent-status-pills" style={{ justifyContent: 'center', marginBottom: '32px' }}>
          <div className="ent-pill">
            <Sparkles size={14} className="ent-icon-green" /> AI Engine v2.4
          </div>
          <div className="ent-pill">
            Neural Processing: Active
          </div>
        </div>

        <p className="ent-hero-subtitle" style={{ fontSize: '1.1rem', marginBottom: '40px', color: 'var(--text-secondary)' }}>
          The machine learning models are currently processing your animal's data. Our predictive analytics system combines historical veterinary records with real-time bio-data to provide a high-confidence diagnosis.
        </p>

        <div className="ent-info-box" style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '24px', borderRadius: '16px', textAlign: 'left', marginBottom: '40px' }}>
          <h4 style={{ color: '#3b82f6', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} /> Model Insight
          </h4>
          <p style={{ margin: 0, fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)' }}>
            We are currently fine-tuning the buffalo and goat prediction models. During this beta phase, results are automatically peer-reviewed by our secondary validation layer.
          </p>
        </div>

        <button 
          className="ent-btn ent-btn-primary"
          style={{ width: '100%', maxWidth: '350px' }}
          onClick={() => onNavigate('dashboard')}
        >
          Return to Console Console
        </button>
      </motion.div>
    </div>
  );
};

export default PredictionResult;
