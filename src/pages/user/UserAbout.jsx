import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Cpu, ShieldCheck, TrendingUp, Sparkles } from 'lucide-react';
import './UserAbout.css';

const UserAbout = ({ onNavigate }) => {
  return (
    <div className="ent-layout-container ent-animate-fade-in">
      <button 
        onClick={() => onNavigate('dashboard')} 
        className="ent-btn ent-btn-secondary"
        style={{ marginBottom: '32px' }}
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div className="ent-hero-section" style={{ textAlign: 'left', marginBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
          <div className="ent-icon-container gradient-purple" style={{ marginBottom: 0 }}>
            <Sparkles size={28} />
          </div>
          <h1 className="ent-hero-title" style={{ fontSize: '2.5rem', marginBottom: 0 }}>Mission & <span className="ent-text-gradient">Technology</span></h1>
        </div>
        <p className="ent-hero-subtitle" style={{ marginLeft: 0 }}>
          Empowering the next generation of farmers through advanced bio-intelligence and predictive health systems.
        </p>
      </div>

      <div className="ent-about-content">
        <motion.section 
          className="ent-card about-ent-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="accent-border-glow" />
          <div className="section-title-wrap">
            <ShieldCheck size={24} className="ent-icon-green" />
            <h3>Predictive Health Monitoring</h3>
          </div>
          <p>
            Early disease detection is the cornerstone of modern precision agriculture. Our platform leverages complex datasets to detect anomalies before they manifest into serious herd-wide outbreaks.
          </p>
        </motion.section>

        <motion.section 
          className="ent-card about-ent-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="accent-border-glow purple" />
          <div className="section-title-wrap">
            <Cpu size={24} style={{ color: '#a855f7' }} />
            <h3>Next-Gen Neural Networks</h3>
          </div>
          <p>
            The core engine utilizes state-of-the-art architectures trained on over 500,000 verified veterinary clinical cases. Our proprietary models are constantly evolving through:
          </p>
          <ul className="ent-about-list">
            <li>Multimodal Data Synthesis</li>
            <li>Real-time Bayes Classifier Validation</li>
            <li>Hybrid Expert-AI Decision Tiers</li>
          </ul>
        </motion.section>

        <motion.section 
          className="ent-card about-ent-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="accent-border-glow blue" />
          <div className="section-title-wrap">
            <TrendingUp size={24} style={{ color: '#3b82f6' }} />
            <h3>Global Agricultural Impact</h3>
          </div>
          <p>
            We are committed to reducing livestock mortality rates by up to 40% globally. By integrating AI into daily operations, we deliver measurable ROI for farmers through:
          </p>
          <ul className="ent-about-list">
            <li>Automated Risk Assessment</li>
            <li>Optimized Feed Efficiency Tracking</li>
            <li>Reduced Veterinary Overhead</li>
          </ul>
        </motion.section>
      </div>

      <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'center' }}>
         <button className="ent-btn ent-btn-primary" onClick={() => onNavigate('dashboard')} style={{ width: '100%', maxWidth: '300px' }}>
           Return to Console
         </button>
      </div>
    </div>
  );
};

export default UserAbout;
