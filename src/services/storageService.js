/**
 * Centralized Local Storage Service
 * Provides a clean interface for persisting application data.
 */

export const storageService = {
    /**
     * Save data to localStorage
     */
    save: (key, data) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Error saving to localStorage', e);
            return false;
        }
    },

    /**
     * Fetch data from localStorage
     */
    get: (key) => {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error reading from localStorage', e);
            return null;
        }
    },

    /**
     * Remove data from localStorage
     */
    remove: (key) => {
        localStorage.removeItem(key);
    },

    /**
     * Clear all app-specific data (optional)
     */
    clear: () => {
        // We only clear our specific keys to avoid nuking other data
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('livestock_')) {
                localStorage.removeItem(key);
            }
        });
    }
};
