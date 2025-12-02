import React, { useState, useEffect, useMemo } from 'react'

export default function DateBasedAttendance({ studentId, records }) {
	const [selectedDate, setSelectedDate] = useState('')
	const [subjects, setSubjects] = useState([])
	const [dateRecords, setDateRecords] = useState([])

	// Get today's date in YYYY-MM-DD format
	const today = new Date().toISOString().slice(0, 10)
	
	// Get max date (today) - no future dates
	const maxDate = today

	useEffect(() => {
		async function loadSubjects() {
			const subs = await fetch('/api/subject').then(r => r.json())
			setSubjects(subs)
		}
		loadSubjects()
	}, [])

	// Filter records for selected date
	useEffect(() => {
		if (selectedDate && studentId) {
			const filtered = records.filter(r => 
				r.date === selectedDate && 
				String(r.student_id) === String(studentId)
			)
			setDateRecords(filtered)
		} else {
			setDateRecords([])
		}
	}, [selectedDate, studentId, records])

	// Group records by subject and hour
	const groupedData = useMemo(() => {
		if (!selectedDate || dateRecords.length === 0) return []

		// Group records by subject
		const subjectGroups = {}
		dateRecords.forEach(record => {
			const subjectId = String(record.subject_id)
			if (!subjectGroups[subjectId]) {
				const subject = subjects.find(s => String(s.id) === subjectId)
				subjectGroups[subjectId] = {
					subject_id: subjectId,
					subject_code: subject?.subject_code || 'N/A',
					subject_name: subject?.subject_name || 'N/A',
					records: []
				}
			}
			subjectGroups[subjectId].records.push(record)
		})

		// Convert to array and assign hours
		return Object.values(subjectGroups).map(subject => {
			const hours = {}
			// Initialize all 6 hours as empty
			for (let i = 1; i <= 6; i++) {
				hours[`hour${i}`] = '-'
			}

			// Assign records to hours (if hour field exists, use it; otherwise assign sequentially)
			// If multiple records exist for same hour, show the last one
			subject.records.forEach((record, index) => {
				const hourNum = record.hour || (index + 1)
				if (hourNum >= 1 && hourNum <= 6) {
					const hourKey = `hour${hourNum}`
					// Only update if not already set, or if we want to show the latest (current behavior)
					hours[hourKey] = record.status === 'Present' ? 'P' : 'A'
				}
			})

			return {
				...subject,
				hours
			}
		})
	}, [dateRecords, subjects, selectedDate])

	function getSubjectName(subjectId) {
		const subject = subjects.find(s => String(s.id) === String(subjectId))
		return subject ? `${subject.subject_code} - ${subject.subject_name}` : 'Unknown'
	}

	return (
		<div className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-bu-blue-500">
			<h3 className="text-lg font-bold mb-4 text-bu-blue-700">View Attendance by Date</h3>
			
			<div className="mb-4">
					<label className="block text-sm mb-1 font-semibold text-bu-blue-700">Select Date</label>
					<input
						type="date"
						value={selectedDate}
						onChange={(e) => setSelectedDate(e.target.value)}
						max={maxDate}
						className="border-2 border-gray-200 rounded-lg px-4 py-2 w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-bu-blue-500 focus:border-bu-blue-500"
					/>
				<p className="text-xs text-gray-500 mt-1">Only past and current dates are allowed</p>
			</div>

			{selectedDate && (
				<div className="mt-4">
					<h4 className="font-semibold mb-2">Attendance for {selectedDate}</h4>
					{groupedData.length === 0 ? (
						<p className="text-gray-500 py-4">No attendance records found for this date.</p>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full text-sm border-collapse">
								<thead>
									<tr className="bg-gray-50 border-b">
										<th className="px-3 py-2 text-left border">Subject Code</th>
										<th className="px-3 py-2 text-left border">Subject Name</th>
										<th className="px-3 py-2 text-center border">Hour 1</th>
										<th className="px-3 py-2 text-center border">Hour 2</th>
										<th className="px-3 py-2 text-center border">Hour 3</th>
										<th className="px-3 py-2 text-center border">Hour 4</th>
										<th className="px-3 py-2 text-center border">Hour 5</th>
										<th className="px-3 py-2 text-center border">Hour 6</th>
									</tr>
								</thead>
								<tbody>
									{groupedData.map((item, idx) => (
										<tr key={idx} className="border-b hover:bg-gray-50">
											<td className="px-3 py-2 border">{item.subject_code}</td>
											<td className="px-3 py-2 border">{item.subject_name}</td>
											{[1, 2, 3, 4, 5, 6].map(hourNum => {
												const hourKey = `hour${hourNum}`
												const status = item.hours[hourKey]
												return (
													<td key={hourNum} className="px-3 py-2 text-center border">
														<span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
															status === 'P' 
																? 'bg-green-100 text-green-800' 
																: status === 'A'
																? 'bg-red-100 text-red-800'
																: 'bg-gray-100 text-gray-500'
														}`}>
															{status}
														</span>
													</td>
												)
											})}
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			)}
		</div>
	)
}

