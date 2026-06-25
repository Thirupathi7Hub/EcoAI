# 🌿 EcoBot AI — Smart Sustainability Assistant

> AI-powered sustainability platform for rural communities | Tamil Nadu, India

[![SDG 6](https://img.shields.io/badge/SDG-6_Clean_Water-0ea5e9)](https://sdgs.un.org/goals/goal6)
[![SDG 9](https://img.shields.io/badge/SDG-9_Innovation-8b5cf6)](https://sdgs.un.org/goals/goal9)
[![SDG 11](https://img.shields.io/badge/SDG-11_Communities-f59e0b)](https://sdgs.un.org/goals/goal11)
[![SDG 13](https://img.shields.io/badge/SDG-13_Climate-00d084)](https://sdgs.un.org/goals/goal13)

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- A Firebase project (free tier)
- Gemini API key (free at [Google AI Studio](https://aistudio.google.com))

### 1. Clone & Setup Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Fill in your Firebase + Gemini API keys in .env
npm run dev
```

### 2. Start Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your API keys in .env
npm run dev
```

App runs at: **http://localhost:5173**

---

## 🔑 Environment Variables

### Frontend (`frontend/.env`)
```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
VITE_GEMINI_API_KEY=your_gemini_key
VITE_API_URL=http://localhost:5000
```

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_key
```

---

## 🔥 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable **Authentication** → Add Google & Email/Password providers
4. Create **Firestore Database** (Start in production mode)
5. Add these Firestore **Security Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /chatHistory/{docId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
    match /wasteReports/{docId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
    match /sustainabilityReports/{docId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```

6. Copy your Firebase config from **Project Settings → General → Your apps**

---

## 🧠 Gemini API Setup

1. Visit [Google AI Studio](https://aistudio.google.com)
2. Click **"Get API key"**
3. Create a new API key
4. Add to both `frontend/.env` as `VITE_GEMINI_API_KEY` and `backend/.env` as `GEMINI_API_KEY`

> **Note:** The app works in **demo mode** without the API key — just with pre-built responses.

---

## 🌐 Deployment

### Frontend → Vercel

```bash
cd frontend
npm run build

# Using Vercel CLI
npm i -g vercel
vercel --prod
```

**Vercel Environment Variables:** Add all `VITE_*` variables in Vercel dashboard → Settings → Environment Variables.

### Backend → Render

1. Push backend to GitHub
2. Create new **Web Service** on [Render](https://render.com)
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables in Render dashboard

---

## 📁 Project Structure

```
EcoAI/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/          # Navbar, Footer
│   │   │   └── ui/              # LoadingScreen, Skeleton
│   │   ├── context/             # AuthContext, ThemeContext
│   │   ├── firebase/            # Firebase init & config
│   │   ├── hooks/               # useVoice
│   │   ├── pages/               # All 9 pages
│   │   ├── services/            # aiService, dbService
│   │   ├── App.jsx              # Router & providers
│   │   ├── main.jsx
│   │   └── index.css            # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── .env.example
│
└── backend/
    ├── routes/                  # chat, waste, analytics, schemes, users
    ├── services/                # geminiService
    ├── data/                    # schemes.json
    ├── server.js
    └── .env.example
```

---

## ✨ Features

| Feature | Description | Route |
|---|---|---|
| 🌍 Landing Page | Hero, SDGs, features, testimonials | `/` |
| 💬 AI Chat | Gemini-powered sustainability chatbot | `/chat` |
| 🎤 Voice AI | Tamil/English voice input & TTS output | `/chat` |
| 🌾 Smart Farming | Crop advice, pest guide, seasonal tips | `/farming` |
| ♻️ Waste Detection | AI image classification of waste | `/waste` |
| 📊 Analytics | Green score, charts, achievements | `/analytics` |
| 📋 Gov Schemes | RAG-powered scheme search | `/schemes` |
| 🔐 Auth | Google + Email/Password login | `/login` |
| 🤝 Responsible AI | Ethics, fairness, privacy commitments | `/responsible-ai` |

---

## 🛡️ SDG Alignment

- **SDG 6** — Clean Water & Sanitation: Water conservation guidance
- **SDG 9** — Industry & Innovation: AI infrastructure for rural access
- **SDG 11** — Sustainable Cities & Communities: Village-level sustainability
- **SDG 13** — Climate Action: Climate awareness and adaptation

---

## 📞 Support

- Email: hello@ecobot.ai
- LinkedIn: EcoBot AI
- Made with ❤️ for rural communities

---

*EcoBot AI — Empowering villages with AI for a sustainable tomorrow* 🌱
