// theme toggle section
const themeCheckbox = document.getElementById('theme-checkbox');
const body = document.body;

themeCheckbox.addEventListener('change', () => {
    body.classList.toggle('light-mode');
    localStorage.setItem('theme', body.classList.contains('light-mode') ? 'light' : 'dark');
});

// Load saved theme
if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light-mode');
    themeCheckbox.checked = true;
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

// Intersection Observer for scroll animations

const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Wait for hero to finish first
setTimeout(() => {
    document.querySelectorAll('[class*="slide-in-left"]').forEach(el => {
        observer.observe(el);
    });
    
    document.querySelectorAll('[class*="fade-up"]').forEach(el => {
        observer.observe(el);
    });
	
    document.querySelectorAll('.zoom-in').forEach(el => {
        observer.observe(el);
    });
}, 800);

// Intersection Observer for scroll animations END

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

// Page load animation - 0.8s delay then fade in hero content
window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelector('#hero h1').classList.add('fade-in-up');
        document.querySelector('#hero h2').classList.add('fade-in-up');
        document.querySelector('#hero .links').classList.add('fade-in-up');
    }, 250);
});



// ====================================================
// PARTICLE BACKGROUND — fade in/out style
// ====================================================

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.prepend(canvas);

canvas.width = window.innerWidth;
canvas.height = document.documentElement.scrollHeight;
canvas.style.position = 'absolute';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.zIndex = '-1';
canvas.style.pointerEvents = 'none';

const particles = [];

function getParticleCount() {
    if (window.innerWidth < 480) return 20;
    if (window.innerWidth < 768) return 30;
    if (window.innerWidth < 1024) return 40;
    return 55;
}

class Particle {
    constructor(randomAge = false) {
        this.reset(randomAge);
    }

    reset(randomAge = false) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() < 0.5
            ? Math.random() * 20 + 5          // small (5–25)
            : Math.random() * 70 + 30;         // large (30–100)

        // Each particle has its own max opacity
        this.maxOpacity = Math.random() * 0.5 + 0.35; // 0.35–0.85
        this.opacity = 0;

        // Total lifetime in frames, random so they don't sync up
        this.lifetime = Math.random() * 600 + 400;   // 400–1000 frames (~7–17s)
        this.fadeFrames = Math.random() * 120 + 80;  // 80–200 frames to fade in/out

        // If randomAge, start at a random point in the lifecycle so
        // the canvas doesn't look empty on load
        this.age = randomAge ? Math.random() * this.lifetime : 0;

        // Gentle drift — larger particles move slower
        const speed = (0.25 / (this.size / 20)) * (Math.random() + 0.2);
        const angle = Math.random() * Math.PI * 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
    }

    update() {
        this.age++;

        // Fade in
        if (this.age < this.fadeFrames) {
            this.opacity = (this.age / this.fadeFrames) * this.maxOpacity;
        }
        // Fully visible middle section
        else if (this.age < this.lifetime - this.fadeFrames) {
            this.opacity = this.maxOpacity;
        }
        // Fade out
        else if (this.age < this.lifetime) {
            const remaining = this.lifetime - this.age;
            this.opacity = (remaining / this.fadeFrames) * this.maxOpacity;
        }
        // Dead — reset in a new random position
        else {
            this.reset(false);
            return;
        }

        this.x += this.vx;
        this.y += this.vy;

        // Soft wrap with size buffer
        if (this.x > canvas.width  + this.size) this.x = -this.size;
        if (this.x < -this.size)                this.x = canvas.width  + this.size;
        if (this.y > canvas.height + this.size) this.y = -this.size;
        if (this.y < -this.size)                this.y = canvas.height + this.size;
    }

    draw() {
        const isLight = document.body.classList.contains('light-mode');
        const color = isLight ? `255, 255, 255` : `49, 49, 49`;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${this.opacity})`;
        ctx.fill();
    }
}

function init() {
    particles.length = 0;
    const count = getParticleCount();
    for (let i = 0; i < count; i++) {
        particles.push(new Particle(true)); // true = random starting age
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
}

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        canvas.width  = window.innerWidth;
        canvas.height = document.documentElement.scrollHeight;
        init();
    }, 250);
});

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) animate();
});

init();
animate();