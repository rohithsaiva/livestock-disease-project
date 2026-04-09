// src/data/loginHistory.js
// This file manages login history storage for the admin dashboard.
const HISTORY_KEY = 'livestock_login_history';

/**
 * Login History Storage
 * Manages the recording of user login/logout sessions for admin auditing.
 * Stores timestamps and associated user metadata.
 */
export const loginHistoryStorage = {
    getHistory: () => JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'),

    saveHistory: (history) => localStorage.setItem(HISTORY_KEY, JSON.stringify(history)),

    recordLogin: (user) => {
        if (user.role === 'admin') return;
        const history = loginHistoryStorage.getHistory();
        const sessionId = `session-${Date.now()}`;
        const date = new Date();

        // We store date separately for easy viewing in Admin Dash
        history.push({
            sessionId,
            userId: user.id,
            userName: user.name,
            userEmail: user.email,
            loginDate: date.toLocaleDateString(),
            loginTime: date.toLocaleTimeString(),
            logoutTime: null,
            timestamp: date.getTime()
        });

        // Also save sessionId to current user locally so logout can target it
        localStorage.setItem('livestock_current_session', sessionId);
        loginHistoryStorage.saveHistory(history);
    },

    recordLogout: () => {
        const sessionId = localStorage.getItem('livestock_current_session');
        if (!sessionId) return;

        const history = loginHistoryStorage.getHistory();
        const sessionIndex = history.findIndex(h => h.sessionId === sessionId);
        if (sessionIndex !== -1) {
            const date = new Date();
            history[sessionIndex].logoutTime = date.toLocaleTimeString();
            loginHistoryStorage.saveHistory(history);
        }
        localStorage.removeItem('livestock_current_session');
    }
};
