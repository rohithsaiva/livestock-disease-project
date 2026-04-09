import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import './Results.css';

const Results = () => {
  return (
    <section className="section results-section" id="results">
      <div className="container">
        <div className="section-title">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Prediction Results
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Clear, actionable outputs categorized by risk levels to help farmers prioritize their response.
          </motion.p>
        </div>

        <div className="grid grid-3 results-grid">
          {/* High Risk */}
          <motion.div 
            className="result-card high-risk glass-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="gauge-container">
              <svg viewBox="0 0 100 50" className="gauge">
                <path d="M10,50 A40,40 0 0,1 90,50" className="gauge-bg" />
                <motion.path 
                  d="M10,50 A40,40 0 0,1 90,50" 
                  className="gauge-fill color-red" 
                  initial={{ strokeDasharray: "125, 125" }}
                  whileInView={{ strokeDasharray: "115, 125" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                />
              </svg>
              <div className="gauge-value color-text-red">92%</div>
            </div>
            <h3>High Risk</h3>
            <p className="disease-name">Foot and Mouth Disease (FMD)</p>
            <div className="result-action">
              <button className="btn-small bg-red">Immediate Action <ArrowRight size={14} /></button>
            </div>
          </motion.div>

          {/* Medium Risk */}
          <motion.div 
            className="result-card medium-risk glass-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="gauge-container">
              <svg viewBox="0 0 100 50" className="gauge">
                <path d="M10,50 A40,40 0 0,1 90,50" className="gauge-bg" />
                <motion.path 
                  d="M10,50 A40,40 0 0,1 90,50" 
                  className="gauge-fill color-yellow" 
                  initial={{ strokeDasharray: "0, 125" }}
                  whileInView={{ strokeDasharray: "75, 125" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.6 }}
                />
              </svg>
              <div className="gauge-value color-text-yellow">60%</div>
            </div>
            <h3>Medium Risk</h3>
            <p className="disease-name">Bovine Respiratory Disease</p>
            <div className="result-action">
              <button className="btn-small bg-yellow">Monitor Closely <ArrowRight size={14} /></button>
            </div>
          </motion.div>

          {/* Low Risk */}
          <motion.div 
            className="result-card low-risk glass-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="gauge-container">
              <svg viewBox="0 0 100 50" className="gauge">
                <path d="M10,50 A40,40 0 0,1 90,50" className="gauge-bg" />
                <motion.path 
                  d="M10,50 A40,40 0 0,1 90,50" 
                  className="gauge-fill color-green" 
                  initial={{ strokeDasharray: "0, 125" }}
                  whileInView={{ strokeDasharray: "20, 125" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.7 }}
                />
              </svg>
              <div className="gauge-value color-text-green">15%</div>
            </div>
            <h3>Low Risk</h3>
            <p className="disease-name">Minor Nutritional Deficiency</p>
            <div className="result-action">
              <button className="btn-small bg-green">View Advice <ArrowRight size={14} /></button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Results;
