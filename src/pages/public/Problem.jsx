import React from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, UsersRound, TimerOff } from 'lucide-react';
import './Problem.css';

const Problem = () => {
  return (
    <section className="section problem-section bg-pattern" id="problem">
      <div className="container">
        <div className="section-title">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            The Real-World Challenge
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Livestock management faces critical bottlenecks that affect yield and animal well-being.
          </motion.p>
        </div>

        <div className="grid grid-3 problem-grid">
          <motion.div 
            className="problem-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="prob-icon warning">
              <TrendingDown size={28} />
            </div>
            <h3>Major Financial Losses</h3>
            <p>Undetected livestock diseases spread rapidly, causing devastating financial losses for individual farmers and the agricultural economy.</p>
          </motion.div>

          <motion.div 
            className="problem-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="prob-icon danger">
              <TimerOff size={28} />
            </div>
            <h3>Delayed Diagnoses</h3>
            <p>Early detection is extremely difficult without on-site veterinary experts, often resulting in treatments being administered too late.</p>
          </motion.div>

          <motion.div 
            className="problem-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="prob-icon alert">
              <UsersRound size={28} />
            </div>
            <h3>Limited Access</h3>
            <p>Many rural and marginalized farmers lack immediate access to professional veterinary care and accurate diagnostic laboratories.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Problem;
