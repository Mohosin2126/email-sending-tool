// Import necessary modules
const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const nodemailer = require('nodemailer');

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies

// Configuration (Replace with your actual values)
const CLIENT_ID = 'your-client-id';
const CLIENT_SECRET = 'your-client-secret';
const REDIRECT_URI = 'your-redirect-uri';
const REFRESH_TOKEN = 'your-refresh-token';

// Gmail API authentication and setup
async function getOAuth2Client() {
    const oAuth2Client = new google.auth.OAuth2(
        CLIENT_ID, CLIENT_SECRET, REDIRECT_URI
    );
    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
    return oAuth2Client;
}

// Function to send email using Gmail API
async function sendEmail(emailData) {
    const oAuth2Client = await getOAuth2Client();
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: 'your-email@gmail.com',
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken.token
        }
    });

    const mailOptions = {
        from: 'SENDER_NAME <your-email@gmail.com>',
        to: emailData.to,
        subject: emailData.subject,
        text: emailData.body,
        html: emailData.html
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
}

// Route to handle email sending
app.post('/send-email', async (req, res) => {
    try {
        const { to, subject, body, html } = req.body;
        const emailData = { to, subject, body, html };
        const result = await sendEmail(emailData);
        res.status(200).json({ message: 'Email sent successfully!', result });
    } catch (error) {
        res.status(500).json({ message: 'Error sending email', error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
