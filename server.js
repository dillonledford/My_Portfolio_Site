const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    const { name, email, message, captchaToken } = req.body;

    // Verify reCAPTCHA
    try {
        const captchaResponse = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify`,
            null,
            {
                params: {
                    secret: process.env.RECAPTCHA_SECRET,
                    response: captchaToken
                }
            }
        );

        if (!captchaResponse.data.success) {
            return res.status(400).json({ error: 'Captcha verification failed' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Captcha verification error' });
    }

    // Send email
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `Portfolio Contact: ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true });
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Keep Render Site Alive - No Spindown --- Script Start ---

function keepAlive() {
    if (process.env.NODE_ENV !== 'development') {
        setTimeout(() => {
            setInterval(() => {
                try {
                    axios.get('https://dillonledford.com/');
                } catch (error) {
                    // Ignore errors
                }
            }, 14 * 60 * 1000); // ping every 14 minutes
        }, 30000); // wait 30 seconds for server to start
    }
}

keepAlive();

// Keep Render Site Alive - No Spindown --- Script End ---

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
