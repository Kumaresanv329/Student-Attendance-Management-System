const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/adminRoutes');
const professorRoutes = require('./routes/professorRoutes');
const studentRoutes = require('./routes/studentRoutes');
const classRoutes = require('./routes/classRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const { readData } = require('./utils/fileHandler');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API routes
app.use('/api/admin', adminRoutes);
app.use('/api/professor', professorRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/class', classRoutes);
app.use('/api/subject', subjectRoutes);
app.use('/api/attendance', attendanceRoutes);

// Login route
app.post('/api/login', (req, res) => {
	const { username, password } = req.body || {};
	if (!username || !password) {
		return res.status(400).json({ message: 'Username and password required' });
	}

	try {
		const admins = readData('admin');
		const professors = readData('professor');
		const students = readData('student');

		const admin = admins.find(u => u.username === username && u.password === password);
		if (admin) return res.json({ userType: 'admin', user: admin });

		const professor = professors.find(u => u.username === username && u.password === password);
		if (professor) return res.json({ userType: 'professor', user: professor });

		const student = students.find(u => u.username === username && u.password === password);
		if (student) return res.json({ userType: 'student', user: student });

		return res.status(401).json({ message: 'Invalid credentials' });
	} catch (err) {
		return res.status(500).json({ message: 'Server error', error: err.message });
	}
});

// Serve frontend if built (optional)
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));
app.get('*', (req, res) => {
	const indexPath = path.join(__dirname, '..', 'frontend', 'dist', 'index.html');
	res.sendFile(indexPath, (err) => {
		if (err) {
			res.status(404).send('Not Found');
		}
	});
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});




