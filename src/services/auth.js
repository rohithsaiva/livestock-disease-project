// src/services/auth.js
// Mock Authentication and Database Service using localStorage

const USERS_KEY = 'livestock_users';
const CURRENT_USER_KEY = 'livestock_current_user';

// Initialize default admin if not exists
const initializeDB = () => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
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
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
};

initializeDB();

export const authService = {
  // Login user
  login: (email, password) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Update last login
      user.lastLogin = new Date().toISOString();
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      
      // Don't store password in "session"
      const { password: _, ...userInfo } = user;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userInfo));
      return { success: true, user: userInfo };
    }
    return { success: false, error: 'Invalid email or password' };
  },

  // Register new user
  register: (userData) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    
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
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    const { password, ...userInfo } = newUser;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userInfo));
    
    return { success: true, user: userInfo };
  },

  // Get currently logged in user
  getCurrentUser: () => {
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  // Logout
  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // ================= ADMIN FUNCTIONS ================= //
  
  // Get all users
  getAllUsers: () => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return { success: false, error: 'Unauthorized access' };
    }
    
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
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

    let users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const initialLength = users.length;
    users = users.filter(u => u.id !== userId);
    
    if (users.length === initialLength) {
       return { success: false, error: 'User not found' };
    }

    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return { success: true };
  }
};
