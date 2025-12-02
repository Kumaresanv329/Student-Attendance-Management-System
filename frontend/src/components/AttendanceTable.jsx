import React, { useEffect, useState } from 'react'

export default function AttendanceTable({ records, showStudentName = true }) {
	const [students, setStudents] = useState([])
	const [subjects, setSubjects] = useState([])

	useEffect(() => {
		Promise.all([
			fetch('/api/student').then(r=>r.json()),
			fetch('/api/subject').then(r=>r.json()),
		]).then(([s, sub]) => { setStudents(s); setSubjects(sub) })
	}, [])

	function nameForStudent(id){
		const s = students.find(x => String(x.id) === String(id))
		return s ? `${s.name} (${s.reg_no})` : id
	}
	function nameForSubject(id){
		const s = subjects.find(x => String(x.id) === String(id))
		return s ? `${s.subject_code} · ${s.subject_name}` : id
	}

	return (
		<table className="w-full text-sm">
			<thead>
				<tr className="text-left border-b">
					<th className="py-2">Date</th>
					{showStudentName && <th>Student</th>}
					<th>Subject</th>
					<th>Status</th>
				</tr>
			</thead>
			<tbody>
				{records.length === 0 ? (
					<tr>
						<td colSpan={showStudentName ? 4 : 3} className="py-4 text-center text-gray-500">
							No records found
						</td>
					</tr>
				) : (
					records.map(r => (
						<tr key={r.id} className="border-b last:border-0">
							<td className="py-2">{r.date}</td>
							{showStudentName && <td>{nameForStudent(r.student_id)}</td>}
							<td>{nameForSubject(r.subject_id)}</td>
							<td>
								<span className={`px-2 py-1 rounded text-xs ${
									r.status?.toLowerCase() === 'present' 
										? 'bg-green-100 text-green-800' 
										: 'bg-red-100 text-red-800'
								}`}>
									{r.status}
								</span>
							</td>
						</tr>
					))
				)}
			</tbody>
		</table>
	)
}




