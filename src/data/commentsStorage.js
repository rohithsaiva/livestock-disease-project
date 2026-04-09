// src/data/commentsStorage.js
// This file stores messages from the Get in Touch form.
const MESSAGES_KEY = 'livestock_messages';

export const commentsStorage = {
    getMessages: () => JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]'),

    saveMessages: (messages) => localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages)),

    addMessage: (messageData, user) => {
        const messages = commentsStorage.getMessages();
        const userType = user ? 'registered_user' : 'guest_user';

        const finalData = {
            id: `msg-${Date.now()}`,
            ...messageData,
            userType,
            date: new Date().toISOString()
        };

        messages.push(finalData);
        commentsStorage.saveMessages(messages);
        return finalData;
    },

    deleteMessage: (messageId) => {
        let messages = commentsStorage.getMessages();
        const initialLength = messages.length;
        messages = messages.filter(m => m.id !== messageId);

        if (messages.length === initialLength) return false;

        commentsStorage.saveMessages(messages);
        return true;
    }
};
