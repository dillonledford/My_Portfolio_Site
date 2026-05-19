# dillonledford.com

Personal portfolio website — live at [dillonledford.com](https://dillonledford.com)

## Overview

Custom-built portfolio site with animated scroll effects, a dark/light theme toggle, a dynamic particle background, and a working contact form. Built without any frontend frameworks — just vanilla HTML, CSS, and JavaScript on a lightweight Node.js/Express backend.

## Features

- **Particle background** — floating code snippets that fade in/out and drift across the page
- **Scroll animations** — elements slide in from the left or fade up as they enter the viewport
- **Typing effect** — hero subtitle cycles between "Software Developer" and "Web Designer"
- **Dark/light mode** — theme preference persisted via localStorage
- **Contact form** — reCAPTCHA v2 protected, emails delivered via Resend
- **Mobile responsive** — hamburger drawer menu, mobile-specific hero link set, scaled animations
- **Keep-alive ping** — prevents Render free tier from spinning down (14-minute interval)

## Stack

| Layer | Tech |
|---|---|
| Frontend | HTML, CSS, Vanilla JavaScript |
| Backend | Node.js, Express |
| Email | [Resend](https://resend.com) |
| Spam protection | Google reCAPTCHA v2 |
| Hosting | [Render](https://render.com) |
| Font | Google Fonts — Rubik |

## Project Structure

```
/
├── public/
│   ├── index.html
│   ├── style.css
│   ├── mobile.css
│   ├── script.js
│   └── files/
│       └── Dillon_Ledford_Resume.pdf
└── server.js
```

## Environment Variables

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | API key from Resend |
| `RECAPTCHA_SECRET` | Server-side secret from Google reCAPTCHA |
| `PORT` | Port to run the server on (default: 3000) |

## Running Locally

```bash
npm install
RESEND_API_KEY=your_key RECAPTCHA_SECRET=your_secret node server.js
```

## Contact

[contact@dillonledford.com](mailto:contact@dillonledford.com)
