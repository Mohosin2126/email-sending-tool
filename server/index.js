const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const PORT = 3000;

// Configuration
const CLIENT_ID = process.env.VITE_CLIENT_ID;
const CLIENT_SECRET = process.env.VITE_CLIENT_SECRET;
const REDIRECT_URI = process.env.VITE_REDIRECT_URI;
const REFRESH_TOKEN = process.env.VITE_REFRESH_TOKEN;
const EMAIL_USER = process.env.VITE_EMAIL_USER;

// Gmail API authentication and setup
async function getOAuth2Client() {
    const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
    return oAuth2Client;
}

// Function to send email using Gmail API
async function sendEmail(emailData) {
    try {
        const oAuth2Client = await getOAuth2Client();
        const accessToken = await oAuth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: EMAIL_USER,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken.token
            }
        });

        const mailOptions = {
            from: `SENDER_NAME <${EMAIL_USER}>`,
            to: emailData.to,
            subject: emailData.subject,
            text: emailData.body,
            html: emailData.html
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent:', result);
        return result;
    } catch (error) {
        console.error('Error in sendEmail:', error);
        throw error;
    }
}

// Route to handle email sending
app.post('/send-email', async (req, res) => {
    try {
        const { to, subject, body, html } = req.body;
        const emailData = { to, subject, body, html };
        const result = await sendEmail(emailData);
        res.status(200).json({ message: 'Email sent successfully!', result });
    } catch (error) {
        console.error('Error occurred while sending email:', error);
        res.status(500).json({ message: 'Error sending email', error: error.message });
    }
});

// Route to generate authorization URL
app.get('/auth-url', (req, res) => {
    const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/gmail.send']
    });
    res.status(200).json({ authUrl });
});

// Route to handle token exchange
app.get('/auth/callback', async (req, res) => {
    const code = req.query.code;
    if (!code) {
        return res.status(400).send('No code provided');
    }

    const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);

        if (tokens.refresh_token) {
            console.log("Refresh Token:", tokens.refresh_token);
            // Save the refresh token securely, e.g., in your database
        }

        res.status(200).send('Authentication successful. You can now close this window.');
    } catch (error) {
        console.error('Error exchanging token:', error);
        res.status(500).send('Error exchanging token');
    }
});

// Checking if the server is running
app.get("/", (req, res) => {
    res.status(200).send("Mailer is running!");
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
