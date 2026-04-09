import React from 'react';
import { Activity, Heart } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top grid grid-3">
          <div className="footer-brand">
            <a href="#" className="logo">
              <Activity className="logo-icon" size={28} />
              <span className="logo-text" style={{ color: 'var(--color-white)' }}>
                Livestock<span className="logo-accent">AI</span>
              </span>
            </a>
            <p className="footer-desc">
              AI-Driven Livestock Disease Prediction & Advisory System built to empower modern agriculture.
            </p>
          </div>
          
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#solution">How it Works</a></li>
              <li><a href="#model">AI Model</a></li>
            </ul>
          </div>
          
          <div className="footer-links">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Research Ethics</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} LivestockAI Project. Designed with 
            <Heart size={14} className="heart-icon" /> by Rohith Saiva.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
