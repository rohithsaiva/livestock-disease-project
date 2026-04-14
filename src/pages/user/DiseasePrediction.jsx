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
  const [predictionMode, setPredictionMode] = useState('form');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setPredictionResult(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setPredictionResult(null);

    // Save interaction
    authService.saveInteraction('disease_prediction', formData);

    try {
      const response = await fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Animal: formData.animalType,
          Age: formData.age,
          Fever: formData.fever,
          AppetiteLoss: formData.appetiteLoss,
          Weakness: formData.weakness,
          Vaccination: formData.vaccination,
          Temp: formData.temperature,
          Humidity: formData.humidity
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setPredictionResult(data.disease);
      } else {
        setPredictionResult('Error: ' + (data.error || 'Server error'));
      }
    } catch (err) {
      console.error(err);
      setPredictionResult('Error: Failed to connect to prediction server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) return;

    setIsSubmitting(true);
    setPredictionResult(null);

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('image', selectedImage);

    try {
      const response = await fetch('http://localhost:5000/api/predict-image', {
        method: 'POST',
        body: formDataToSubmit,
      });

      const data = await response.json();
      
      if (response.ok) {
        setPredictionResult(data.disease);
        authService.saveInteraction('disease_prediction_image', { predictedDisease: data.disease });
      } else {
        setPredictionResult('Error: ' + (data.error || 'Server error'));
      }
    } catch (err) {
      console.error(err);
      setPredictionResult('Error: Failed to connect to prediction server.');
    } finally {
      setIsSubmitting(false);
    }
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

        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', justifyContent: 'center' }}>
          <button 
            type="button" 
            className={`ent-btn ${predictionMode === 'form' ? 'ent-btn-primary' : 'ent-btn-secondary'}`}
            onClick={() => setPredictionMode('form')}
          >
            Predict using Form
          </button>
          <button 
            type="button" 
            className={`ent-btn ${predictionMode === 'image' ? 'ent-btn-primary' : 'ent-btn-secondary'}`}
            onClick={() => setPredictionMode('image')}
          >
            Predict using Image
          </button>
        </div>

        {predictionMode === 'form' ? (
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

            {predictionResult && (
              <div style={{ padding: '16px 24px', backgroundColor: predictionResult.startsWith('Error') ? '#fee2e2' : 'rgba(16, 185, 129, 0.1)', color: predictionResult.startsWith('Error') ? '#ef4444' : '#10b981', borderRadius: '8px', fontWeight: 'bold', marginBottom: '24px' }}>
                {predictionResult.startsWith('Error') ? predictionResult : `Prediction: ${predictionResult}`}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
        ) : (
          <form onSubmit={handleImageSubmit} className="ent-form" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
            <div style={{ width: '100%', maxWidth: '500px', padding: '24px', border: '2px dashed #e2e8f0', borderRadius: '12px', textAlign: 'center' }}>
              {imagePreview ? (
                <div style={{ marginBottom: '16px' }}>
                  <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }} />
                </div>
              ) : (
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>No image selected</p>
              )}
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                style={{ display: 'block', margin: '0 auto' }} 
              />
            </div>
            
            {predictionResult && (
              <div style={{ padding: '16px 24px', backgroundColor: predictionResult.startsWith('Error') ? '#fee2e2' : 'rgba(16, 185, 129, 0.1)', color: predictionResult.startsWith('Error') ? '#ef4444' : '#10b981', borderRadius: '8px', fontWeight: 'bold' }}>
                {predictionResult.startsWith('Error') ? predictionResult : `Prediction: ${predictionResult}`}
              </div>
            )}

            <button type="submit" className="ent-btn ent-btn-primary" style={{ width: '100%', maxWidth: '300px' }} disabled={isSubmitting || !selectedImage}>
              {isSubmitting ? (
                <>
                  <Activity className="ent-spinner" size={18} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing Image...
                </>
              ) : (
                'Predict from Image'
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default DiseasePrediction;
