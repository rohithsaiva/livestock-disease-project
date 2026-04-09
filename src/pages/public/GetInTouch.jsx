import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone } from 'lucide-react';
import './GetInTouch.css';

const GetInTouch = () => {
  return (
    <section className="section contact-section" id="contact">
      <div className="container contact-container">
        <motion.div
          className="modern-contact-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="contact-card-content">
            <h2>Get in Touch</h2>
            <p className="subtitle">Have questions? Reach out to us anytime.</p>

            <div className="contact-items">
              <motion.div 
                className="contact-item"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="icon-glow-wrapper">
                  <Mail size={24} className="contact-icon" />
                </div>
                <div className="item-text">
                  <span>Email</span>
                  <a href="mailto:rohithsaiva8@gmail.com">rohithsaiva8@gmail.com</a>
                </div>
              </motion.div>

              <motion.div 
                className="contact-item"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="icon-glow-wrapper">
                  <Phone size={24} className="contact-icon" />
                </div>
                <div className="item-text">
                  <span>Phone</span>
                  <a href="tel:+919876543210">+91 98765 43210</a>
                </div>
              </motion.div>

              <motion.div 
                className="contact-item"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="icon-glow-wrapper">
                  <MapPin size={24} className="contact-icon" />
                </div>
                <div className="item-text">
                  <span>Location</span>
                  <p>Vignan University, HYD</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GetInTouch;
