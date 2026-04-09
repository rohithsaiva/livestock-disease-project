// src/data/userStorage.js
// This file manages the storage and retrieval of registered users.
const USERS_KEY = 'livestock_users';
const CURRENT_USER_KEY = 'livestock_current_user';

/**
 * User Storage
 * Handles persistence and retrieval of user accounts in localStorage.
 * Ensures unique IDs and basic account metadata management.
 */
export const userStorage = {
    getUsers: () => JSON.parse(localStorage.getItem(USERS_KEY) || '[]'),
    saveUsers: (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users)),
    getCurrentUser: () => {
        const userStr = localStorage.getItem(CURRENT_USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    },
    setCurrentUser: (user) => localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user)),
    removeCurrentUser: () => localStorage.removeItem(CURRENT_USER_KEY)
};
