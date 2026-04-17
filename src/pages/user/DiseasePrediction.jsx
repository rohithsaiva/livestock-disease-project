import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, ArrowLeft, BrainCircuit } from 'lucide-react';
import { authService } from '../../services/auth';
import { auth } from '../../config/firebase';
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
  const [prediction, setPrediction] = useState("");
  const [errorState, setErrorState] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setPrediction("");
    setErrorState(false);

    try {
      console.log("=== START PREDICT ===");
      console.log("Form Data:", formData);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          animalType: formData.animalType,
          age: Number(formData.age),
          fever: formData.fever === "Yes",
          appetiteLoss: formData.appetiteLoss === "Yes",
          weakness: formData.weakness === "Yes",
          temperature: Number(formData.temperature),
          humidity: Number(formData.humidity),
          vaccination: formData.vaccination
        })
      });

      console.log("Fetch response status:", response.status);

      const data = await response.json();

      console.log("RAW RESPONSE:", data);

      if (!response.ok || data.success === false) {
          throw new Error("Backend reported an error or fetch failed");
      }

      const diseaseName = data?.prediction || "No result";
      setPrediction(diseaseName);

      // ── Save to localStorage so AnimalRecords + Admin panel can display it ──
      try {
        const currentUser = auth?.currentUser;
        const userName = currentUser
          ? (currentUser.displayName || currentUser.email.split('@')[0])
          : 'User';
        const userEmail = currentUser?.email || '';

        authService.saveInteraction('disease_prediction', {
          userName,
          userEmail,
          animalType: formData.animalType,
          age: formData.age,
          fever: formData.fever,
          appetiteLoss: formData.appetiteLoss,
          weakness: formData.weakness,
          temperature: formData.temperature,
          humidity: formData.humidity,
          vaccination: formData.vaccination,
          prediction: diseaseName
        });
        console.log('[Prediction saved to records]');
      } catch (saveErr) {
        console.warn('Could not save interaction:', saveErr.message);
      }

    } catch (error) {
      console.error("FRONTEND ERROR:", error);
      setPrediction("Server error");
      setErrorState(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      className="ent-layout-container ent-animate-fade-in" 
      style={{ maxWidth: '900px' }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.button
        onClick={() => onNavigate('dashboard')}
        className="ent-btn ent-btn-secondary"
        style={{ marginBottom: '32px' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 250 }}
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </motion.button>

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

        <h2 style={{ textAlign: 'center', marginBottom: '32px' }}>Predict using Form</h2>

        <form onSubmit={handleSubmit} className="ent-form">
          
          <div className="animal-selector">
            {["Cow", "Buffalo", "Sheep", "Goat"].map((animal) => (
              <div
                key={animal}
                className={`animal-item ${
                  formData.animalType === animal ? "active" : ""
                }`}
                onClick={() =>
                  setFormData({ ...formData, animalType: animal })
                }
              >
                {animal}
              </div>
            ))}
          </div>

          <div className="ent-grid-2">
            
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
                <option value="Not Vaccinated">Not vaccinated</option>
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

            {prediction && !errorState && (
              <div style={{
                padding: '20px 24px',
                background: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(16,185,129,0.12))',
                border: '1px solid rgba(34,197,94,0.3)',
                borderRadius: '12px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span style={{ fontSize: '1.5rem' }}>🩺</span>
                <div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280', fontFamily: 'DM Sans, sans-serif' }}>DIAGNOSIS RESULT</p>
                  <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700', color: '#16a34a', fontFamily: 'Syne, sans-serif' }}>{prediction}</p>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <motion.button 
                type="submit" 
                className="ent-btn ent-btn-primary" 
                style={{ width: '100%', maxWidth: '300px' }} 
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {isSubmitting ? (
                  <>
                    <Activity className="ent-spinner" size={18} style={{ animation: 'spin 1s linear infinite' }} /> Processing Neural Net...
                  </>
                ) : (
                  'Execute Prediction'
                )}
              </motion.button>
            </div>



            {errorState && (
              <div className="prediction-error-card">
                <h3>⚠️ Connection Failed</h3>
                <p>We couldn’t fetch prediction results. Please try again.</p>
                <motion.button 
                  type="button"
                  onClick={handleSubmit} 
                  className="ent-btn ent-btn-primary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  Retry
                </motion.button>
                <motion.button 
                  type="button"
                  onClick={() => onNavigate('advisory-system')} 
                  className="ent-btn ent-btn-secondary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  Contact Veterinary Expert
                </motion.button>
              </div>
            )}
        </form>
      </motion.div>
    </motion.div>
  );
};

export default DiseasePrediction;
