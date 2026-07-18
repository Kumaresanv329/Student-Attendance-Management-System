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









