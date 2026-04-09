import React from 'react';
import { motion } from 'framer-motion';
import { Wifi, Phone, ScanEye, DatabaseZap } from 'lucide-react';
import './Future.css';

const Future = () => {
  const futureItems = [
    {
      id: 1,
      title: "IoT Sensor Integration",
      description: "Automated real-time symptom data collection directly from livestock wearables and barn sensors.",
      icon: <Wifi size={24} />
    },
    {
      id: 2,
      title: "Mobile Application",
      description: "A dedicated native mobile application for offline field data entry and instant push notifications.",
      icon: <Phone size={24} />
    },
    {
      id: 3,
      title: "Computer Vision",
      description: "Deep learning models capable of identifying skin lesions and distress behaviors from farm cameras.",
      icon: <ScanEye size={24} />
    },
    {
      id: 4,
      title: "Veterinary Exchange",
      description: "Direct secure API integration with national veterinary databases for epidemic tracking.",
      icon: <DatabaseZap size={24} />
    }
  ];

  return (
    <section className="section future-section bg-gradient" id="future">
      <div className="container">
        <div className="section-title">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Future Scope
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            The roadmap for scaling the system to create a comprehensive agricultural intelligence network.
          </motion.p>
        </div>

        <div className="grid grid-4 future-grid">
          {futureItems.map((item, index) => (
            <motion.div 
              key={item.id}
              className="future-card glass-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="future-icon">{item.icon}</div>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Future;
