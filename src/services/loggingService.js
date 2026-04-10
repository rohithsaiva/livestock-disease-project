// src/services/loggingService.js

const LOGS_KEY = 'sys_security_logs';
const MAX_LOGS = 100;

/**
 * Phase 6: Logging & Monitoring Service
 * Enterprise-equivalent simulation for system security bounds.
 */
export const loggingService = {
  log: (type, userOrEmail, details = {}) => {
    try {
      const logs = JSON.parse(localStorage.getItem(LOGS_KEY) || '[]');
      
      // Phase 6 Rule: Mask email for privacy where needed
      let maskedUser = 'Anonymous/Unknown';
      
      if (typeof userOrEmail === 'string' && userOrEmail.includes('@')) {
        const parts = userOrEmail.split('@');
        if (parts[0].length <= 2) {
            maskedUser = `*@${parts[1]}`;
        } else {
            maskedUser = `${parts[0].substring(0, 2)}***@${parts[1]}`;
        }
      } else if (typeof userOrEmail === 'object' && userOrEmail?.email) {
        const parts = userOrEmail.email.split('@');
        if (parts[0].length <= 2) {
            maskedUser = `*@${parts[1]}`;
        } else {
            maskedUser = `${parts[0].substring(0, 2)}***@${parts[1]}`;
        }
      }

      const logEntry = {
        id: `syslog-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        type,           // e.g., 'LOGIN_SUCCESS', 'LOGIN_FAILED', 'UNAUTHORIZED_ACCESS'
        timestamp: new Date().toISOString(),
        user: maskedUser,
        details
      };

      // Add to front of array
      logs.unshift(logEntry);
      
      // Truncate to MAX_LOGS limits securely
      if (logs.length > MAX_LOGS) {
        logs.length = MAX_LOGS; 
      }
      
      localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
    } catch (e) {
      console.error('Failed to securely parse local log stack', e);
    }
  },

  getLogs: () => {
    try {
      return JSON.parse(localStorage.getItem(LOGS_KEY) || '[]');
    } catch (e) {
      return [];
    }
  },

  clearLogs: () => {
    localStorage.removeItem(LOGS_KEY);
  }
};
