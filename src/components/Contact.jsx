import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MapPin, Phone, Mail } from 'lucide-react';
import './Contact.css';

const Contact = ({ onReload }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate sending an email/message (e.g. 1.5 seconds)
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', message: '' });

      // After showing the success message for 3 seconds, "reload" the page
      setTimeout(() => {
        setIsSuccess(false);
        if (onReload) onReload();
      }, 3000);
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <section className="section contact-section" id="contact">
      <div className="container">
        <div className="section-title">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Get in Touch
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Interested in collaboration, research, or deploying the system at your farm?
          </motion.p>
        </div>

        <div className="grid grid-2 contact-grid">
          <motion.div 
            className="contact-info"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3>Contact Information</h3>
            <p>Fill out the form and I will get back to you within 24 hours.</p>
            
            <div className="info-list mt-4">
              <div className="info-item">
                <div className="info-icon-wrapper">
                  <Mail size={20} />
                </div>
                <div>
                  <h4>Email</h4>
                  <p>hello@livestockai.example.com</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon-wrapper">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4>Location</h4>
                  <p>AI Research Lab, India</p>
                </div>
              </div>
            </div>
            
            <div className="contact-visual decoration-card glass-card">
              <div className="line line-1"></div>
              <div className="line line-2"></div>
              <div className="line line-3"></div>
            </div>
          </motion.div>

          <motion.div 
            className="contact-form glass-card"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" placeholder="John Doe" className="form-control" value={formData.name} onChange={handleChange} required />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" placeholder="john@example.com" className="form-control" value={formData.email} onChange={handleChange} required />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" rows="5" placeholder="How can we help you?" className="form-control" value={formData.message} onChange={handleChange} required></textarea>
              </div>
              
              <button type="submit" className="btn btn-primary submit-btn" disabled={isSubmitting || isSuccess}>
                {isSubmitting ? 'Sending...' : 'Send Message'} <Send size={18} />
              </button>
              
              <AnimatePresence>
                {isSuccess && (
                  <motion.div 
                    className="success-message"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    Successfully sent! Re-loading...
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
