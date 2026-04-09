/**
 * LivestockAI Authentication & Core Data Service
 * Centralized service for user authentication, registration, session tracking,
 * and data management (interactions, storage, etc.)
 */

import { userStorage } from '../data/userStorage';
import { loginHistoryStorage } from '../data/loginHistory';
import { projectDataStorage } from '../data/projectDataStorage';
import { commentsStorage } from '../data/commentsStorage';

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
    const users = userStorage.getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      // Update last login
      user.lastLogin = new Date().toISOString();
      userStorage.saveUsers(users);

      // Don't store password in "session"
      const { password: _, ...userInfo } = user;
      userStorage.setCurrentUser(userInfo);

      if (user.role !== 'admin') {
        loginHistoryStorage.recordLogin(userInfo);
      }

      return { success: true, user: userInfo };
    }
    return { success: false, error: 'Invalid email or password' };
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

  // Get currently logged in user
  getCurrentUser: () => {
    return userStorage.getCurrentUser();
  },

  // Logout
  logout: () => {
    loginHistoryStorage.recordLogout();
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

