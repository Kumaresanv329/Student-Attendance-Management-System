import React, { useEffect, useMemo, useState } from 'react'

export default function MarkAttendanceForm({ subjectId, professorId }) {
	const [students, setStudents] = useState([])
	const [subject, setSubject] = useState(null)
	const [date, setDate] = useState(() => new Date().toISOString().slice(0,10))
	const [hour, setHour] = useState('1')
	const [statuses, setStatuses] = useState({})
	const [saved, setSaved] = useState(false)

	useEffect(() => {
		async function load() {
			const [subj, allStudents, classes] = await Promise.all([
				fetch('/api/subject').then(r=>r.json()),
				fetch('/api/student').then(r=>r.json()),
				fetch('/api/class').then(r=>r.json()),
			])
			const s = subj.find(x=> String(x.id) === String(subjectId))
			setSubject(s)
			const inClass = allStudents.filter(st => String(st.class_id) === String(s.class_id))
			setStudents(inClass)
			setStatuses(Object.fromEntries(inClass.map(st => [st.id, 'Present'])))
		}
		load()
	}, [subjectId])

	async function save() {
		const records = students.map(st => ({
			student_id: st.id,
			subject_id: Number(subjectId),
			date,
			hour: Number(hour),
			status: statuses[st.id] || 'Absent',
			marked_by: professorId,
		}))
		await fetch('/api/attendance/bulk', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ records }) })
		setSaved(true)
		setTimeout(()=>setSaved(false), 2000)
	}

	return (
		<div className="bg-white rounded shadow p-4">
			<h3 className="text-lg font-semibold mb-3">Mark Attendance</h3>
			<div className="flex gap-4 mb-4">
				<div>
					<label className="block text-sm mb-1">Date</label>
					<input type="date" value={date} onChange={e=>setDate(e.target.value)} className="border rounded px-2 py-1" />
				</div>
				<div>
					<label className="block text-sm mb-1">Hour</label>
					<select value={hour} onChange={e=>setHour(e.target.value)} className="border rounded px-2 py-1">
						<option value="1">Hour 1</option>
						<option value="2">Hour 2</option>
						<option value="3">Hour 3</option>
						<option value="4">Hour 4</option>
						<option value="5">Hour 5</option>
						<option value="6">Hour 6</option>
					</select>
				</div>
			</div>
			<table className="w-full text-sm">
				<thead>
					<tr className="text-left border-b">
						<th className="py-2">Reg No</th>
						<th>Name</th>
						<th>Status</th>
					</tr>
				</thead>
				<tbody>
					{students.map(st => (
						<tr key={st.id} className="border-b last:border-0">
							<td className="py-2">{st.reg_no}</td>
							<td>{st.name}</td>
							<td>
								<select value={statuses[st.id]} onChange={e=>setStatuses({...statuses, [st.id]: e.target.value})} className="border rounded px-2 py-1">
									<option>Present</option>
									<option>Absent</option>
								</select>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<div className="mt-3">
				<button onClick={save} className="px-4 py-2 bg-gradient-to-r from-bu-blue-500 to-bu-blue-600 hover:from-bu-blue-600 hover:to-bu-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all font-semibold">Save Attendance</button>
				{saved && <span className="ml-3 text-emerald-700">Saved!</span>}
			</div>
		</div>
	)
}




