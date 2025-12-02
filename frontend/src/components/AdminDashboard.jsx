import React, { useEffect, useState } from 'react'
import AddStudentForm from './AddStudentForm.jsx'
import AddProfessorForm from './AddProfessorForm.jsx'
import AddClassForm from './AddClassForm.jsx'
import AddSubjectForm from './AddSubjectForm.jsx'
import MonthlyAttendanceDownload from './MonthlyAttendanceDownload.jsx'

function Section({ title, children }) {
	return (
		<div className="bg-white rounded shadow p-4">
			<h3 className="text-lg font-semibold mb-3">{title}</h3>
			{children}
		</div>
	)
}

export default function AdminDashboard() {
	const [students, setStudents] = useState([])
	const [professors, setProfessors] = useState([])
	const [classes, setClasses] = useState([])
	const [subjects, setSubjects] = useState([])

	async function loadAll() {
		const [s, p, c, sub] = await Promise.all([
			fetch('/api/student').then(r=>r.json()),
			fetch('/api/professor').then(r=>r.json()),
			fetch('/api/class').then(r=>r.json()),
			fetch('/api/subject').then(r=>r.json()),
		])
		setStudents(s); setProfessors(p); setClasses(c); setSubjects(sub)
	}

	useEffect(()=>{ loadAll() }, [])

	async function remove(path, id) {
		await fetch(`/api/${path}/${id}`, { method: 'DELETE' })
		await loadAll()
	}

	async function exportCSV() {
		const res = await fetch('/api/attendance/export/csv')
		const blob = await res.blob()
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = 'attendance.csv'
		document.body.appendChild(a)
		a.click()
		a.remove()
		URL.revokeObjectURL(url)
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold text-bu-blue-700">Admin Dashboard</h2>
				<button onClick={exportCSV} className="px-4 py-2 bg-gradient-to-r from-bu-blue-500 to-bu-blue-600 hover:from-bu-blue-600 hover:to-bu-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all font-semibold">Export Attendance CSV</button>
			</div>

			<div className="grid md:grid-cols-2 gap-6">
				<Section title="Students">
					<AddStudentForm classes={classes} onCreated={loadAll} />
					<ul className="mt-3 divide-y">
						{students.map(s => (
							<li key={s.id} className="py-2 flex items-center justify-between">
								<span>{s.name} · {s.reg_no}</span>
								<button onClick={()=>remove('student', s.id)} className="text-red-600 text-sm">Delete</button>
							</li>
						))}
					</ul>
				</Section>

				<Section title="Professors">
					<AddProfessorForm onCreated={loadAll} />
					<ul className="mt-3 divide-y">
						{professors.map(p => (
							<li key={p.id} className="py-2 flex items-center justify-between">
								<span>{p.name} · {p.department}</span>
								<button onClick={()=>remove('professor', p.id)} className="text-red-600 text-sm">Delete</button>
							</li>
						))}
					</ul>
				</Section>
			</div>

			<div className="grid md:grid-cols-2 gap-6">
				<Section title="Classes">
					<AddClassForm onCreated={loadAll} />
					<ul className="mt-3 divide-y">
						{classes.map(c => (
							<li key={c.id} className="py-2 flex items-center justify-between">
								<span>{c.class_name} · {c.department} · Sem {c.semester}</span>
								<button onClick={()=>remove('class', c.id)} className="text-red-600 text-sm">Delete</button>
							</li>
						))}
					</ul>
				</Section>

				<Section title="Subjects">
					<AddSubjectForm classes={classes} professors={professors} onCreated={loadAll} />
					<ul className="mt-3 divide-y">
						{subjects.map(s => (
							<li key={s.id} className="py-2 flex items-center justify-between">
								<span>{s.subject_code} · {s.subject_name}</span>
								<button onClick={()=>remove('subject', s.id)} className="text-red-600 text-sm">Delete</button>
							</li>
						))}
					</ul>
				</Section>
			</div>

			{/* Monthly Attendance Download */}
			<div className="bg-white rounded shadow p-4">
				<h3 className="text-lg font-semibold mb-4">Download Monthly Attendance Reports</h3>
				<div className="grid md:grid-cols-2 gap-4">
					{classes.map(c => (
						<MonthlyAttendanceDownload 
							key={c.id}
							classId={c.id} 
							className={c.class_name}
						/>
					))}
				</div>
			</div>
		</div>
	)
}




