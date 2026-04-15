import nodemailer from 'nodemailer';

// Secure in-memory OTP Tracker constrained tightly with time bounds and attempt guards
const otpStore = new Map();

// Initialize the Nodemailer transporter exactly once
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export async function sendOtp(email) {
    if (!email) throw new Error("Email is required");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 10 * 60 * 1000;

    const record = otpStore.get(email);
    const attempts = record ? record.attempts : 0;

    otpStore.set(email, { otp, expiry, attempts });

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP is ${otp}`
        });
        
        console.log("OTP sent to:", email);
        return { success: true, message: "OTP sent successfully" };
    } catch (error) {
        console.error("Email send failed:", error);
        return { success: false, error: "Failed to send email. Please check server email config." }; 
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
