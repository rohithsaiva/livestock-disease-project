import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Database, Settings, Activity, ClipboardList, ArrowRight } from 'lucide-react';
import './Solution.css';

const Solution = () => {
  const steps = [
    {
      id: 1,
      name: "Input Symptoms",
      icon: <FileText size={24} />,
      color: "step-green"
    },
    {
      id: 2,
      name: "Data Processing",
      icon: <Database size={24} />,
      color: "step-blue"
    },
    {
      id: 3,
      name: "ML Model",
      icon: <Settings size={24} />,
      color: "step-purple"
    },
    {
      id: 4,
      name: "Prediction",
      icon: <Activity size={24} />,
      color: "step-orange"
    },
    {
      id: 5,
      name: "Advisory",
      icon: <ClipboardList size={24} />,
      color: "step-teal"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="section solution-section" id="solution">
      <div className="container">
        <div className="section-title">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Proposed AI Solution
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            An end-to-end automated pipeline that translates observable farm data into actionable veterinary insights.
          </motion.p>
        </div>

        <motion.div 
          className="workflow-container glass-card"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <motion.div className="workflow-step" variants={stepVariants}>
                <div className={`step-icon ${step.color}`}>
                  {step.icon}
                </div>
                <h4 className="step-name">{step.name}</h4>
              </motion.div>
              
              {index < steps.length - 1 && (
                <motion.div className="workflow-arrow" variants={stepVariants}>
                  <ArrowRight size={24} className="arrow-svg" />
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Solution;
