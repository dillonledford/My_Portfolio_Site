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
            headers: { 'Content-Type': 'application/json' },
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

// Page load animation
window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelector('#hero h1').classList.add('fade-in-up');
        document.querySelector('#hero h2').classList.add('fade-in-up');
        document.querySelector('#hero .links').classList.add('fade-in-up');
    }, 250);
});


// ====================================================
// FLOWING CODE TOKENS BACKGROUND
// ====================================================

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.prepend(canvas);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.zIndex = '-1';
canvas.style.pointerEvents = 'none';

// Token pool — mix of syntax, keywords, symbols
const tokens = [
    // keywords
    'const', 'let', 'var', 'return', 'function', 'class', 'new',
    'if', 'else', 'for', 'while', 'import', 'export', 'default',
    'async', 'await', 'try', 'catch', 'null', 'true', 'false',
    // symbols / operators
    '=>', '{}', '[]', '()', '===', '!==', '&&', '||', '??',
    '++', '--', '...', '::', '->', '/*', '*/', '//',
    // values / snippets
    '0x1F', '404', 'NaN', 'undefined', '#ff0', '0b1010',
    'git', 'push', 'npm', 'sudo', 'chmod', 'ssh',
    '<div>', '</div>', '</>','{ }', '[ ]',
];

function getParticleCount() {
    if (window.innerWidth < 480) return 25;
    if (window.innerWidth < 768) return 40;
    if (window.innerWidth < 1024) return 55;
    return 70;
}

class CodeToken {
    constructor() {
        this.reset(true);
    }

    reset(initial = false) {
        this.token = tokens[Math.floor(Math.random() * tokens.length)];
        this.fontSize = Math.random() * 10 + 10; // 10–20px
        this.x = Math.random() * canvas.width;
        // On init, scatter across full height; on respawn, start just off-screen top or sides
        this.y = initial
            ? Math.random() * canvas.height
            : -this.fontSize * 2;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = Math.random() * 0.4 + 0.15; // always drifting downward gently
        this.opacity = Math.random() * 0.4 + 0.1;
        this.fadeSpeed = (Math.random() - 0.5) * 0.002; // subtle breathing
        this.angle = (Math.random() - 0.5) * 0.3; // slight tilt
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Breathe opacity
        this.opacity += this.fadeSpeed;
        if (this.opacity > 0.55 || this.opacity < 0.08) this.fadeSpeed *= -1;

        // Respawn when drifted off bottom or sides
        if (
            this.y > canvas.height + 40 ||
            this.x < -100 ||
            this.x > canvas.width + 100
        ) {
            this.reset();
        }
    }

    draw() {
        const isLightMode = document.body.classList.contains('light-mode');
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.globalAlpha = this.opacity;
        ctx.font = `${this.fontSize}px 'Courier New', monospace`;
        ctx.fillStyle = isLightMode ? '#1a1a2e' : '#a0aec0';
        ctx.fillText(this.token, 0, 0);
        ctx.restore();
    }
}

const particles = [];

function init() {
    particles.length = 0;
    const count = getParticleCount();
    for (let i = 0; i < count; i++) {
        particles.push(new CodeToken());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    }, 250);
});

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) animate();
});

init();
animate();
