/**
 * Shared validation logic for application forms
 * Used for login, signup, and data input validation.
 */

export const validators = {
    /**
     * Validates if a string is a valid Gmail address
     * @param {string} email 
     * @returns {boolean}
     */
    isGmail: (email) => {
        return typeof email === 'string' && email.toLowerCase().endsWith('@gmail.com');
    },

    /**
     * Validates if a string is a 10-digit phone number
     * @param {string} phone 
     * @returns {boolean}
     */
    isPhoneNumber: (phone) => {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone);
    },

    /**
     * Checks if a field is empty
     * @param {string} val 
     * @returns {boolean}
     */
    isEmpty: (val) => {
        return !val || val.trim().length === 0;
    }
};
