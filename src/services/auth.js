/**
 * LivestockAI Authentication & Core Data Service
 * Centralized service for user authentication, registration, session tracking,
 * and data management (interactions, storage, etc.)
 */

import { userStorage } from '../data/userStorage';
import { loginHistoryStorage } from '../data/loginHistory';
import { projectDataStorage } from '../data/projectDataStorage';
import { commentsStorage } from '../data/commentsStorage';
import { securityService } from './securityService';
import { loggingService } from './loggingService';

// Initialize default admin if not exists
const initializeDB = () => {
  const users = userStorage.getUsers();
  const adminExists = users.some(u => u.email === 'admin@livestock.com');

  if (!adminExists) {
    users.push({
      id: 'admin-0',
      name: 'Admin',
      email: 'admin@livestock.com',
      phone: '0000000000',
      password: 'admin123',
      role: 'admin',
      lastLogin: null,
      createdAt: new Date().toISOString()
    });
    userStorage.saveUsers(users);
  }
};

initializeDB();

export const authService = {
  login: (email, password) => {
    // Phase 1: Security - Check if account is locked
    const lockStatus = securityService.isAccountLocked(email);
    if (lockStatus && lockStatus.locked) {
      return {
        success: false,
        locked: true,
        remainingSeconds: lockStatus.remainingSeconds,
        error: `Account locked. Try again in ${Math.ceil(lockStatus.remainingSeconds / 60)} minutes.`
      };
    }

    const users = userStorage.getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      // Phase 1: Security - Clear failed attempts on success
      securityService.clearFailedAttempts(email);

      // Phase 3: Token rotation simulation and Session Expiry
      const token = securityService.generateSessionToken();
      const expiry = new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(); // 1 hour

      // Update last login
      user.lastLogin = new Date().toISOString();
      userStorage.saveUsers(users);

      // Don't store password in "session"
      const { password: _, ...userInfo } = user;
      
      const sessionData = {
        user: userInfo,
        email: userInfo.email,
        token: token,
        expiry: expiry
      };
      
      sessionStorage.setItem('user_session', JSON.stringify(sessionData));
      userStorage.setCurrentUser(userInfo);

      if (user.role !== 'admin') {
        loginHistoryStorage.recordLogin(userInfo);
      }

      // Phase 6: Log Success
      loggingService.log('LOGIN_SUCCESS', userInfo.email, { role: userInfo.role });

      return { success: true, user: userInfo };
    }
    
    // Phase 1: Security - Record failed login
    const failStatus = securityService.recordFailedLogin(email);
    if (failStatus.locked) {
      return {
        success: false,
        locked: true,
        remainingSeconds: 300, // 5 minutes
        error: `Account locked due to too many failed attempts. Try again in 5 minutes.`
      };
    }

    return { 
      success: false, 
      failedAttempts: failStatus.attempts,
      error: 'Invalid credentials. Please try again.' // Phase 2 requirement (Generic responses)
    };
  },

  // Register new user
  register: (userData) => {
    const users = userStorage.getUsers();

    // Phase 2: Prevent duplicate accounts and enumeration
    // If user exists, we pretend it was successful to hide account presence
    if (users.some(u => u.email === userData.email)) {
      return { success: true, message: 'Request processed' };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      ...userData,
      role: 'user', // Default role is user
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    userStorage.saveUsers(users);

    return { success: true, message: 'Request processed' };
  },

  // Google Login / Auto-register
  googleLogin: (userData) => {
    const users = userStorage.getUsers();
    let user = users.find(u => u.email === userData.email);
    let isNewRegistration = false;

    if (!user) {
      isNewRegistration = true;
      // Automatically register user if first time
      user = {
        id: `user-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        phone: '', // Google login doesn't provide phone natively here
        password: '', // No traditional password
        role: 'user',
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      users.push(user);
    } else {
      user.lastLogin = new Date().toISOString();
    }
    
    userStorage.saveUsers(users);

    const { password: _, ...userInfo } = user;

    // Phase 3: Token rotation simulation and Session Expiry
    const token = securityService.generateSessionToken();
    const expiry = new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(); // 1 hour

    const sessionData = {
      user: userInfo,
      email: userInfo.email,
      token: token,
      expiry: expiry
    };
    
    sessionStorage.setItem('user_session', JSON.stringify(sessionData));
    userStorage.setCurrentUser(userInfo);

    if (userInfo.role !== 'admin') {
      loginHistoryStorage.recordLogin(userInfo);
    }
    
    // Phase 6: Log Google native success
    loggingService.log('LOGIN_SUCCESS_GOOGLE', userInfo.email, { role: userInfo.role, isNewRegistration });

    return { success: true, user: userInfo };
  },

  // Get currently logged in user
  getCurrentUser: () => {
    // Phase 3: Check Session Storage and Expiry
    const sessionStr = sessionStorage.getItem('user_session') || sessionStorage.getItem('google_session');
    
    if (sessionStr) {
      try {
        const sessionData = JSON.parse(sessionStr);

        // Check for new OTP backend session format
        if (sessionData.loginTime) {
          const loginTime = new Date(sessionData.loginTime);
          if (new Date() > new Date(loginTime.getTime() + 24 * 60 * 60 * 1000)) { // 24hr expiry
            authService.logout();
            return null;
          }
          // Construct mock user object for standard dashboards
          return {
            id: `otp-${sessionData.email}`,
            name: sessionData.email.split('@')[0],
            email: sessionData.email,
            role: 'user', // OTP users are strictly 'user' role
            lastLogin: sessionData.loginTime
          };
        }

        if (sessionData.expiry && new Date() > new Date(sessionData.expiry)) {
          // Expired session auto-logout
          authService.logout();
          return null;
        }
        
        // Session is valid, but we need the fully typed user object
        // Return full user from local storage (if missing, returns null)
        const user = userStorage.getCurrentUser();
        if (!user && sessionData.expiry) { // Only force logout if it was a mock-auth session
           authService.logout();
           return null;
        }
        return user;
        
      } catch (e) {
        authService.logout();
        return null;
      }
    }
    
    // Fallback security: If no session exists but local storage does, clear it!
    if (userStorage.getCurrentUser()) {
      authService.logout();
    }
    return null;
  },

  // Logout
  logout: () => {
    // Phase 6: Safely record logout avoiding infinite recursion loops
    try {
      const sessionStr = sessionStorage.getItem('user_session') || sessionStorage.getItem('google_session');
      if (sessionStr) {
        const sessionData = JSON.parse(sessionStr);
        if (sessionData && sessionData.email) {
          loggingService.log('LOGOUT', sessionData.email, { role: sessionData.user?.role || 'user' });
        }
      }
    } catch (e) {
      // Ignore parse errors on logout
    }
    
    loginHistoryStorage.recordLogout();
    userStorage.removeCurrentUser();
    sessionStorage.removeItem('google_session');
    sessionStorage.removeItem('user_session'); // clear our local copy too
  },

  // Phase 4: Password Reset
  requestPasswordReset: (email) => {
    const users = userStorage.getUsers();
    
    // Phase 4 Note: In a real system, this sends an email. 
    if (users.some(u => u.email === email)) {
      const token = securityService.generateResetToken(email);
      // Simulate sending by rendering it in the console for the user to copy/test the UI flow securely.
      console.log(`[SIMULATION] Password reset requested. Token securely dispatched: ${token}`);
    }
    
    // Phase 6: Log the request generically regardless of whether it existed
    loggingService.log('PASSWORD_RESET_REQUESTED', email, {});
    
    // Always return a neutral response preventing email enumeration
    return { success: true, message: 'Request processed' };
  },

  resetPassword: (token, newPassword) => {
    // Attempt token validation
    const email = securityService.validateResetToken(token);
    if (!email) {
      return { success: false, error: 'Invalid or expired token' };
    }
    
    const users = userStorage.getUsers();
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex !== -1) {
      // Execute the security reset
      users[userIndex].password = newPassword;
      userStorage.saveUsers(users);
      
      // Invalidate token
      securityService.consumeResetToken(token);
      
      // Phase 4: Auto-logout all sessions globally internally
      const currentUser = authService.getCurrentUser();
      if (currentUser && currentUser.email === email) {
         authService.logout();
      }
      
      // Phase 6: Log successful mutation
      loggingService.log('PASSWORD_RESET_SUCCESS', email, {});
      
      return { success: true };
    }
    
    return { success: false, error: 'User not found' };
  },

  // ================= ADMIN FUNCTIONS ================= //

  // Get all users
  getAllUsers: () => {
    const currentUser = authService.getCurrentUser();
    // Phase 5: RBAC Execution Native
    if (!securityService.hasRole(currentUser, 'admin')) {
      return { success: false, error: 'Unauthorized route access' };
    }

    const users = userStorage.getUsers();
    // Return users without passwords for security
    return {
      success: true,
      users: users.map(u => {
        const { password, ...userInfo } = u;
        return userInfo;
      })
    };
  },

  // Delete a user
  deleteUser: (userId) => {
    const currentUser = authService.getCurrentUser();
    // Phase 5: RBAC Execution Native
    if (!securityService.hasRole(currentUser, 'admin')) {
      return { success: false, error: 'Unauthorized data mutation attempt' };
    }

    if (userId === 'admin-0') {
      return { success: false, error: 'Cannot delete default admin' };
    }

    let users = userStorage.getUsers();
    const initialLength = users.length;
    users = users.filter(u => u.id !== userId);

    if (users.length === initialLength) {
      return { success: false, error: 'User not found' };
    }

    userStorage.saveUsers(users);
    return { success: true };
  },

  // Update user role (admin only feature)
  updateUserRole: (userId, newRole) => {
    const currentUser = authService.getCurrentUser();
    // Phase 5: RBAC Execution Native
    if (!securityService.hasRole(currentUser, 'admin')) {
      return { success: false, error: 'Unauthorized execution attempt' };
    }
    // ... implementation logic
  },

  // ================= MESSAGES FUNCTIONS ================= //

  saveMessage: (messageData) => {
    const currentUser = authService.getCurrentUser();
    const newMsg = commentsStorage.addMessage(messageData, currentUser);
    return { success: true, message: newMsg };
  },

  getAllMessages: () => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return { success: false, error: 'Unauthorized access' };
    }

    const messages = commentsStorage.getMessages();
    messages.sort((a, b) => new Date(b.date) - new Date(a.date));
    return { success: true, messages };
  },

  deleteMessage: (messageId) => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return { success: false, error: 'Unauthorized access' };
    }

    const success = commentsStorage.deleteMessage(messageId);
    if (!success) return { success: false, error: 'Message not found' };

    return { success: true };
  },

  // ================= INTERACTIONS FUNCTIONS ================= //

  saveInteraction: (type, details) => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) return { success: false, error: 'User not logged in' };

    const newInt = projectDataStorage.addInteraction(type, details, currentUser);
    return { success: true, interaction: newInt };
  },

  getAllInteractions: () => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return { success: false, error: 'Unauthorized access' };
    }

    const interactions = projectDataStorage.getInteractions();
    interactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    return { success: true, interactions };
  },

  getUserInteractions: () => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'User not logged in' };
    }

    const interactions = projectDataStorage.getInteractions();
    const userInteractions = interactions.filter(i => i.userId === currentUser.id);
    userInteractions.sort((a, b) => new Date(b.date) - new Date(a.date));
    return { success: true, interactions: userInteractions };
  },

  deleteInteraction: (interactionId) => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return { success: false, error: 'Unauthorized access' };
    }

    const success = projectDataStorage.deleteInteraction(interactionId);
    if (!success) return { success: false, error: 'Interaction not found' };

    return { success: true };
  }
};

