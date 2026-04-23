// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    localStorage.setItem('theme', body.classList.contains('light-mode') ? 'light' : 'dark');
});

// Load saved theme
if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light-mode');
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Contact form
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const captchaToken = grecaptcha.getResponse();
    
    if (!captchaToken) {
        formStatus.textContent = 'Please complete the captcha';
        return;
    }

    const formData = {
        name: e.target.name.value,
        email: e.target.email.value,
        message: e.target.message.value,
        captchaToken: captchaToken
    };

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            formStatus.textContent = 'Message sent successfully!';
            contactForm.reset();
            grecaptcha.reset();
        } else {
            formStatus.textContent = 'Failed to send message. Please try again.';
        }
    } catch (error) {
        formStatus.textContent = 'Error sending message. Please try again.';
    }
});