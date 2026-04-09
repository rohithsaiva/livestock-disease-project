/**
 * Utility functions for date and time formatting
 * This file helps in maintaining a consistent date format throughout the application.
 */

export const dateFormatter = {
    /**
     * Formats a date string or timestamp into a readable date
     * @param {string|number} dateVal 
     * @returns {string} - e.g. "March 10, 2026"
     */
    formatLongDate: (dateVal) => {
        if (!dateVal) return 'N/A';
        const date = new Date(dateVal);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    },

    /**
     * Formats a date string or timestamp into a short date
     * @param {string|number} dateVal 
     * @returns {string} - e.g. "Mar 10, 2026"
     */
    formatShortDate: (dateVal) => {
        if (!dateVal) return 'N/A';
        const date = new Date(dateVal);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    },

    /**
     * Formats a date string or timestamp into a readable time
     * @param {string|number} dateVal 
     * @returns {string} - e.g. "10:30 AM"
     */
    formatTime: (dateVal) => {
        if (!dateVal) return 'N/A';
        const date = new Date(dateVal);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    /**
     * Calculates a relative "time ago" string
     * @param {string|number} dateVal 
     * @returns {string}
     */
    formatTimeAgo: (dateVal) => {
        if (!dateVal) return '';
        const diffHour = Math.floor((new Date() - new Date(dateVal)) / (1000 * 60 * 60));
        if (diffHour < 1) return 'Just now';
        if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
        const diffDay = Math.floor(diffHour / 24);
        return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    }
};
