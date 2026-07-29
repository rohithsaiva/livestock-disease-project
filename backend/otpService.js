import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

// Initialize the Nodemailer transporter exactly once
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export async function sendOtp(email, otp) {
    const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is ${otp}`
    });

    console.log("OTP sent:", info.response);
    return true;
}
