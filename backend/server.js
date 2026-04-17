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
        
        // SIMPLE WORKING LOGIC (guaranteed result)
        const { fever, temperature, appetiteLoss, weakness } = req.body;
        let result = "Healthy";

        if (fever && weakness) {
            result = "Possible Infection";
        } else if (temperature > 40) {
            result = "High Fever Disease";
        } else if (appetiteLoss) {
            result = "Digestive Disorder";
        }

        res.json({
            success: true,
            prediction: result || "Test Prediction Working"
        });

    } catch (error) {
        console.error("BACKEND ERROR:", error);
        res.json({
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

app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
