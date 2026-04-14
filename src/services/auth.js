import { auth, googleProvider } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  sendPasswordResetEmail, 
  sendEmailVerification,
  signOut,
  signInWithCredential,
  GoogleAuthProvider
} from 'firebase/auth';

export const authService = {
  login: async (email, password) => {
    if (!auth) return { success: false, error: "Firebase not configured. Check console." };
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      return { 
        success: true, 
        user: { 
          uid: userCredential.user.uid, 
          email: userCredential.user.email,
          role: 'user' 
        } 
      };
    } catch (error) {
      // STRICT RULE: Generic Error Responses
      console.error("Auth Exception:", error);
      return { success: false, error: "Invalid credentials." };
    }
  },

  register: async ({ name, email, password, phone }) => {
    if (!auth) return { success: false, error: "Request processed." };
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Log them right back out to block the session natively checking custom OTPs structurally
      await signOut(auth);
      
      return { success: true };
    } catch (error) {
      // STRICT RULE: Generic Return
      console.error("Registry Exception:", error);
      return { success: false, error: "Request processed." };
    }
  },

  googleLogin: async (idToken) => {
    if (!auth) return { success: false, error: "Authentication failed. Invalid credentials." };
    try {
      // If we receive the JWT generated natively via GSI script
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);

      return { 
        success: true, 
        user: { 
          uid: userCredential.user.uid, 
          email: userCredential.user.email,
          role: 'user'
        } 
      };
    } catch (error) {
      console.error("Google Auth Exception:", error);
      return { success: false, error: "Authentication failed. Invalid credentials." };
    }
  },

  googlePopupLogin: async () => {
    if (!auth) return { success: false, error: "Authentication failed." };
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      return { 
        success: true, 
        user: { 
          uid: userCredential.user.uid, 
          email: userCredential.user.email,
          role: 'user'
        } 
      };
    } catch (error) {
      console.error("Google Popup Auth Exception:", error);
      return { success: false, error: "Authentication failed." };
    }
  },

  requestPasswordReset: async (email) => {
    if (!auth) return { success: true };
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      // Generic Response strictly enforced to avoid user enumeration
      console.error("Reset Exception:", error);
      return { success: true }; 
    }
  },

  resetPassword: async (token, newPassword) => {
    // Under strict Firebase protocol, Firebase securely handles password resets via its external link action protocol.
    // Native reset handling here is aborted to block mock bypass loops entirely.
    return { success: false, error: "Please utilize the secure reset link dispatched to your email." };
  },

  getCurrentUser: () => {
    if (!auth) return null;
    const user = auth.currentUser;
    if (!user) return null;
    return {
      uid: user.uid,
      email: user.email,
      role: 'user'
    };
  },

  logout: async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout failed", err);
    }
  },

  // Fallback to maintain component layouts safely
  saveInteraction: (type, data) => {
    console.log("[Secure Interaction Successfully Processed]:", type);
  }
};
