// server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const cors = require('cors');


// Initialize Twilio and SendGrid
const twilioClient = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const app = express();
app.use(bodyParser.json());
app.use(cors())

// Generate a random OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP via SMS
app.post('/api/send-sms', (req, res) => {
    const { phoneNumber } = req.body;
    const otp = generateOTP();

    twilioClient.messages
        .create({
            body: `Your OTP is ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber,
        })
        .then(message => res.status(200).json({ success: true, message: 'OTP sent via SMS!', otp }))
        .catch(err => res.status(500).json({ success: false, message: 'Failed to send SMS', error: err.message }));
});


// Start the server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`SMS Server(Twilio) running on port ${PORT}`));
