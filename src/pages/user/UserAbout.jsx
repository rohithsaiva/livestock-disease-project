import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BrainCircuit, ShieldCheck, TrendingUp, Database, BookOpen, Trophy } from 'lucide-react';
import './UserAbout.css';

const UserAbout = ({ onNavigate }) => {
  const algorithms = [
    { name: 'Logistic Regression', accuracy: '83.4%', width: '83', color: '#3b82f6', desc: 'Linear classifier for binary disease separation' },
    { name: 'Support Vector Machine', accuracy: '89.1%', width: '89', color: '#a855f7', desc: 'Optimal hyperplane for multiclass disease output' },
    { name: 'Random Forest', accuracy: '98.2%', width: '98', color: '#4ec850', desc: 'Ensemble of decision trees — highest performing model', champion: true },
    { name: 'Deep Neural Network', accuracy: '95.3%', width: '95', color: '#f59e0b', desc: 'Multi-layer perceptron trained on veterinary datasets' },
  ];

  const datasetFeatures = [
    { label: 'Temperature', category: 'Symptom' },
    { label: 'Appetite Level', category: 'Symptom' },
    { label: 'Lesion Presence', category: 'Symptom' },
    { label: 'Breathing Rate', category: 'Symptom' },
    { label: 'Milk Yield Drop', category: 'Symptom' },
    { label: 'Humidity', category: 'Environment' },
    { label: 'Ambient Temperature', category: 'Environment' },
    { label: 'Season', category: 'Environment' },
  ];

  const metrics = [
    { label: 'Accuracy', value: '98.2%' },
    { label: 'Precision', value: '97.5%' },
    { label: 'Recall', value: '96.8%' },
  ];

  return (
    <div className="ent-layout-container ent-animate-fade-in">
      <button onClick={() => onNavigate('dashboard')} className="ent-btn ent-btn-secondary" style={{ marginBottom: '32px' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      {/* Hero */}
      <div className="about-hero">
        <div className="ent-icon-container gradient-green">
          <BrainCircuit size={32} />
        </div>
        <h1 className="ent-hero-title">About Livestock<span className="ent-text-gradient">AI</span></h1>
        <p className="ent-hero-subtitle">
          A production-grade AI platform protecting livestock health through advanced machine learning and veterinary intelligence.
        </p>
      </div>

      {/* Overview cards */}
      <div className="ent-grid-3" style={{ marginBottom: '56px' }}>
        {[
          { icon: <ShieldCheck size={24} />, title: 'Early Detection', color: 'gradient-green', desc: 'Identify livestock diseases 3–5 days before clinical onset using environmental and physiological data.' },
          { icon: <BrainCircuit size={24} />, title: 'AI-Powered Engine', color: 'gradient-purple', desc: 'Four independent ML models run simultaneously, then combine into a weighted Ensemble Verdict.' },
          { icon: <TrendingUp size={24} />, title: 'Farm Productivity', color: 'gradient-blue', desc: 'Reduce livestock mortality and improve herd performance with proactive health management.' },
        ].map((card, i) => (
          <motion.div key={i} className="ent-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
            <div className={`ent-icon-container ${card.color}`}>{card.icon}</div>
            <h3 style={{ fontSize: '1.1rem' }}>{card.title}</h3>
            <p style={{ fontSize: '0.9rem' }}>{card.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* AI System Section */}
      <motion.div className="ent-card p-lg" style={{ marginBottom: '32px' }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <div className="about-section-header">
          <Database size={28} className="ent-icon-green" />
          <div>
            <h2 style={{ fontSize: '1.75rem', margin: 0 }}>AI Disease Prediction System</h2>
            <p style={{ margin: 0, marginTop: '4px' }}>Dataset features &amp; model performance metrics</p>
          </div>
        </div>

        <div className="ent-grid-2">
          {/* Dataset Features */}
          <div>
            <h4 className="about-subsection-label">Training Dataset Features</h4>
            <div className="dataset-list">
              {datasetFeatures.map((f, i) => (
                <div key={i} className="dataset-item">
                  <span>{f.label}</span>
                  <span className={`ent-badge ${f.category === 'Symptom' ? 'pending' : 'safe'}`}>{f.category}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Metrics */}
          <div>
            <h4 className="about-subsection-label">Model Performance (Random Forest)</h4>
            <div className="metrics-grid">
              {metrics.map((m, i) => (
                <div key={i} className="metric-card">
                  <div className="metric-value">{m.value}</div>
                  <div className="metric-label">{m.label}</div>
                </div>
              ))}
            </div>
            <div className="champion-callout">
              <Trophy size={16} />
              Random Forest achieved the highest accuracy of <strong>98.2%</strong> — selected as the primary prediction engine.
            </div>
          </div>
        </div>
      </motion.div>

      {/* Algorithms */}
      <motion.div className="ent-card p-lg" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <div className="about-section-header" style={{ marginBottom: '28px' }}>
          <BookOpen size={28} className="ent-icon-green" />
          <h2 style={{ fontSize: '1.75rem', margin: 0 }}>Algorithms Used</h2>
        </div>
        <div className="algo-list">
          {algorithms.map((algo, i) => (
            <motion.div key={i} className={`algo-row ${algo.champion ? 'algo-champion' : ''}`} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
              <div className="algo-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h4 style={{ margin: 0, color: algo.color }}>{algo.name}</h4>
                  {algo.champion && <span className="champion-badge"><Trophy size={11} /> Best Model</span>}
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem' }}>{algo.desc}</p>
              </div>
              <div className="algo-bar-section">
                <span className="algo-accuracy" style={{ color: algo.color }}>{algo.accuracy}</span>
                <div className="algo-bar-bg">
                  <div className="algo-bar-fill" style={{ width: `${algo.width}%`, background: algo.color, boxShadow: `0 0 8px ${algo.color}80` }}></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default UserAbout;
