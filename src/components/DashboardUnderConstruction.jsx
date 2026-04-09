import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Home } from 'lucide-react';
import './DashboardUnderConstruction.css';

const DashboardUnderConstruction = ({ onHome }) => {
  return (
    <section className="construction-section bg-gradient">
      <div className="container construction-container">
        <motion.div 
          className="construction-card glass-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="icon-wrapper bg-soft-green">
            <AlertTriangle size={48} className="construction-icon text-accent" />
          </div>
          
          <h2>Thanks for Logging In!</h2>
          <p className="subtitle">
            Your account has been successfully verified.
          </p>

          <div className="construction-content">
            <p>
              We are currently working hard behind the scenes building your dedicated Artificial Intelligence Dashboard. 
              The full disease prediction and advisory features will be available here soon.
            </p>
          </div>

          <button onClick={onHome} className="btn btn-primary return-btn">
            <Home size={18} /> Return to Homepage
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default DashboardUnderConstruction;
