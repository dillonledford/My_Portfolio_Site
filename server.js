const express = require('express');
const { Resend } = require('resend');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const resend = new Resend(process.env.RESEND_API_KEY);

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
    try {
        await resend.emails.send({
            from: 'contact@dillonledford.com',
            to: 'contact@dillonledford.com',
            subject: `Contact: ${name} (${email})`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Keep Render alive - ping every 14 minutes
function keepAlive() {
    if (process.env.NODE_ENV !== 'development') {
        setTimeout(() => {
            setInterval(() => {
                try {
                    axios.get('https://dillonledford.com/');
                } catch (error) {
                    // Ignore errors
                }
            }, 14 * 60 * 1000);
        }, 30000);
    }
}

keepAlive();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});