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
    threshold: 0.1,
    rootMargin: '0px 0px -20px 0px'
};



// Move IN & OUT as you SCROLL - START ----NEW SCROLL

// const observer = new IntersectionObserver((entries) => {
    // entries.forEach(entry => {
        // if (entry.isIntersecting) {
            // entry.target.classList.add('visible');
        // } else {
            // entry.target.classList.remove('visible');  // ← ADD THIS LINE
        // }
    // });
// }, observerOptions);

// Move IN & OUT as you SCROLL - END ----NEW SCROLL END



// ORIGINAL - Come in as you SCROLL DOWN -----------------------START

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// ORIGINAL - Come in as you SCROLL DOWN -----------------------END



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
		document.querySelector('#hero .links-mobile').classList.add('fade-in-up');
    }, 250);
});

// Page Load ---------- END ----------- //



// ====================================================
// TYPING EFFECT FOR HERO SUBTITLE
// ====================================================

const typingEffect = () => {
  const h2 = document.querySelector("#hero h2");
  const texts = ["Software Developer", "Web Designer"];
  let textIndex = 0;
  let charIndex = texts[0].length; // Start at end of first text
  let isDeleting = false;
  let isFirstCycle = true; // Skip deletion on first cycle
  const typingSpeed = 100; // ms per character
  const deletingSpeed = 60; // ms per character (faster backspace)
  const delayBetweenTexts = 3100; // ms to wait before backspacing

  const updateDisplay = () => {
    const currentText = texts[textIndex];
    const displayText = currentText.substring(0, charIndex);
    
    // Remove old cursor
    const oldCursor = h2.querySelector('.cursor');
    if (oldCursor) oldCursor.remove();
    
    // Set text and add cursor
    h2.textContent = displayText || '\u00A0';
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    cursor.textContent = '_';
    h2.appendChild(cursor);
  };

  const type = () => {
    const currentText = texts[textIndex];
    
    if (isDeleting) {
      // Backspacing
      charIndex--;
      updateDisplay();
      
      if (charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        setTimeout(type, 500); // Short pause before typing next word
        return;
      }
      setTimeout(type, deletingSpeed);
    } else {
      // Typing
      if (isFirstCycle) {
        // First cycle: just move to backspacing without typing
        isFirstCycle = false;
        isDeleting = true;
        setTimeout(type, delayBetweenTexts);
        return;
      }
      
      charIndex++;
      updateDisplay();
      
      if (charIndex === currentText.length) {
        // Finished typing, wait before backspacing
        setTimeout(() => {
          isDeleting = true;
          type();
        }, delayBetweenTexts);
        return;
      }
      setTimeout(type, typingSpeed);
    }
  };

  type();
};

// Start typing effect after hero animations finish (around 800ms)
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(typingEffect, 1200); // Adjust this number to match your hero animation duration
});

// Typing Effect -------- END ------------ //



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

// PARTICLE SYSTEM - START ------------------------ *

class Particle {
    constructor(randomAge = false) {
        this.reset(randomAge);
    }
	
    reset(randomAge = false) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() < 0.5
            ? Math.random() * 20 + 5
            : Math.random() * 70 + 30;

		const snippets = [
			// HTML tags
			'<div>', '<span>', '<body>', '<header>',
			'<main>', '<nav>', '<footer>', '<section>', '<article>',
			'<button>', '<input>', '<form>', '<a>', '<img>',
			
			// CSS snippets
			'display:', 'flex', 'grid', 'position:', 'color:',
			'.class', '#id', ':hover', ':active', 'rgba()',
			'margin:', 'padding:', 'transform:', '@media', 'linear-gradient',
			
			// JavaScript
			'const', 'let', 'function', 'return', '=>',
			'async', 'await', 'if', 'else', 'forEach',
			'{ }', '( )', '[ ]', '&&', '||', '===',
			'console.log()', 'document.', 'addEventListener',
			
			// Web dev terms
			'HTTP', 'API', 'JSON', 'DOM', '404', '200',
			'GET', 'POST', 'fetch', 'npm', 'git commit',
			
			// Symbols
			'...', '??', '?.', '++', '--', '=>', '!='
		];
        this.text = snippets[Math.floor(Math.random() * snippets.length)];

// PARTICLE OPACITY - START

        // Each particle has its own max opacity - range from 0.55 to 1.0 (completely solid)
		
        this.maxOpacity = Math.random() * 0.50 + 0.15;
		this.opacity = 0; // Start invisible
		this.age = 0; // Start at beginning of lifecycle

// PARTICLE OPACITY - END

        // Total lifetime in frames, random so they don't sync up
        this.lifetime = Math.random() * 600 + 400;   // 400–1000 frames (~7–17s)
        this.fadeFrames = Math.random() * 120 + 80;  // 80–200 frames to fade in/out

        // If randomAge, start at a random point in the lifecycle so
        // the canvas doesn't look empty on load
        this.age = randomAge ? Math.random() * this.lifetime : 0;

        // Random speed - NOT dependent on size
        const speed = Math.random() * 0.25 + 0.25;
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
		
	// *** Light & Dark Color Switch - `Light Color` : `Dark Color` *** //
        const isLight = document.body.classList.contains('light-mode');
        const color = isLight ? `42, 42, 42` : `245, 245, 245`;


        const fontSize = Math.round(this.size * 0.2 + 14);
		
		// number + 12 = 12 controls minimum size
		// 0.6 + number = 0.6 controls maximum size

        ctx.font = `${fontSize}px monospace`;
        ctx.fillStyle = `rgba(${color}, ${this.opacity})`;
        ctx.fillText(this.text, this.x, this.y);
    }
}

// PARTICLE SYSTEM - END -------------------------- *

function init() {
    particles.length = 0;
    const count = getParticleCount();
    for (let i = 0; i < count; i++) {
        particles.push(new Particle(true));
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

init();
animate();



// ====================================================
// MOBILE MENU
// ====================================================

const hamburger = document.getElementById('hamburger');
const mobileDrawer = document.getElementById('mobile-drawer');
const mobileOverlay = document.getElementById('mobile-overlay');

function openMenu() {
    hamburger.classList.add('open');
    mobileDrawer.classList.add('open');
    mobileOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    hamburger.classList.remove('open');
    mobileDrawer.classList.remove('open');
    mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? closeMenu() : openMenu();
});

// Close when overlay is clicked
mobileOverlay.addEventListener('click', closeMenu);

// Close when a drawer link is clicked
mobileDrawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
});

// MOBILE MENU END


