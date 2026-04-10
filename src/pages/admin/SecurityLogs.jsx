import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const SecurityLogs = ({ logs }) => {
  const getIcon = (type) => {
    if (type.includes('SUCCESS')) return <CheckCircle size={16} style={{ color: 'var(--color-soft-green)' }} />;
    if (type.includes('FAIL') || type.includes('UNAUTHORIZED') || type.includes('LOCK')) return <AlertTriangle size={16} style={{ color: '#ff9800' }} />;
    return <Info size={16} style={{ color: '#03a9f4' }} />;
  };

  return (
    <div className="admin-panel-section glass-card">
      <div className="section-header">
        <Shield className="section-icon" style={{ color: 'var(--color-primary)' }} />
        <h2>Security Monitoring Logs</h2>
      </div>

      <div className="table-responsive">
        {logs.length === 0 ? (
          <p className="no-data">No security logs recorded yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Event Type</th>
                <th>Monitored Identity</th>
                <th>Additional Context</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <motion.tr 
                  key={log.id} 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                >
                  <td style={{ fontSize: '0.85rem', color: 'var(--color-light)' }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                      {getIcon(log.type)} {log.type}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'monospace', letterSpacing: '1px', opacity: 0.8 }}>
                    {log.user}
                  </td>
                  <td style={{ fontSize: '0.85rem', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '4px' }}>
                    {JSON.stringify(log.details)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SecurityLogs;
