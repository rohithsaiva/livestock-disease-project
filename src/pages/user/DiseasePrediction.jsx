import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, ArrowLeft, BrainCircuit } from 'lucide-react';
import { authService } from '../../services/auth';
import './DiseasePrediction.css';

const DiseasePrediction = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    animalType: 'Cow',
    age: '',
    fever: 'No',
    appetiteLoss: 'No',
    weakness: 'No',
    temperature: '',
    humidity: '',
    vaccination: 'Up to date'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Save interaction
    authService.saveInteraction('disease_prediction', formData);

    setTimeout(() => {
      setIsSubmitting(false);
      onNavigate('prediction-result');
    }, 1500);
  };

  return (
    <div className="ent-layout-container ent-animate-fade-in" style={{ maxWidth: '900px' }}>
      <button
        onClick={() => onNavigate('dashboard')}
        className="ent-btn ent-btn-secondary"
        style={{ marginBottom: '32px' }}
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <motion.div
        className="ent-card p-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="ent-hero-section" style={{ marginBottom: '40px', textAlign: 'center' }}>
          <div className="ent-icon-container gradient-purple" style={{ margin: '0 auto 24px auto' }}>
            <BrainCircuit size={32} />
          </div>
          <h2 className="ent-hero-title" style={{ fontSize: '2.5rem' }}>AI Diagnostics Form</h2>
          <p className="ent-hero-subtitle">
            Enter animal symptoms and environmental data into the secure form. Our neural network will analyze the inputs to predict disease probabilities.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="ent-form">
          <div className="ent-grid-2">
            <div className="ent-form-group">
              <label className="ent-form-label">Animal Type</label>
              <select name="animalType" value={formData.animalType} onChange={handleChange} className="ent-input" required>
                <option value="Cow">Cow</option>
                <option value="Goat">Goat</option>
                <option value="Sheep">Sheep</option>
                <option value="Buffalo">Buffalo</option>
              </select>
            </div>
            
            <div className="ent-form-group">
              <label className="ent-form-label">Age (years)</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} className="ent-input" min="0" step="0.1" required placeholder="e.g. 2.5" />
            </div>

            <div className="ent-form-group">
              <label className="ent-form-label">Fever Detected?</label>
              <select name="fever" value={formData.fever} onChange={handleChange} className="ent-input">
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div className="ent-form-group">
              <label className="ent-form-label">Appetite Loss?</label>
              <select name="appetiteLoss" value={formData.appetiteLoss} onChange={handleChange} className="ent-input">
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div className="ent-form-group">
              <label className="ent-form-label">Physical Weakness?</label>
              <select name="weakness" value={formData.weakness} onChange={handleChange} className="ent-input">
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div className="ent-form-group">
              <label className="ent-form-label">Vaccination Status</label>
              <select name="vaccination" value={formData.vaccination} onChange={handleChange} className="ent-input">
                <option value="Up to date">Up to date</option>
                <option value="Not vaccinated">Not vaccinated</option>
              </select>
            </div>

            <div className="ent-form-group">
              <label className="ent-form-label">Core Temperature (°C)</label>
              <input type="number" name="temperature" value={formData.temperature} onChange={handleChange} className="ent-input" step="0.1" placeholder="e.g. 39.5" required />
            </div>

            <div className="ent-form-group">
              <label className="ent-form-label">Surrounding Humidity (%)</label>
              <input type="number" name="humidity" value={formData.humidity} onChange={handleChange} className="ent-input" placeholder="e.g. 65" required />
            </div>
          </div>

          <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="ent-btn ent-btn-primary" style={{ width: '100%', maxWidth: '300px' }} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Activity className="ent-spinner" size={18} style={{ animation: 'spin 1s linear infinite' }} /> Processing Neural Net...
                </>
              ) : (
                'Execute Prediction'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default DiseasePrediction;
