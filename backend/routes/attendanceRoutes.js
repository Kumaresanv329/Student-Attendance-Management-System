const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const { readData, writeData, getNextId } = require('../utils/fileHandler');

const router = express.Router();
const FILE = 'attendance';

// Configure multer for file uploads
const upload = multer({ 
	storage: multer.memoryStorage(),
	limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Get all attendance
router.get('/', (req, res) => {
	return res.json(readData(FILE));
});

// Get by id
router.get('/:id', (req, res) => {
	const items = readData(FILE);
	const item = items.find(i => String(i.id) === String(req.params.id));
	if (!item) return res.status(404).json({ message: 'Not found' });
	return res.json(item);
});

// Create
router.post('/', (req, res) => {
	const items = readData(FILE);
	const newItem = { id: getNextId(items), ...req.body };
	items.push(newItem);
	writeData(FILE, items);
	return res.status(201).json(newItem);
});

// Bulk mark attendance for a date/subject
router.post('/bulk', (req, res) => {
	const { records } = req.body || {};
	if (!Array.isArray(records)) return res.status(400).json({ message: 'records array required' });
	const items = readData(FILE);
	let nextId = getNextId(items);
	const created = records.map(r => ({ id: nextId++, ...r }));
	const updated = items.concat(created);
	writeData(FILE, updated);
	return res.status(201).json(created);
});

// Update
router.put('/:id', (req, res) => {
	const items = readData(FILE);
	const idx = items.findIndex(i => String(i.id) === String(req.params.id));
	if (idx === -1) return res.status(404).json({ message: 'Not found' });
	items[idx] = { ...items[idx], ...req.body, id: items[idx].id };
	writeData(FILE, items);
	return res.json(items[idx]);
});

// Delete
router.delete('/:id', (req, res) => {
	const items = readData(FILE);
	const idx = items.findIndex(i => String(i.id) === String(req.params.id));
	if (idx === -1) return res.status(404).json({ message: 'Not found' });
	const removed = items.splice(idx, 1)[0];
	writeData(FILE, items);
	return res.json(removed);
});

// Summary for a subject
router.get('/summary/subject/:subjectId', (req, res) => {
	const subjectId = String(req.params.subjectId);
	const attendance = readData(FILE).filter(a => String(a.subject_id) === subjectId);
	const byStudent = {};
	attendance.forEach(a => {
		const key = String(a.student_id);
		if (!byStudent[key]) byStudent[key] = { present: 0, total: 0 };
		byStudent[key].total += 1;
		byStudent[key].present += String(a.status).toLowerCase() === 'present' ? 1 : 0;
	});
	return res.json(byStudent);
});

// Summary for a student
router.get('/summary/student/:studentId', (req, res) => {
	const studentId = String(req.params.studentId);
	const attendance = readData(FILE).filter(a => String(a.student_id) === studentId);
	const bySubject = {};
	attendance.forEach(a => {
		const key = String(a.subject_id);
		if (!bySubject[key]) bySubject[key] = { present: 0, total: 0 };
		bySubject[key].total += 1;
		bySubject[key].present += String(a.status).toLowerCase() === 'present' ? 1 : 0;
	});
	return res.json(bySubject);
});

// CSV export
router.get('/export/csv', (req, res) => {
	const items = readData(FILE);
	const headers = ['id','student_id','subject_id','date','status','marked_by'];
	const lines = [headers.join(',')].concat(
		items.map(i => headers.map(h => (i[h] !== undefined ? String(i[h]).replace(/"/g, '""') : '')).join(','))
	);
	const csv = lines.join('\n');
	res.setHeader('Content-Type', 'text/csv');
	res.setHeader('Content-Disposition', 'attachment; filename="attendance.csv"');
	return res.send(csv);
});

// Import attendance from CSV/Excel
router.post('/import', upload.single('file'), (req, res) => {
	if (!req.file) {
		return res.status(400).json({ message: 'No file uploaded' });
	}

	const { subject_id, professor_id } = req.body;
	if (!subject_id || !professor_id) {
		return res.status(400).json({ message: 'Subject ID and Professor ID required' });
	}

	try {
		const students = readData('student');
		const items = readData(FILE);
		let nextId = getNextId(items);

		const fileExtension = req.file.originalname.toLowerCase().split('.').pop();
		let rows = [];

		// Parse Excel files (.xls, .xlsx)
		if (fileExtension === 'xlsx' || fileExtension === 'xls') {
			const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
			const sheetName = workbook.SheetNames[0];
			const worksheet = workbook.Sheets[sheetName];
			rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
		} else {
			// Parse CSV files
			const fileContent = req.file.buffer.toString('utf-8');
			rows = fileContent.split('\n')
				.map(line => line.trim())
				.filter(line => line)
				.map(line => line.split(',').map(v => v.trim().replace(/^"|"$/g, '')));
		}

		if (rows.length < 2) {
			return res.status(400).json({ message: 'File is empty or invalid format' });
		}

		const created = [];
		// Skip header row (first line)
		for (let i = 1; i < rows.length; i++) {
			const values = rows[i];
			if (!values || values.length < 3) continue;

			const regNoOrId = String(values[0] || '').trim();
			const date = String(values[1] || '').trim();
			const statusText = String(values[2] || '').trim().toLowerCase();
			const status = statusText === 'present' || statusText === 'p' ? 'Present' : 'Absent';

			// Find student by reg_no or id
			const student = students.find(s => 
				String(s.reg_no) === String(regNoOrId) || 
				String(s.id) === String(regNoOrId)
			);

			if (!student) {
				console.warn(`Student not found: ${regNoOrId}`);
				continue;
			}

			// Check if record already exists for this student, subject, and date
			const exists = items.some(item => 
				String(item.student_id) === String(student.id) &&
				String(item.subject_id) === String(subject_id) &&
				item.date === date
			);

			if (!exists) {
				created.push({
					id: nextId++,
					student_id: Number(student.id),
					subject_id: Number(subject_id),
					date: date,
					status: status,
					marked_by: Number(professor_id)
				});
			}
		}

		if (created.length === 0) {
			return res.status(400).json({ message: 'No valid records found or all records already exist' });
		}

		const updated = items.concat(created);
		writeData(FILE, updated);

		return res.status(201).json({ 
			message: `Successfully imported ${created.length} attendance records`,
			count: created.length,
			records: created
		});
	} catch (error) {
		console.error('Import error:', error);
		return res.status(500).json({ message: 'Error processing file', error: error.message });
	}
});

// Export class-wise monthly attendance
router.get('/export/class/:classId/monthly', (req, res) => {
	const { classId } = req.params;
	const { month, year } = req.query;

	if (!month || !year) {
		return res.status(400).json({ message: 'Month and year parameters required' });
	}

	try {
		const attendance = readData(FILE);
		const students = readData('student');
		const subjects = readData('subject');
		const classes = readData('class');

		const classData = classes.find(c => String(c.id) === String(classId));
		if (!classData) {
			return res.status(404).json({ message: 'Class not found' });
		}

		// Filter students by class
		const classStudents = students.filter(s => String(s.class_id) === String(classId));

		// Filter attendance by class students and date range
		const monthStart = `${year}-${String(month).padStart(2, '0')}-01`;
		const nextMonth = month === '12' ? '01' : String(Number(month) + 1).padStart(2, '0');
		const nextYear = month === '12' ? String(Number(year) + 1) : year;
		const monthEnd = `${nextYear}-${nextMonth}-01`;

		const filteredAttendance = attendance.filter(a => {
			const student = classStudents.find(s => String(s.id) === String(a.student_id));
			if (!student) return false;

			const recordDate = a.date;
			return recordDate >= monthStart && recordDate < monthEnd;
		});

		// Group by student and date
		const studentMap = {};
		classStudents.forEach(student => {
			studentMap[student.id] = {
				reg_no: student.reg_no,
				name: student.name,
				attendance: {}
			};
		});

		// Get all dates in the month
		const dates = [];
		const startDate = new Date(year, month - 1, 1);
		const endDate = new Date(year, month, 0);
		for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
			dates.push(d.toISOString().slice(0, 10));
		}

		// Initialize attendance for all dates
		Object.keys(studentMap).forEach(studentId => {
			dates.forEach(date => {
				studentMap[studentId].attendance[date] = '-';
			});
		});

		// Fill in actual attendance
		filteredAttendance.forEach(record => {
			const studentId = String(record.student_id);
			if (studentMap[studentId] && studentMap[studentId].attendance[record.date] !== undefined) {
				studentMap[studentId].attendance[record.date] = record.status === 'Present' ? 'P' : 'A';
			}
		});

		// Generate CSV
		const headers = ['Reg No', 'Student Name', ...dates];
		const lines = [headers.join(',')];

		Object.values(studentMap).forEach(student => {
			const row = [
				`"${student.reg_no}"`,
				`"${student.name}"`,
				...dates.map(date => student.attendance[date])
			];
			lines.push(row.join(','));
		});

		const csv = lines.join('\n');
		const fileName = `Attendance_${classData.class_name}_${year}_${String(month).padStart(2, '0')}.csv`;

		res.setHeader('Content-Type', 'text/csv');
		res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
		return res.send(csv);
	} catch (error) {
		console.error('Export error:', error);
		return res.status(500).json({ message: 'Error generating report', error: error.message });
	}
});

module.exports = router;




