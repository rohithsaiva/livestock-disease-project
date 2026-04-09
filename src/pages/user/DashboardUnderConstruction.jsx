import React from 'react';
import { motion } from 'framer-motion';
import { Activity, MessageSquare } from 'lucide-react';
import './DashboardUnderConstruction.css';

const DashboardUnderConstruction = ({ onContact }) => {
  return (
    <div className="user-dashboard-wrapper bg-gradient">
      
      {/* Main Dashboard Content */}
      <section className="construction-section">
        <div className="container construction-container">
          <motion.div 
            className="construction-card glass-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="icon-wrapper bg-soft-green" style={{ marginBottom: '1.5rem'}}>
              <Activity size={48} className="construction-icon text-accent" />
            </div>
            
            <h2>Welcome to Your Dashboard!</h2>
            <p className="subtitle">
              Your account is successfully verified and active.
            </p>

            <div className="construction-content">
              <p>
                We are currently building out the dedicated Artificial Intelligence prediction suite. 
                Full disease advisory features will be available here soon. 
              </p>
              <p style={{ marginTop: '1rem', color: '#a0a0a0', fontSize: '0.95rem' }}>
                 If you are interested in beta access, collaboration, or early farm deployment, please reach out to our team directly below.
              </p>
            </div>

            <button onClick={onContact} className="btn btn-primary return-btn">
               <MessageSquare size={18} /> Get in Touch
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default DashboardUnderConstruction;
