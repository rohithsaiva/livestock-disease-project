import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

console.log("Using User:", process.env.EMAIL_USER);
console.log("Using Pass:", process.env.EMAIL_PASS ? "****" : "MISSING");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function testEmail() {
    try {
        console.log("Attempting to send test email...");
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to self
            subject: 'OTP Test',
            text: 'If you see this, your email configuration is working!'
        });
        console.log("Email sent successfully!");
        console.log("Message ID:", info.messageId);
    } catch (error) {
        console.error("FAILED to send email:");
        console.error(error);
    }
}

testEmail();
