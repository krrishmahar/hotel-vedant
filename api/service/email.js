// server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors()); // CORRECTED: Added parentheses

// Generate a random OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Configure Brevo (Sendinblue) SMTP
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_SERVER,
    port: process.env.MAIL_PORT,
    secure: false, // use TLS
    auth: {
        user: process.env.MAIL_USERNAME, // Brevo SMTP username
        pass: process.env.MAIL_PASSWORD, // Brevo SMTP password
    },
    tls: {
        rejectUnauthorized: false
    },
    debug: true,
});

// Send OTP via Email
app.post('/api/send-email', (req, res) => {
    const { email } = req.body;
    const otp = generateOTP();

    const mailOptions = {
        from: process.env.MAIL_SENDER, // Sender email from your domain
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ success: false, message: 'Failed to send Email', error: error.message });
        }
        res.status(200).json({ success: true, message: 'OTP sent via Email!', otp });
    });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Mail Server (Brevo) running on port ${PORT}`));
