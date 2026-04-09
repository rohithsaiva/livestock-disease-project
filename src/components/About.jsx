import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Code, BrainCircuit, Database } from 'lucide-react';
import './About.css';
import developerAvatar from '../assets/developer_avatar.png';

const About = () => {
  return (
    <section className="section about-section" id="about">
      <div className="container">
        <div className="section-title">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            About the Developer
          </motion.h2>
        </div>

        <motion.div 
          className="about-card glass-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="about-grid">
            <div className="about-image-col">
              <div className="developer-avatar">
                <img src={developerAvatar} alt="Rohith Saiva - Developer Avatar" className="avatar-img" />
              </div>
              <h3 className="developer-name">Rohith Saiva</h3>
              <p className="developer-title">B.Tech Artificial Intelligence & Machine Learning Student</p>
              
              <div className="social-links">
                <a href="https://github.com/rohithsaiva" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub">
                  <Github size={20} />
                </a>
                <a href="mailto:rohithsaiva8@gmail.com?subject=Contact%20Regarding%20AI%20Project" className="social-link" aria-label="Email">
                  <Mail size={20} />
                </a>
              </div>
            </div>

            <div className="about-content-col">
              <h4>Passionate about AI for Good</h4>
              <p>
                Dedicated to building robust artificial intelligence systems that solve real-world agricultural problems. 
                My focus is on translating complex machine learning models into intuitive, accessible tools that empower 
                farmers and improve livestock management globally.
              </p>
              
              <div className="interests-area">
                <h4>Core Interests</h4>
                <div className="interests-grid">
                  <div className="interest-item">
                    <BrainCircuit size={18} className="interest-icon" />
                    <span>Machine Learning</span>
                  </div>
                  <div className="interest-item">
                    <Code size={18} className="interest-icon" />
                    <span>AI Research</span>
                  </div>
                  <div className="interest-item">
                    <Database size={18} className="interest-icon" />
                    <span>Data Science</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
