# 🎓 Student Attendance Management System

A Full Stack Student Attendance Management System built using Node.js, React, Express, and JSON Database.

## 📌 Overview

This project helps educational institutions manage students, professors, attendance, classes, and subjects through a simple web application.

---

## ✨ Features

- 🔐 Admin, Professor & Student Login
- 👨‍🎓 Student Management
- 👨‍🏫 Professor Management
- 🏫 Class & Subject Management
- ✅ Attendance Management
- 📊 Attendance Reports
- 📄 CSV Export
- 📈 Attendance Summary
- 📱 Responsive UI

---

## 🛠 Tech Stack

### Frontend
- React.js
- HTML5
- CSS3
- Tailwind CSS

### Backend
- Node.js
- Express.js

### Database
- JSON Database

### Tools
- Git
- GitHub
- VS Code

---

## 📂 Project Structure

```text
backend/
│── server.js
│── routes/
│── utils/
│── data/

frontend/
│── src/
│── components/
│── pages/
│── App.jsx
```

---

## 🚀 Installation

```bash
git clone https://github.com/Kumaresanv329/Student-Attendance-Management-System.git

cd Student-Attendance-Management-System

npm install

npm run dev
```

Backend
```
http://localhost:5000
```

Frontend
```
http://localhost:5173
```

---

## 📡 REST API

### Authentication

POST `/api/login`

### CRUD APIs

- `/api/admin`
- `/api/professor`
- `/api/student`
- `/api/class`
- `/api/subject`
- `/api/attendance`

### Attendance

- Export CSV
- Bulk Upload
- Student Summary
- Subject Summary


---

## 🔮 Future Improvements

- MongoDB Integration
- JWT Authentication
- Email Notifications
- QR Attendance
- Face Recognition
- Cloud Deployment

---

## 👨‍💻 Author

**Kumaresan V**

---

⭐ If you like this project, give it a Star.
# Student Attendance Management System (Node.js + React + JSON DB)

Description
  A Full Stack Student Attendance Management System built using Python, Node.js, React, and JSON DB.

## Quick Start

1. Install dependencies
```bash
npm install
```

2. Start dev servers (backend + frontend)
```bash
npm run dev
```
- Backend: http://localhost:5000
- Frontend (Vite): http://localhost:5173

3. Build frontend
```bash
npm run build
```
This outputs to `frontend/dist`. The Express server serves from that folder.

## Project Structure
```
backend/
  server.js
  routes/
  utils/
  data/
frontend/
  index.html
  src/
    App.jsx
    components/
    styles/tailwind.css
```

## JSON Database Files
Located in `backend/data/`:
- admin.json, professor.json, student.json, class.json, subject.json, attendance.json

Each file contains an array of JSON objects.

## API Overview
Base path: `/api`

- Auth
  - POST `/api/login` -> { userType: 'admin'|'professor'|'student', user }

- CRUD (GET / POST / PUT / DELETE)
  - `/api/admin`
  - `/api/professor`
  - `/api/student`
  - `/api/class`
  - `/api/subject`
  - `/api/attendance`

- Attendance extras
  - GET `/api/attendance/export/csv`
  - GET `/api/attendance/summary/subject/:subjectId`
  - GET `/api/attendance/summary/student/:studentId`
  - POST `/api/attendance/bulk` { records: [...] }

## Frontend
- Single login for all roles
- Dashboards: Admin, Professor, Student
- TailwindCSS via PostCSS (see `tailwind.config.js`)

## Notes
- Passwords are stored in plain text for simplicity.
- Data is persisted to JSON using Node `fs`.









