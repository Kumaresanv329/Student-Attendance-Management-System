import React, { useEffect, useMemo, useState } from 'react'
import MarkAttendanceForm from './MarkAttendanceForm.jsx'
import AttendanceSummary from './AttendanceSummary.jsx'
import ImportAttendanceForm from './ImportAttendanceForm.jsx'
import MonthlyAttendanceDownload from './MonthlyAttendanceDownload.jsx'

export default function ProfessorDashboard({ session }) {
	const professorId = session?.user?.id
	const [subjects, setSubjects] = useState([])
	const [selected, setSelected] = useState('')
	const [summary, setSummary] = useState(null)
	const [activeTab, setActiveTab] = useState('mark') // 'mark' or 'import'

	useEffect(() => {
		async function load() {
			const subs = await fetch('/api/subject').then(r=>r.json())
			setSubjects(subs.filter(s => String(s.professor_id) === String(professorId)))
		}
		load()
	}, [professorId])

	useEffect(() => {
		async function loadSummary() {
			if (!selected) return setSummary(null)
			const res = await fetch(`/api/attendance/summary/subject/${selected}`)
			const data = await res.json()
			setSummary(data)
		}
		loadSummary()
	}, [selected])

	function handleImportSuccess() {
		// Reload summary after import
		if (selected) {
			async function reloadSummary() {
				const res = await fetch(`/api/attendance/summary/subject/${selected}`)
				const data = await res.json()
				setSummary(data)
			}
			reloadSummary()
		}
	}

	const professorName = session?.user?.name || 'Professor'

	return (
		<div className="space-y-6">
			{/* Welcome Section */}
			<div className="bg-gradient-to-r from-bu-blue-500 to-bu-blue-600 rounded-lg shadow-lg p-6 text-white">
				<h2 className="text-3xl font-bold mb-2">Welcome, {professorName}!</h2>
				<p className="text-bu-blue-100 text-lg">Professor Dashboard - Manage your classes and attendance</p>
			</div>
			
			<div className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-bu-blue-500">
				<div className="flex gap-3 items-end">
					<div className="flex-1">
						<label className="block text-sm mb-1 font-semibold text-bu-blue-700">Select Subject</label>
						<select value={selected} onChange={e=>setSelected(e.target.value)} className="border-2 border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-bu-blue-500 focus:border-bu-blue-500">
							<option value="">Choose</option>
							{subjects.map(s => <option key={s.id} value={s.id}>{s.subject_code} · {s.subject_name}</option>)}
						</select>
					</div>
				</div>
			</div>

			{selected && (
				<div className="bg-white rounded-lg shadow-lg p-4">
					<div className="flex gap-2 mb-4 border-b border-gray-200">
						<button
							onClick={() => setActiveTab('mark')}
							className={`px-4 py-2 font-semibold transition-all ${activeTab === 'mark' ? 'border-b-2 border-bu-blue-500 text-bu-blue-600' : 'text-gray-600 hover:text-bu-blue-600'}`}
						>
							Mark Attendance
						</button>
						<button
							onClick={() => setActiveTab('import')}
							className={`px-4 py-2 font-semibold transition-all ${activeTab === 'import' ? 'border-b-2 border-bu-blue-500 text-bu-blue-600' : 'text-gray-600 hover:text-bu-blue-600'}`}
						>
							Import from CSV/Excel
						</button>
					</div>
					{activeTab === 'mark' && <MarkAttendanceForm subjectId={selected} professorId={professorId} />}
					{activeTab === 'import' && (
						<ImportAttendanceForm 
							subjectId={selected} 
							professorId={professorId} 
							onImportSuccess={handleImportSuccess}
						/>
					)}
				</div>
			)}
			{selected && <AttendanceSummary subjectId={selected} data={summary} />}
			
			{/* Monthly Download Section */}
			{selected && (() => {
				const selectedSubject = subjects.find(s => String(s.id) === String(selected))
				if (!selectedSubject) return null
				return (
					<MonthlyAttendanceDownload 
						classId={selectedSubject.class_id} 
						className={selectedSubject.subject_code}
					/>
				)
			})()}
		</div>
	)
}




