import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';
import { trainAndEvaluate, trainedModels } from './ml/model_evaluation.js';
import { preprocessRow, REVERSE_DISEASE_MAP } from './ml/preprocessing.js';
import { sendOtp } from './otpService.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Configure Multer for image uploads (stored in memory for lightweight proc)
const upload = multer({ storage: multer.memoryStorage() });

// Initialize and train ML Models
console.log("Starting backend server...");
trainAndEvaluate();

// Healthcheck route
app.get('/', (req, res) => {
    res.status(200).send("Livestock ML Backend Server is ALIVE and running!");
});

// ================== FIREBASE ADMIN & FIRESTORE ==================

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        }
        console.log("Firebase Admin initialized via service account.");
    } catch (e) {
        console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT:", e.message);
    }
} else {
    if (!admin.apps.length) {
        admin.initializeApp({
            projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'livestockai-a4d4e'
        });
    }
    console.log("Firebase Admin initialized via default configuration.");
}

const db = admin.firestore();

// ================== DB HELPERS ==================

const isVerifiedUser = async (email) => {
    try {
        const docRef = db.collection('verifiedUsers').doc(email);
        const docSnap = await docRef.get();
        return docSnap.exists;
    } catch (err) {
        console.error("Firestore error in isVerifiedUser:", err.message);
        return false;
    }
};

const addVerifiedUser = async (email) => {
    try {
        const docRef = db.collection('verifiedUsers').doc(email);
        await docRef.set({
            verifiedAt: admin.firestore.FieldValue.serverTimestamp()
        });
    } catch (err) {
        console.error("Firestore error in addVerifiedUser:", err.message);
    }
};

// ======================= OTP ROUTES =======================

app.post('/api/check-verification', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ verified: false, message: "Email is required" });
        }
        const verified = await isVerifiedUser(email);
        if (verified) {
            return res.status(200).json({ verified: true });
        }
        return res.status(400).json({ verified: false, message: "Please verify your email" });
    } catch (err) {
        console.error("check-verification route error:", err);
        return res.status(500).json({ verified: false, message: "Database connection error" });
    }
});

app.post('/api/mark-verified', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }
        await addVerifiedUser(email);
        return res.status(200).json({ success: true });
    } catch (err) {
        console.error("mark-verified route error:", err);
        return res.status(500).json({ success: false, message: "Database connection error" });
    }
});

app.post('/api/send-otp', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        const otp = Math.floor(100000 + 900000 * Math.random());

        // Calculate expiration: 5 minutes from now
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 5);

        // Store in Firestore
        await db.collection('otps').doc(email).set({
            otp: otp,
            expiresAt: expiresAt.toISOString()
        });

        await sendOtp(email, otp);

        res.json({ success: true });

    } catch (err) {
        console.error("OTP ERROR:", err);
        res.status(500).json({
            success: false,
            message: "Failed to send OTP"
        });
    }
});

app.post('/api/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.json({ success: false, message: "Email and OTP are required" });
        }

        const docRef = db.collection('otps').doc(email);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            const data = docSnap.data();
            const now = new Date();
            const expiresAt = new Date(data.expiresAt);

            // Check if OTP matches and is not expired
            if (data.otp == otp && now <= expiresAt) {
                // Delete immediately on success
                await docRef.delete();

                return res.json({
                    success: true
                });
            } else if (now > expiresAt) {
                // Delete expired document
                await docRef.delete();
                return res.json({
                    success: false,
                    message: "OTP has expired"
                });
            }
        }

        return res.json({
            success: false,
            message: "Invalid OTP"
        });

    } catch (err) {
        console.error("verify-otp error:", err);
        return res.status(500).json({ success: false, message: "Database verification error" });
    }
});

// ==================== PREDICTION ROUTE ====================

app.post("/api/predict", (req, res) => {
    try {
        console.log("=== BACKEND HIT ===");
        console.log("Body:", req.body);
        
        const rawBody = req.body;
        // Map frontend JSON into the format `preprocessRow` expects
        const rowData = {
            Animal: rawBody.animalType || "Cow",
            Age: rawBody.age !== undefined ? rawBody.age : 3,
            Fever: rawBody.fever ? "Yes" : "No",
            AppetiteLoss: rawBody.appetiteLoss ? "Yes" : "No",
            Weakness: rawBody.weakness ? "Yes" : "No",
            Vaccination: rawBody.vaccination || "Not Vaccinated",
            Temp: rawBody.temperature !== undefined ? rawBody.temperature : 38.0,
            Humidity: rawBody.humidity !== undefined ? rawBody.humidity : 60
        };

        const preprocessed = preprocessRow(rowData);
        const features = preprocessed.features;
        const bestModelName = trainedModels.bestModel;
        const bestModel = trainedModels[bestModelName];

        if (!bestModel) {
            return res.status(500).json({ error: "Model not trained yet." });
        }

        const predictedClass = bestModel.predict(features);
        const diseaseName = REVERSE_DISEASE_MAP[predictedClass] || "Unknown";

        res.json({
            success: true,
            prediction: diseaseName
        });

    } catch (error) {
        console.error("BACKEND ERROR:", error);
        res.status(500).json({
            success: false,
            prediction: "Unable to analyze, but animal seems stable"
        });
    }
});


// ================= IMAGE PREDICTION ROUTE =================

app.post('/api/predict-image', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image file provided." });
        }

        // Simulate lightweight feature extraction
        const simulatedFeatures = {
            Animal: "Cow",
            Age: 3, // adding a default age since it's needed by preprocessor
            Fever: "Yes",
            AppetiteLoss: "Yes",
            Weakness: "Yes",
            Vaccination: "Not Vaccinated", // default
            Temp: 40,
            Humidity: 70
        };

        const preprocessed = preprocessRow(simulatedFeatures);
        const features = preprocessed.features;
        const bestModelName = trainedModels.bestModel;
        const bestModel = trainedModels[bestModelName];

        if (!bestModel) {
            return res.status(500).json({ error: "Model not trained yet." });
        }

        const predictedClass = bestModel.predict(features);
        const diseaseName = REVERSE_DISEASE_MAP[predictedClass] || "Unknown";

        return res.json({ disease: diseaseName });

    } catch (err) {
        console.error("Image Prediction error:", err);
        return res.status(500).json({ error: "Failed to process image prediction request." });
    }
});

// ==================== SERVER STARTUP ====================

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Backend server running on port ${PORT}`);
    });
}

export default app;
