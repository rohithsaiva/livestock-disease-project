import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, BrainCircuit, Stethoscope, ActivitySquare } from 'lucide-react';
import './Features.css';

const Features = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const featureCards = [
    {
      id: 1,
      title: "Early Disease Detection",
      description: "Detect livestock diseases in early stages using precise AI models, catching symptoms before they become critical.",
      icon: <ShieldAlert size={32} className="feature-icon-svg" />,
      delay: 0
    },
    {
      id: 2,
      title: "AI Disease Prediction",
      description: "Predict possible diseases accurately using combined symptom data and environmental condition markers.",
      icon: <BrainCircuit size={32} className="feature-icon-svg" />,
      delay: 0.1
    },
    {
      id: 3,
      title: "Advisory Suggestions",
      description: "Receive immediate feeding, hygiene, and treatment recommendations tailored to the specific diagnosis.",
      icon: <Stethoscope size={32} className="feature-icon-svg" />,
      delay: 0.2
    },
    {
      id: 4,
      title: "Health Monitoring",
      description: "Monitor animal health conditions continuously with IoT integration and visual analytics records.",
      icon: <ActivitySquare size={32} className="feature-icon-svg" />,
      delay: 0.3
    }
  ];

  return (
    <section className="section features-section" id="features">
      <div className="container">
        <div className="section-title">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Intelligent Features
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            A comprehensive suite of tools designed to safeguard your livestock and maximize farm efficiency.
          </motion.p>
        </div>

        <motion.div 
          className="grid grid-4 features-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {featureCards.map((feature) => (
            <motion.div key={feature.id} variants={itemVariants} className="feature-card glass-card">
              <div className="feature-icon-wrapper">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
