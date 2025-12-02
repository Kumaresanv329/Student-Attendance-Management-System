import React, { useState, useEffect, useMemo } from 'react'

export default function CourseWiseAttendance({ studentId, records, summary }) {
	const [subjects, setSubjects] = useState([])

	useEffect(() => {
		async function loadSubjects() {
			const subs = await fetch('/api/subject').then(r => r.json())
			setSubjects(subs)
		}
		loadSubjects()
	}, [])

	// Calculate course-wise statistics
	const courseStats = useMemo(() => {
		if (!summary || Object.keys(summary).length === 0) return []

		return Object.entries(summary).map(([subjectId, stats]) => {
			const subject = subjects.find(s => String(s.id) === String(subjectId))
			if (!subject) return null

			const total = stats.total || 0
			const present = stats.present || 0
			const absent = total - present
			const percentage = total > 0 ? Math.round((present / total) * 100) : 0

			// Calculate total present hours (assuming each record = 1 hour)
			// If you want to track hours separately, you can modify this
			const totalPresentHours = present

			return {
				subject_id: subjectId,
				subject_code: subject.subject_code,
				subject_name: subject.subject_name,
				totalPresent: present,
				totalPresentHours: totalPresentHours,
				totalAbsent: absent,
				totalPercentage: percentage,
				totalClasses: total
			}
		}).filter(Boolean).sort((a, b) => a.subject_code.localeCompare(b.subject_code))
	}, [summary, subjects])

	return (
		<div className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-bu-blue-500">
			<h3 className="text-lg font-bold mb-4 text-bu-blue-700">Course-wise Attendance</h3>
			
			{courseStats.length === 0 ? (
				<p className="text-gray-500 py-4">No attendance records found.</p>
			) : (
				<div className="overflow-x-auto">
					<table className="w-full text-sm border-collapse">
						<thead>
							<tr className="bg-gray-50 border-b">
								<th className="px-3 py-2 text-left border">Sub Code</th>
								<th className="px-3 py-2 text-left border">Subject</th>
								<th className="px-3 py-2 text-center border">Total Present</th>
								<th className="px-3 py-2 text-center border">Total Present Hours</th>
								<th className="px-3 py-2 text-center border">Total Absent</th>
								<th className="px-3 py-2 text-center border">Total Percentage</th>
							</tr>
						</thead>
						<tbody>
							{courseStats.map((course, idx) => (
								<tr key={idx} className="border-b hover:bg-gray-50">
									<td className="px-3 py-2 border font-medium">{course.subject_code}</td>
									<td className="px-3 py-2 border">{course.subject_name}</td>
									<td className="px-3 py-2 text-center border">
										<span className="font-semibold text-green-600">{course.totalPresent}</span>
									</td>
									<td className="px-3 py-2 text-center border">
										<span className="font-semibold">{course.totalPresentHours}</span>
									</td>
									<td className="px-3 py-2 text-center border">
										<span className="font-semibold text-red-600">{course.totalAbsent}</span>
									</td>
									<td className="px-3 py-2 text-center border">
										<span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
											course.totalPercentage >= 75
												? 'bg-green-100 text-green-800'
												: course.totalPercentage >= 60
												? 'bg-yellow-100 text-yellow-800'
												: 'bg-red-100 text-red-800'
										}`}>
											{course.totalPercentage}%
										</span>
									</td>
								</tr>
							))}
						</tbody>
						<tfoot>
							<tr className="bg-gray-100 font-semibold">
								<td colSpan="2" className="px-3 py-2 border text-right">Total:</td>
								<td className="px-3 py-2 text-center border">
									{courseStats.reduce((sum, c) => sum + c.totalPresent, 0)}
								</td>
								<td className="px-3 py-2 text-center border">
									{courseStats.reduce((sum, c) => sum + c.totalPresentHours, 0)}
								</td>
								<td className="px-3 py-2 text-center border">
									{courseStats.reduce((sum, c) => sum + c.totalAbsent, 0)}
								</td>
								<td className="px-3 py-2 text-center border">
									{courseStats.length > 0 
										? Math.round(
											courseStats.reduce((sum, c) => sum + c.totalPresent, 0) / 
											courseStats.reduce((sum, c) => sum + c.totalClasses, 0) * 100
										)
										: 0
									}%
								</td>
							</tr>
						</tfoot>
					</table>
				</div>
			)}
		</div>
	)
}

