// src/data/projectDataStorage.js
// This file stores disease prediction submissions.
const INTERACTIONS_KEY = 'livestock_interactions';

/**
 * Project Data Storage
 * Handles the storage of AI model interactions, disease predictions, 
 * and clinician-level logs for the livestock platform.
 */
export const projectDataStorage = {
    getInteractions: () => JSON.parse(localStorage.getItem(INTERACTIONS_KEY) || '[]'),

    saveInteractions: (interactions) => localStorage.setItem(INTERACTIONS_KEY, JSON.stringify(interactions)),

    addInteraction: (type, details, user) => {
        const interactions = projectDataStorage.getInteractions();

        // As per SECTION 3, we add user phone number to the recorded project data
        const newInteraction = {
            id: `int-${Date.now()}`,
            userId: user.id,
            userName: user.name,
            userEmail: user.email,
            userPhone: user.phone || 'N/A',
            type,
            details,
            date: new Date().toISOString()
        };

        interactions.push(newInteraction);
        projectDataStorage.saveInteractions(interactions);
        return newInteraction;
    },

    deleteInteraction: (interactionId) => {
        let interactions = projectDataStorage.getInteractions();
        const initialLength = interactions.length;
        interactions = interactions.filter(i => i.id !== interactionId);

        if (interactions.length === initialLength) return false;

        projectDataStorage.saveInteractions(interactions);
        return true;
    }
};
