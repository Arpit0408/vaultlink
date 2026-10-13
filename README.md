# VaultLink

> A zero-trust asset & link governance platform that turns regular URLs and confidential files into protected, self-expiring, and trackable assets.

Traditional URL shorteners only redirect traffic. VaultLink was built because sensitive documents and private destination links need real governance: passcode gates, anti-leak watermarking, natural-language expiration, email-dispatch delivery, and real-time access logs.

---

## What Makes VaultLink Different?

- **Separate Workspaces for Files & URLs**: Keep your file drive completely separated from shortened marketing/destination links.
- **Dynamic File Watermarking**: Upload confidential PDFs and documents with customizable diagonal watermarks before sharing.
- **Passcode & Gatekeeper Protection**: Require visitors to enter a passcode or verify before unlocking access.
- **Natural Language Expiry**: Type expiration times naturally (e.g. _"in 2 hours"_, _"tomorrow at 5pm"_, _"in 30 mins"_). Powered by `chrono-node`.
- **Direct Email Dispatch**: Automatically dispatch secret access links and passcodes to recipient inboxes via Nodemailer & Gmail SMTP.
- **Desktop Workstation Focus**: Strict desktop-first workflow designed for security and governance consoles.
- **Dark & Light Mode**: Built-in bespoke design system with theme toggling.

---

## Architecture & Tech Stack

### Frontend

- **Framework**: React 18 + Vite
- **Routing**: `@tanstack/react-router`
- **State Management**: Redux Toolkit
- **Styling**: Vanilla CSS + Tailwind CSS tokens (Light/Dark themes)
- **Natural Language Parser**: `chrono-node`
- **Icons**: Lucide React

### Backend

- **Runtime**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (JSON Web Tokens) with secure HTTP cookies & bearer headers
- **Cloud File Storage**: ImageKit SDK
- **Email Delivery**: Nodemailer (Gmail SMTP / Ethereal fallback)
- **Code Generation**: Nanoid

---

## Quick Start Guide

### 1. Clone the repository

```bash
git clone https://github.com/Arpit0408/vaultlink.git
cd vaultlink
```

### 2. Configure Backend Environment

Navigate to `backend/` and create a `.env` file:

```bash
cd backend
npm install
```

Sample `.env`:

```env
PORT=2300
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/vaultlink?retryWrites=true&w=majority
APP_URL=http://localhost:5173
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development

# Cloud File Storage (ImageKit)
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id

# Email Dispatch (Gmail SMTP)
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_digit_app_password
SMTP_FROM=your_email@gmail.com
```

Start the backend server:

```bash
npm run dev
```

### 3. Configure Frontend

Open a new terminal window:

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## Security Features Overview

| Feature                    | Description                                                                     |
| :------------------------- | :------------------------------------------------------------------------------ |
| **Passcode Gate**          | Encrypted password prompt before allowing redirection or file download          |
| **Self-Destruct Timers**   | Automatically invalidate access after a specified duration                      |
| **Watermarked Documents**  | Discourage unauthorized re-sharing and screen grabs                             |
| **Email Delivery**         | Dispatch links directly to authorized recipients without exposing URLs publicly |
| **Click & View Analytics** | Track how many times each asset or shortlink has been accessed                  |

---

## Production Deployment

- **Backend**: Can be deployed on [Render](https://render.com) or [Railway](https://railway.app) pointing root directory to `urlshortner/backend`.
- **Frontend**: Can be deployed on [Vercel](https://vercel.com) or [Netlify](https://netlify.com) pointing root directory to `urlshortner/frontend`.

---
