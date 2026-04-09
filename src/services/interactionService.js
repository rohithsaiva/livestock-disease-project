/**
 * Interaction Service
 * Manages user predictions, alerts, and historical data.
 */
import { projectDataStorage } from '../data/projectDataStorage';
import { authService } from './auth';

export const interactionService = {
    /**
     * Records a user interaction (e.g. disease prediction)
     */
    recordPrediction: (formData) => {
        const user = authService.getCurrentUser();
        if (!user) return { success: false, error: 'User not authenticated' };

        const interaction = projectDataStorage.addInteraction('disease_prediction', formData, user);
        return { success: true, interaction };
    },

    /**
     * Fetches health alerts for the current user
     * Returns records with status 'Pending' or flagged by AI.
     */
    getRecentAlerts: (limit = 3) => {
        const result = authService.getUserInteractions();
        if (!result.success) return [];

        return result.interactions
            .filter(i => i.type === 'disease_prediction')
            .slice(0, limit);
    },

    /**
     * Validates prediction input data
     */
    validatePredictionInput: (data) => {
        if (!data.animalType || !data.age || !data.temperature || !data.humidity) {
            return { isValid: false, error: 'Please fill in all required fields.' };
        }
        return { isValid: true };
    }
};
