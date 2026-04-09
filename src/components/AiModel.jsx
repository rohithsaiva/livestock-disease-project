import React from 'react';
import { motion } from 'framer-motion';
import { Network, Database } from 'lucide-react';
import './AiModel.css';

const AiModel = () => {
  return (
    <section className="section ai-model-section" id="model">
      <div className="container">
        <div className="section-title">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Machine Learning Approach
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Built upon vast livestock datasets analyzing physiological symptoms and environmental parameters.
          </motion.p>
        </div>

        <div className="grid grid-2 model-grid">
          <motion.div 
            className="model-info glass-card"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="info-header">
              <Database className="info-icon" />
              <h3>Dataset & Features</h3>
            </div>
            <ul className="info-list">
              <li><strong>Symptoms:</strong> Temperature, appetite, lesions, breathing rate, milk yield drop.</li>
              <li><strong>Environment:</strong> Humidity, ambient temperature, season.</li>
            </ul>
            
            <div className="info-header mt-4">
              <Network className="info-icon" />
              <h3>Algorithms Evaluated</h3>
            </div>
            <div className="algo-tags">
              <span className="badge">Logistic Regression</span>
              <span className="badge">Support Vector Machine (SVM)</span>
              <span className="badge">Random Forest</span>
              <span className="badge primary-badge">Deep Neural Networks</span>
            </div>
          </motion.div>

          <motion.div 
            className="model-metrics glass-card"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3>Model Performance</h3>
            <p className="metrics-desc">Random Forest classifier provided the highest accuracy across generalized test sets.</p>
            
            <div className="metrics-container">
              <div className="metric-bar-group">
                <div className="metric-label">
                  <span>Accuracy</span>
                  <span>98.2%</span>
                </div>
                <div className="metric-track">
                  <motion.div 
                    className="metric-fill" 
                    initial={{ width: 0 }}
                    whileInView={{ width: '98.2%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  ></motion.div>
                </div>
              </div>
              
              <div className="metric-bar-group">
                <div className="metric-label">
                  <span>Precision</span>
                  <span>97.5%</span>
                </div>
                <div className="metric-track">
                  <motion.div 
                    className="metric-fill" 
                    initial={{ width: 0 }}
                    whileInView={{ width: '97.5%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.6 }}
                  ></motion.div>
                </div>
              </div>
              
              <div className="metric-bar-group">
                <div className="metric-label">
                  <span>Recall</span>
                  <span>96.8%</span>
                </div>
                <div className="metric-track">
                  <motion.div 
                    className="metric-fill" 
                    initial={{ width: 0 }}
                    whileInView={{ width: '96.8%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.7 }}
                  ></motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AiModel;
