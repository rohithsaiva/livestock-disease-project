import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Settings } from 'lucide-react';
import './Home.css';

import heroImage from '../../assets/hero_v2.png';

const Home = ({ setActiveTab }) => {
  return (
    <section className="hero bg-gradient">
      <div className="container hero-container">
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-badge"
          >
            <span className="badge-dot"></span>
            Smart Agriculture AI
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            AI-Driven Livestock Disease Prediction <br />
            <span className="text-accent">& Advisory System</span>
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Using Artificial Intelligence to help farmers detect livestock diseases early and provide
            smart advisory recommendations.
          </motion.p>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <button
              onClick={() => { setActiveTab('login'); window.scrollTo(0, 0); }}
              className="btn btn-primary"
            >
              Get Started <ArrowRight size={18} />
            </button>
            <button
              onClick={() => setActiveTab('solution')}
              className="btn btn-secondary"
            >
              <Settings size={18} /> Explore Workflow
            </button>
          </motion.div>
        </div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="visual-wrapper">
            <img
              src={heroImage}
              alt="AI Agriculture Platform Dashboard with Livestock Illustration"
              className="floating-hero-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800";
              }}
            />
            <div className="floating-card card-1 glass-card">
              <div className="pulse-dot bg-green"></div>
              <span>Vitals Normal</span>
            </div>
            <div className="floating-card card-2 glass-card">
              <div className="icon-wrap bg-soft-green">AI</div>
              <span>Analyzing</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Home;
