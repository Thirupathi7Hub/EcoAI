# 🌿 EcoBot AI — Project Submission & Overview

---

## 📋 1. Problem Statement
Rural communities in India (particularly Tamil-speaking farming regions) face a significant digital divide when accessing sustainability advice. Existing AI systems are:
- **Language Restrictive:** High-quality farming advice, waste recycling databases, and policy documentation are rarely available in native languages like **Tamil**.
- **Complex UI/UX:** Traditional web applications are cluttered, unintuitive, and lack voice features, making them inaccessible for elderly or non-tech-savvy users.
- **Fragmented Information:** Farmers and rural citizens must navigate multiple platforms to check crop diseases, search for government welfare schemes (such as PM-KISAN), and find proper recycling regulations.

---

## 🚀 2. Detailed Solution Description
**EcoBot AI** is a premium, fully responsive, and bilingual (English/Tamil) conversational assistant that brings advanced AI directly to rural communities to encourage sustainable agriculture and waste management.

### Key Features:
1. **Multilingual AI Chatbot & Voice Assistant:**
   - Real-time text and speech interface with auto-read-aloud answers.
   - Seamless language toggle between **Tamil** and **English** dynamically across the entire app.
2. **Smart Farming Advisor:**
   - AI-generated seasonal plans, crop suggestions, and organic fertilizer instructions tailored to regional climates.
   - Database of common crop pests with organic/chemical control measures.
3. **Gemini Vision Waste Detection AI:**
   - Allows users to upload or capture photos of garbage/waste (plastic, electronic, organic, chemical).
   - An intelligent fallback chain (**Gemini Vision API** → **NVIDIA Llama 3.1** → **Smart Rule Engine**) classifies the item, details its environmental impact, and gives Tamil instructions on how to safely recycle or dispose of it.
4. **Government Schemes Assistant:**
   - Instant search and eligibility checks for central/state schemes (e.g., PM-KISAN, Jal Jeevan Mission, PM Surya Ghar solar).
5. **Sustainability Dashboard:**
   - Real-time analytics, water savings estimation, and eco-badges to gamify environmental action.

---

## 🧠 3. AI Elements and Tools Used
- **Google Gemini 1.5 Flash (Vision API):** Performs instant image recognition on uploaded waste images to verify recyclability.
- **NVIDIA NIM (Llama 3.1 8B):** Orchestrates general natural language chat, translates text queries into precise Tamil/English outputs, and powers the RAG system for government schemes.
- **Web Speech API:** Provides native browser Speech-to-Text and Text-to-Speech synthesis in both English and Tamil.
- **Framer Motion:** Delivers smooth micro-animations and page transitions to ensure a high-end, premium, and easy-to-navigate user interface.
- **React.js & Node.js/Express:** Modern, lightweight frontend and backend proxy architecture to secure keys and stream responses.
- **Firebase Firestore:** Synchronizes chat histories and achievements securely in real time.

---

## 🔗 4. GitHub & Prototype Links
- **GitHub Repository:** [https://github.com/Thirupathi7Hub/EcoAI.git](https://github.com/Thirupathi7Hub/EcoAI.git) (Fully initialized & pushed to `main` branch)
- **Local Dev Server:** `http://localhost:5173`
- **Backend API Server:** `http://localhost:5000`

---

## 📸 5. Prototype & Interface Layout
The user interface features a premium green-themed **Glassmorphic Dark Mode**:

- **Bilingual Interface Toggle:** Allows users to switch languages instantly across all components.
- **Waste Upload Module:** Simple drag-and-drop or camera preview container for analyzing plastic bottles, dry waste, or farming items.
- **Responsive Dashboard:** 100% optimized for mobile screens, automatically stacking lists into single columns with appropriate top margins to keep the navigation comfortable.

---
**Developed by Team:**
- **Tamilraj** (Project Lead & Full Stack Developer)
- **Thirupathi** (AI/ML Engineer)
- **Nitesh** (UI/UX Designer & Frontend Developer)
