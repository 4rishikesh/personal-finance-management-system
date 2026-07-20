# FinanceFlow --> AI-Powered Personal Finance Manager

A full-stack personal finance management platform with local AI insights, automated budget alerts, and financial runway prediction.

## Features

- **JWT Authentication** - Secure register/login with bcrypt password hashing
- **Transaction Management** - Add, view, and delete income/expense transactions with auto-categorization
- **Budget Tracking** - Set per-category spending limits with real-time progress monitoring
- **Financial Runway Prediction** - Calculates how many days your current balance will last based on spending patterns, with actionable recommendations
- **AI-Powered Insights** - Local AI analysis using Ollama (Llama 3.2) - no API keys, no cost, no internet required
- **Auto-Categorization** - AI automatically suggests transaction categories from natural language descriptions
- **Automated Email Alerts** - Node-cron scheduled job sends budget warning emails when spending exceeds 90% of limit (with 24-hour deduplication)
- **Financial Health Score** - Composite score based on savings rate, runway, and budget adherence
- **Analytics Dashboard** - Monthly trend area charts, expense breakdown pie chart, category analysis
- **Dark/Light Mode** - System-aware theme with smooth transitions

## Tech Stack

**Backend**
- Node.js + Express
- MongoDB Atlas + Mongoose
- JWT Authentication
- Nodemailer + Gmail SMTP
- Node-cron (scheduled jobs)
- bcrypt

**Frontend**
- React 18 + Vite
- Recharts (area charts, pie charts)
- React Router v6
- Axios
- react-countup (animated counters)
- CSS custom properties (theme system)

**AI**
- Ollama (local inference)
- Llama 3
- Runs entirely on-device — no external API calls

## Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Ollama installed (`ollama.com`)

### Backend
```bash
cd backend
npm install
```

Create `.env`:
```
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
PORT=5000
```

```bash
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### AI (Ollama)
```bash
ollama pull llama3.2
OLLAMA_ORIGINS="*" ollama serve
```

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────┐
│   React Frontend │────▶│  Express Backend  │────▶│ MongoDB Atlas│
│   (Vite + CSS)  │     │  (Node.js + JWT)  │     │             │
└────────┬────────┘     └──────────────────┘     └─────────────┘
         │                        │
         │              ┌─────────▼────────┐
         │              │   Node-Cron Job   │
         │              │  (Budget Alerts)  │
         │              └──────────────────┘
         │
┌────────▼────────┐
│  Ollama / Llama  │
│  (Local AI)     │
└─────────────────┘
```

## Key Technical Decisions

- **Local AI over cloud APIs** - Ollama runs Llama 3 on-device, eliminating API costs and rate limits
- **Cron-based alerts** - Budget monitoring runs as a background service independent of user sessions
- **JWT with 7-day expiry** - Stateless authentication with automatic token refresh on login
- **CSS custom properties** - Theme system uses native CSS variables for instant dark/light switching without re-renders

## Project Structure

```
finance-management-system/

├── backend/
│   ├── config/           # Database configuration
│   ├── controllers/      # Request handlers/business logic
│   ├── jobs/             # Scheduled jobs (budget alerts)
│   ├── middleware/       # JWT authentication middleware
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   ├── services/         # Email and other services
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/       # Images, icons, static resources
│   │   ├── components/
│   │   │   ├── common/   # Shared reusable components
│   │   │   ├── dashboard/# Dashboard-specific components
│   │   │   └── layout/   # Navbar, Sidebar, Layout wrappers
│   │   ├── constants/    # Application constants
│   │   ├── context/      # React Context API
│   │   ├── pages/        # Route-level pages
│   │   ├── routes/       # Protected/Public routes
│   │   ├── services/     # API communication layer
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## Author

Rishikesh R. Mahato — B.Tech CSE, NIT Warangal  
GitHub: [@4rishikesh](https://github.com/4rishikesh)
