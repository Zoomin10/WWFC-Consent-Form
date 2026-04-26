# WWFC Digital Consent App

A full-stack web application for managing youth football player registrations and digital consent forms for Wroughton & Wichelstowe Football Club.

---

## 🚀 Features

### Player Registration (Frontend)
- Digital consent form
- Player details capture
- Emergency contact information (2 contacts)
- Medical information & allergies
- Consent flags (data, photos, videos)
- Signature capture (typed)

### Admin Dashboard
- Overview statistics:
  - Total registrations
  - Male / Female split (%)
  - Development vs Competitive players
  - Adult players
- Filter by:
  - Age group
  - Gender
- List of all registrations
- Click-to-view full registration (modal)
- Delete registrations
- Export to CSV

---

## 🏗️ Tech Stack

### Frontend
- React (Vite)
- CSS (custom styling)
- Fetch API

### Backend
- Node.js
- Express
- Prisma ORM

### Database
- PostgreSQL (Railway)

### Hosting
- Railway (frontend + backend + database)

---

## 📁 Project Structure
    Consent/
    ├── frontend/ # React app
    │ ├── src/
    │ ├── public/
    │
    ├── backend/ # Node/Express API
    │ ├── src/
    │ ├── prisma/
    │
    ├── scripts/ # helper scripts
    └── README.md

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

```env
DATABASE_URL=your_postgres_connection
NODE_ENV=development

    VITE_API_URL=http://localhost:4000

🌐 Deployment (Railway)
Environments
Environment	Branch	Purpose
Development	development	Testing
Production	production	Live system
Backend
Build: npm install && npx prisma generate
Start: npx prisma migrate deploy && npm start
Frontend
Build: standard Vite build

Ensure:

    VITE_API_URL = backend service URL

📊 Admin Access

Admin dashboard is available at:

/admin

📦 Scripts
    Switch environments
        ./scripts/switch-env.sh dev
        ./scripts/switch-env.sh prod
    Release to production
        ./scripts/release-prod.sh

🔒 Future Improvements
    Admin authentication (JWT)
    Role-based access
    Excel export (formatted)
    Email notifications
    Player search
    Audit logging
    Mobile UI enhancements

📄 License

    Private internal project