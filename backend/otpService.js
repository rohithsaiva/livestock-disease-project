import nodemailer from 'nodemailer';

// Secure in-memory OTP Tracker constrained tightly with time bounds and attempt guards
const otpStore = new Map();

// Initialize the Nodemailer transporter exclusively executing using standard Gmail routing
// Evaluates strictly off the local environment mapped bounds
const createTransporter = () => nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export async function sendOtp(email) {
    if (!email) throw new Error("Email is required");

    // Dynamic 6-digit natively-randomized sequence
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 10 * 60 * 1000; // Strictly enforced 10 minutes bounds

    const record = otpStore.get(email);
    const attempts = record ? record.attempts : 0;

    otpStore.set(email, { otp, expiry, attempts });

    try {
        const transporter = createTransporter();
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'LivestockAI Dashboard - Secure Authorization',
            text: `Your One-Time Password (OTP) authorization sequence is: ${otp}. \n\nThis payload strictly expires locally within 10 minutes. Do not share this sequence natively.`
        });
        
        console.log(`[SMTP DISPATCH SUCCESS] Real OTP natively dispatched cleanly to ${email}`);
        
        // Strict Generic Execution returning string strictly per Rules Constraints avoiding exposure
        return { success: true, message: "OTP sent successfully" };
    } catch (error) {
        console.error("Nodemailer SMTP Route Blocked/Failed strictly handled:", error.message);
        // Expose strict Generic fallbacks structurally preventing routing enumeration natively
        return { success: false, error: "OTP sent successfully" }; 
    }
}

export function verifyOtp(email, otp) {
    if (!email || !otp) return { success: false, error: "Invalid credentials." };

    const record = otpStore.get(email);
    if (!record) return { success: false, error: "Invalid credentials." };

    // Standard Max 3 attempts bound structurally preventing spoofing arrays locally
    if (record.attempts >= 3) {
        otpStore.delete(email);
        return { success: false, error: "Maximum attempts breached. Please request a new OTP natively." };
    }

    if (Date.now() > record.expiry) {
        otpStore.delete(email);
        return { success: false, error: "Expired request." };
    }

    if (record.otp === otp) {
        otpStore.delete(email); // Consumed permanently executing natively preventing replay attacks
        return { success: true, message: "Verification completed securely." };
    } else {
        // Increment attempts tracker directly securely checking iterations limit
        record.attempts += 1;
        otpStore.set(email, record);
        
        if (record.attempts >= 3) {
            otpStore.delete(email);
            return { success: false, error: "Maximum attempts breached. Please request a new OTP natively." };
        }
        
        return { success: false, error: "Invalid credentials." };
    }
}
