import React, { useEffect, useState } from 'react'

export default function AttendanceSummary({ subjectId, data }) {
	const [students, setStudents] = useState([])

	useEffect(() => {
		fetch('/api/student').then(r=>r.json()).then(setStudents)
	}, [])

	if (!data) return null

	return (
		<div className="bg-white rounded shadow p-4">
			<h3 className="text-lg font-semibold mb-3">Subject Attendance Summary</h3>
			<table className="w-full text-sm">
				<thead>
					<tr className="text-left border-b">
						<th className="py-2">Student</th>
						<th>Present</th>
						<th>Total</th>
						<th>%</th>
					</tr>
				</thead>
				<tbody>
					{Object.entries(data).map(([studentId, v]) => {
						const st = students.find(s => String(s.id) === String(studentId))
						const pct = v.total ? Math.round((v.present / v.total) * 100) : 0
						return (
							<tr key={studentId} className="border-b last:border-0">
								<td className="py-2">{st ? st.name : studentId}</td>
								<td>{v.present}</td>
								<td>{v.total}</td>
								<td>{pct}%</td>
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	)
}









