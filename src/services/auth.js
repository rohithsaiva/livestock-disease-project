/**
 * LivestockAI Authentication & Core Data Service
 * Centralized service for user authentication, registration, session tracking,
 * and data management (interactions, storage, etc.)
 */
import { userStorage } from '../data/userStorage';
import { loginHistoryStorage } from '../data/loginHistory';
import { projectDataStorage } from '../data/projectDataStorage';
import { commentsStorage } from '../data/commentsStorage';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

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
  // Login user
  login: (email, password) => {
    // 1. Rate Limiting Check
    const attemptKey = `login_attempts_${email}`;
    const attempts = JSON.parse(localStorage.getItem(attemptKey) || '{"count": 0, "lockedUntil": null}');
    
    if (attempts.lockedUntil && new Date().getTime() < new Date(attempts.lockedUntil).getTime()) {
      return { success: false, error: 'Account temporarily locked due to multiple failed attempts. Please try again later.' };
    }

    const users = userStorage.getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      // Success - reset attempts
      localStorage.removeItem(attemptKey);

      // Create session token and update last login
      user.lastLogin = new Date().toISOString();
      userStorage.saveUsers(users);

      const sessionToken = `ent_tk_${Date.now()}_${Math.random().toString(36).substring(7)}`;

      const { password: _, ...userInfo } = user;
      const sessionUser = { ...userInfo, token: sessionToken, sessionStart: new Date().toISOString() };
      
      userStorage.setCurrentUser(sessionUser);

      if (user.role !== 'admin') {
        const historyEntry = { ...sessionUser, action: 'LOGIN_BASIC' };
        loginHistoryStorage.recordLogin(historyEntry);
      }

      return { success: true, user: sessionUser };
    }

    // Failure - increment attempts
    attempts.count += 1;
    if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
      attempts.lockedUntil = new Date(new Date().getTime() + LOCKOUT_DURATION_MS).toISOString();
      localStorage.setItem(attemptKey, JSON.stringify(attempts));
      return { success: false, error: 'Maximum login attempts reached. Account locked for 15 minutes.' };
    }
    
    localStorage.setItem(attemptKey, JSON.stringify(attempts));
    return { success: false, error: `Invalid credentials. ${MAX_LOGIN_ATTEMPTS - attempts.count} attempts left.` };
  },

  // Google OAuth Simulation
  googleSignIn: (email, name) => {
    const users = userStorage.getUsers();
    let user = users.find(u => u.email === email);

    if (!user) {
      // Auto-register via Google OAuth
      user = {
        id: `user-g-${Date.now()}`,
        name: name,
        email: email,
        phone: 'Google Auth',
        password: 'OAUTH_MANAGED',
        role: 'user',
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      users.push(user);
    } else {
      user.lastLogin = new Date().toISOString();
    }
    
    userStorage.saveUsers(users);
    
    const sessionToken = `oauth_tk_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const { password: _, ...userInfo } = user;
    const sessionUser = { ...userInfo, token: sessionToken, sessionStart: new Date().toISOString() };
    
    userStorage.setCurrentUser(sessionUser);

    if (user.role !== 'admin') {
      const historyEntry = { ...sessionUser, action: 'LOGIN_OAUTH' };
      loginHistoryStorage.recordLogin(historyEntry);
    }

    return { success: true, user: sessionUser };
  },

  // Register new user
  register: (userData) => {
    const users = userStorage.getUsers();

    if (users.some(u => u.email === userData.email)) {
      return { success: false, error: 'Email already registered' };
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

    const { password, ...userInfo } = newUser;
    userStorage.setCurrentUser(userInfo);

    // As per new requirement: user manually logs in next
    // but authService handles auto-login if they want

    return { success: true, user: userInfo };
  },

  // Get currently logged in user & validate session
  getCurrentUser: () => {
    const user = userStorage.getCurrentUser();
    
    // Enterprise Security: Check session max age (e.g. 24 hours)
    if (user && user.sessionStart) {
      const sessionAgeMs = new Date().getTime() - new Date(user.sessionStart).getTime();
      const MAX_SESSION_MS = 24 * 60 * 60 * 1000;
      if (sessionAgeMs > MAX_SESSION_MS) {
        authService.logout();
        return null; // Force re-authentication
      }
    }
    return user;
  },

  // Logout
  logout: () => {
    const user = userStorage.getCurrentUser();
    if (user) {
      // Record exactly what user logged out
      loginHistoryStorage.recordLogout();
    }
    userStorage.removeCurrentUser();
  },

  // ================= ADMIN FUNCTIONS ================= //

  // Get all users
  getAllUsers: () => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return { success: false, error: 'Unauthorized access' };
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
    if (!currentUser || currentUser.role !== 'admin') {
      return { success: false, error: 'Unauthorized access' };
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

