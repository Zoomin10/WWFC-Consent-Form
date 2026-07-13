# WWFC Player Registration & Consent System

Version: **1.1.0**

A secure web application for collecting and managing player registrations and annual consent forms for **Wroughton & Wichelstowe Football Club (WWFC)**.

The application allows parents to complete player registrations online while providing club administrators with a secure dashboard to manage submissions, download reports and receive automated email notifications.

---

# Features

## Parent Registration

- Responsive mobile-friendly registration form
- Player details
- WWFC Team selection
- Emergency contacts
- Medical information
- Consent declarations
- Electronic signature
- GDPR Privacy Policy
- Mandatory Privacy Policy acceptance

---

## Administrator Dashboard

Secure password protected dashboard providing:

- Registration statistics
- Filter by Age Group
- Filter by Gender
- CSV Export
- Registration summary popup
- Team information
- Delete registrations

---

## Dashboard Statistics

Displays:

- Total registrations
- Male players
- Female players
- Development players (U11 & below)
- Competitive players (U12 & above)
- Adult players

---

## Email Notifications

Automatically sends a branded email whenever a registration is submitted.

Features:

- WWFC branding
- Embedded club logo
- Mobile responsive layout
- Summary of registration
- Direct link to Admin Dashboard
- Multiple recipients
- GDPR-friendly content

Current recipients:

- Chair
- Vice-Chair
- Youth Club Secretary
- Adult Club Secretary

- Email notification is enabled using "Resend Email: https://resend.com/emails 
---

## Security

- Password protected Admin area
- JWT Authentication
- HttpOnly cookies
- CORS protection
- GDPR compliant
- Sensitive medical information excluded from notification emails

---

# Technology Stack

Frontend

- React
- Vite
- CSS

Backend

- Node.js
- Express
- Prisma ORM

Database

- PostgreSQL (Railway)

Email

- Resend
- Microsoft 365
- Verified domain (wwfc.org.uk)

Hosting

- Railway
- GitHub

---

# Architecture

```
                 Parent

                   │

                   ▼

         React Registration Form

                   │

                   ▼

      Express REST API (Node.js)

                   │

      ┌────────────┴─────────────┐
      │                          │
      ▼                          ▼

 PostgreSQL                Notification Service
   Prisma                        │
                                  ▼
                              Resend API
                                  │
                                  ▼
                         Microsoft 365 Mailboxes

                   │

                   ▼

          Admin Dashboard (React)

                   │

                   ▼

             PostgreSQL Database
```

---

# Project Structure

```
backend/
    src/
        assets/
        routes/
        services/
        prisma.js
        app.js
        server.js

frontend/
    src/
        pages/
        components/
        assets/
```

---

# Environment Variables

## Backend

```
DATABASE_URL=

ADMIN_PASSWORD=

JWT_SECRET=

FRONTEND_URL=

RESEND_API_KEY=

EMAIL_FROM=

EMAIL_TO=

ADMIN_URL=
```

---

# Installation

```
npm install
```

Backend

```
cd backend
npm install
npm run dev
```

Frontend

```
cd frontend
npm install
npm run dev
```

---

# Deployment

Development and Production are deployed using Railway.

Frontend and Backend are deployed as separate Railway services.

---

# Email Notifications

Registration notifications are generated after a successful database save.

If the email service is unavailable:

- Registration is still saved
- Parent receives success response
- Error is logged
- No registration data is lost

---

# Privacy

The system has been designed to minimise personal data contained within emails.

Notification emails intentionally exclude:

- Medical Information
- Allergies
- Addresses
- Consent responses
- Emergency Contact 2

The secure Admin Dashboard remains the authoritative source of player information.

---

# Roadmap

Version 1.2

- Team filtering
- Search
- Pagination
- CSV filtering

Version 1.3

- Edit registrations
- Archive registrations
- Audit history

Version 2.0

WWFC Club Portal

- Players
- Coaches
- Volunteers
- Events
- Tournaments
- Holiday Camps
- Communications

---

© Wroughton & Wichelstowe Football Club
