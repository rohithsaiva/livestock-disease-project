import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Stethoscope, Droplets, Home, AlertTriangle, MessageSquare, BrainCircuit } from 'lucide-react';
import { authService } from '../../services/auth';
import './AdvisorySystem.css';

const AdvisorySystem = ({ onNavigate }) => {
  useEffect(() => {
    authService.saveInteraction('advisory_usage', { page: 'Advisory System Main' });
  }, []);

  const handleVetContact = () => {
    authService.saveInteraction('vet_contact', { action: 'Clicked Contact Veterinary Doctor' });
    window.location.href = 'mailto:rohithsaiva8@gmail.com';
  };

  const guidelines = [
    {
      icon: <AlertTriangle size={24} />,
      title: 'Preventive Measures',
      color: 'gradient-purple',
      items: [
        'Maintain clean and dry living conditions',
        'Perform regular health monitoring and veterinary checkups',
        'Isolate animals showing early symptoms of illness',
        'Ensure adequate ventilation in shelters',
      ],
    },
    {
      icon: <Droplets size={24} />,
      title: 'Feeding & Nutrition',
      color: 'gradient-blue',
      items: [
        'Provide clean and fresh drinking water at all times',
        'Ensure balanced nutrition including vitamins and minerals',
        'Feed high-quality hay and grass regularly',
        'Monitor appetite and feeding patterns daily',
      ],
    },
    {
      icon: <Home size={24} />,
      title: 'Hygiene Standards',
      color: 'gradient-green',
      items: [
        'Clean animal shelters every morning',
        'Disinfect feeding equipment every 3 days',
        'Control pests, rodents, and insects regularly',
        'Maintain proper waste drainage and disposal',
      ],
    },
  ];

  return (
    <div className="ent-layout-container ent-animate-fade-in">
      <button onClick={() => onNavigate('dashboard')} className="ent-btn ent-btn-secondary" style={{ marginBottom: '32px' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div className="ent-hero-section" style={{ textAlign: 'left', marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
          <div className="ent-icon-container gradient-blue" style={{ marginBottom: 0 }}>
            <BrainCircuit size={28} />
          </div>
          <h1 className="ent-hero-title" style={{ fontSize: '2.5rem', marginBottom: 0 }}>AI Advisory System</h1>
        </div>
        <p className="ent-hero-subtitle" style={{ marginLeft: 0 }}>
          Science-backed care guidelines tailored for your livestock. Follow these recommendations to maintain superior herd health and prevent disease outbreaks.
        </p>
      </div>

      {/* Care Guidelines 3-column grid */}
      <div className="ent-grid-3" style={{ marginBottom: '40px' }}>
        {guidelines.map((g, i) => (
          <motion.div
            key={i}
            className="ent-card advisory-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className={`ent-icon-container ${g.color}`} style={{ marginBottom: '20px' }}>
              {g.icon}
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>{g.title}</h3>
            <ul className="advisory-list">
              {g.items.map((item, j) => (
                <li key={j} className="advisory-item">
                  <span className="advisory-dot" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Vet Contact Banner */}
      <motion.div
        className="ent-card vet-contact-panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{ marginBottom: '32px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="ent-icon-container gradient-green" style={{ flexShrink: 0, marginBottom: 0 }}>
            <Stethoscope size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>Need Professional Veterinary Assistance?</h3>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>Our partnered veterinary experts are available for immediate consultation on livestock health concerns and urgent cases.</p>
          </div>
        </div>
        <button className="ent-btn ent-btn-primary" onClick={handleVetContact} style={{ flexShrink: 0 }}>
          <MessageSquare size={18} /> Contact Veterinary Expert
        </button>
      </motion.div>

      {/* Actions Row */}
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
        <button className="ent-btn ent-btn-secondary" onClick={() => onNavigate('dashboard')}>Back to Dashboard</button>
        <button className="ent-btn ent-btn-primary" onClick={() => onNavigate('disease-prediction')}>New Diagnostic</button>
      </div>
    </div>
  );
};

export default AdvisorySystem;
