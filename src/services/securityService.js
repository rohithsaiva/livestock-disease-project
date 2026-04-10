// src/services/securityService.js

import { loggingService } from './loggingService';

const FAILED_LOGINS_KEY = 'security_failed_logins';
const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 5 * 60 * 1000; // 5 minutes

export const securityService = {
  // Replace with backend API later
  getFailedAttempts: (email) => {
    const records = JSON.parse(localStorage.getItem(FAILED_LOGINS_KEY) || '{}');
    const record = records[email];
    if (!record) return 0;
    
    // Check if the lock period has already expired
    if (record.lockedUntil && new Date().getTime() > record.lockedUntil) {
      securityService.clearFailedAttempts(email);
      return 0;
    }
    
    return record.attempts || 0;
  },

  // Replace with backend API later
  isAccountLocked: (email) => {
    const records = JSON.parse(localStorage.getItem(FAILED_LOGINS_KEY) || '{}');
    const record = records[email];
    if (!record || !record.lockedUntil) return false;
    
    const now = new Date().getTime();
    if (now < record.lockedUntil) {
      return { 
        locked: true, 
        remainingSeconds: Math.ceil((record.lockedUntil - now) / 1000) 
      };
    }
    
    // Lock has expired, clean up
    securityService.clearFailedAttempts(email);
    return false;
  },

  // Replace with backend API later
  recordFailedLogin: (email) => {
    if (!email) return { attempts: 0, locked: false };
    
    const records = JSON.parse(localStorage.getItem(FAILED_LOGINS_KEY) || '{}');
    const currentAttempts = (records[email]?.attempts || 0) + 1;
    
    let lockedUntil = null;
    if (currentAttempts >= MAX_ATTEMPTS) {
      lockedUntil = new Date().getTime() + LOCK_DURATION_MS;
      securityService.logSecurityEvent('ACCOUNT_LOCKED', { email, timestamp: new Date().toISOString() });
    } else {
      securityService.logSecurityEvent('LOGIN_FAILED', { email, currentAttempts, timestamp: new Date().toISOString() });
    }
    
    records[email] = {
      attempts: currentAttempts,
      lockedUntil
    };
    
    localStorage.setItem(FAILED_LOGINS_KEY, JSON.stringify(records));
    return { attempts: currentAttempts, locked: !!lockedUntil };
  },

  // Replace with backend API later
  clearFailedAttempts: (email) => {
    const records = JSON.parse(localStorage.getItem(FAILED_LOGINS_KEY) || '{}');
    if (records[email]) {
      delete records[email];
      localStorage.setItem(FAILED_LOGINS_KEY, JSON.stringify(records));
    }
  },

  // Replace with backend API later
  logSecurityEvent: (eventType, details) => {
    // Phase 6: Forward internally to Logging Service native format bounds
    loggingService.log(eventType, details.email || details.expected || 'Anonymous', details);
  },

  // Phase 3: Token simulation & Session Security
  generateSessionToken: () => {
    // Simulated token replacing JWT
    const rand = Math.random().toString(36).substring(2, 15);
    const ts = new Date().getTime().toString(36);
    return `sim-${ts}-${rand}`;
  },

  // Phase 4: Validated Password Reset Tokens
  generateResetToken: (email) => {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiry = new Date().getTime() + 10 * 60 * 1000; // 10 minutes
    const records = JSON.parse(localStorage.getItem('security_reset_tokens') || '{}');
    records[token] = { email, expiry };
    
    // Clean up expired tokens silently
    Object.keys(records).forEach(key => {
      if (new Date().getTime() > records[key].expiry) {
        delete records[key];
      }
    });

    localStorage.setItem('security_reset_tokens', JSON.stringify(records));
    return token;
  },
  
  validateResetToken: (token) => {
    const records = JSON.parse(localStorage.getItem('security_reset_tokens') || '{}');
    const record = records[token];
    if (!record) return null;

    if (new Date().getTime() > record.expiry) {
      delete records[token];
      localStorage.setItem('security_reset_tokens', JSON.stringify(records));
      return null;
    }
    return record.email;
  },
  
  consumeResetToken: (token) => {
    const records = JSON.parse(localStorage.getItem('security_reset_tokens') || '{}');
    delete records[token];
    localStorage.setItem('security_reset_tokens', JSON.stringify(records));
  },

  // Phase 5: Role-Based Access Control
  hasRole: (user, requiredRole) => {
    if (!user || user.role !== requiredRole) {
      securityService.logSecurityEvent('UNAUTHORIZED_ACCESS_ATTEMPT', { expected: requiredRole, actual: user?.role || 'none', timestamp: new Date().toISOString() });
      return false; // Fail closed unconditionally
    }
    return true;
  }
};
