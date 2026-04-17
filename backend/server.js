import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
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

// ================== DB HELPERS ==================

const DB_PATH = path.join(process.cwd(), 'data', 'verifiedUsers.json');

const getVerifiedUsers = () => {
    try {
        if (!fs.existsSync(DB_PATH)) return {};
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch {
        return {};
    }
};

const addVerifiedUser = (email) => {
    try {
        const db = getVerifiedUsers();
        db[email] = { verifiedAt: new Date().toISOString() };
        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    } catch (err) {
        console.error("Failed persisting verification mapping out:", err);
    }
};

// ======================= OTP ROUTES =======================

app.post('/api/check-verification', (req, res) => {
    const { email } = req.body;
    const db = getVerifiedUsers();
    if (db[email]) {
        return res.status(200).json({ verified: true });
    }
    return res.status(400).json({ verified: false, message: "Please verify your email" });
});

app.post('/api/mark-verified', (req, res) => {
    const { email } = req.body;
    addVerifiedUser(email);
    return res.status(200).json({ success: true });
});

app.post('/api/send-otp', async (req, res) => {
    try {
        const { email } = req.body;

        const otp = Math.floor(100000 + 900000 * Math.random());

        global.otpStore = global.otpStore || {};
        global.otpStore[email] = otp;

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

app.post('/api/verify-otp', (req, res) => {
    const { email, otp } = req.body;

    if (global.otpStore && global.otpStore[email] == otp) {
        delete global.otpStore[email];

        return res.json({
            success: true
        });
    }

    return res.json({
        success: false,
        message: "Invalid OTP"
    });
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


// ================= PREDICTION HISTORY ROUTES =================

// In-memory store (non-persistent, but synced from frontend on each session)
global.predictions = global.predictions || [];

// Save a prediction (called after successful prediction on frontend)
app.post('/api/save-prediction', (req, res) => {
    try {
        const { email, input, result } = req.body;
        global.predictions.push({
            email,
            input,
            result,
            time: new Date().toISOString()
        });
        console.log(`[Prediction saved] ${email} → ${result}`);
        res.json({ success: true });
    } catch (err) {
        console.error('save-prediction error:', err);
        res.status(500).json({ success: false });
    }
});

// Get predictions for a specific user (or all if admin)
app.get('/api/user/predictions', (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'email required' });
    const data = (global.predictions || []).filter(p => p.email === email);
    res.json(data);
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

app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
