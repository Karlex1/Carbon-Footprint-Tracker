# Carbon Footprint Tracker

An AI-powered web application that helps users calculate, track, and reduce their carbon footprint through personalized insights and machine learning.

Live App: https://carbon-footprint-tracker-sooty.vercel.app/  
GitHub: https://github.com/Karlex1/Carbon-Footprint-Tracker  

---

## Project Summary

Carbon Footprint Tracker is a full-stack application designed to provide a personalized and scalable solution for estimating carbon emissions based on user lifestyle.

The system integrates a machine learning model with a modern web stack to deliver real-time predictions, historical tracking, and actionable suggestions for reducing environmental impact.

---

## Key Features

- User authentication with JWT and secure password hashing
- Lifestyle-based carbon footprint calculation using ML model
- Interactive dashboard with emission insights and history
- Personalized recommendation engine for emission reduction
- Commitment tracking system for behavioral improvement
- Bilingual support (English and Hindi)
- Keep-alive system using GitHub Actions to prevent backend downtime

---

## Tech Stack

Frontend:
- React.js
- Material UI
- Recharts

Backend:
- Node.js
- Express.js
- MongoDB
- JWT Authentication

Machine Learning:
- Python
- Flask API
- MLP (Multi-Layer Perceptron)
- pandas, NumPy, joblib

Deployment:
- Vercel (Frontend)
- Render (Backend + ML API)
- GitHub Actions (Keep-alive automation)

---

## System Architecture

User → React Frontend → Node Backend → Flask ML API → MongoDB → Dashboard

---

## How It Works

1. User submits lifestyle data via questionnaire  
2. Backend sends data to ML API  
3. ML model predicts carbon emission  
4. Data is stored in database  
5. Dashboard displays:
   - Emission results
   - Historical trends
   - Personalized suggestions  

---

## Impact & Learning

- Built a complete ML-integrated production system
- Solved real deployment issue using keep-alive automation
- Designed practical recommendation engine instead of generic tips
- Applied full-stack architecture with real-world scalability considerations

---

## Future Scope

- AI-based recommendation system using LLMs / RAG
- Region-specific emission optimization
- Gamification and progress tracking
- Exportable sustainability reports

---

## Author

Sanchit
B.Tech IT | Full Stack Developer | ML Enthusiast  
GitHub: https://github.com/Karlex1  

---

## Note

This project demonstrates the practical application of AI and full-stack development in solving real-world sustainability challenges.
