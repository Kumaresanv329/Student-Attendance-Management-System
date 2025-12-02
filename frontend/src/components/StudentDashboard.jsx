import React, { useEffect, useState, useCallback } from 'react'
import AttendanceTable from './AttendanceTable.jsx'
import DateBasedAttendance from './DateBasedAttendance.jsx'
import CourseWiseAttendance from './CourseWiseAttendance.jsx'

export default function StudentDashboard({ session }) {
	const studentId = session?.user?.id
	const [records, setRecords] = useState([])
	const [summary, setSummary] = useState({})
	const [loading, setLoading] = useState(true)
	const [refreshing, setRefreshing] = useState(false)
	const [activeView, setActiveView] = useState('overview') // 'overview', 'date', 'course'

	const loadAttendance = useCallback(async () => {
		if (!studentId) return
		try {
			const all = await fetch('/api/attendance').then(r=>r.json())
			// Filter by student_id - ensure both are converted to strings for comparison
			const filtered = all.filter(r => String(r.student_id) === String(studentId))
			setRecords(filtered)
			const sum = await fetch(`/api/attendance/summary/student/${studentId}`).then(r=>r.json())
			setSummary(sum)
		} catch (error) {
			console.error('Error loading attendance:', error)
		} finally {
			setLoading(false)
			setRefreshing(false)
		}
	}, [studentId])

	useEffect(() => {
		loadAttendance()
	}, [loadAttendance])

	function handleRefresh() {
		setRefreshing(true)
		loadAttendance()
	}

	if (loading) {
		return <div className="text-center py-8">Loading attendance data...</div>
	}

	const studentName = session?.user?.name || session?.user?.reg_no || 'Student'

	return (
		<div className="space-y-6">
			{/* Welcome Section */}
			<div className="bg-gradient-to-r from-bu-blue-500 to-bu-blue-600 rounded-lg shadow-lg p-6 text-white">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-3xl font-bold mb-2">Welcome, {studentName}!</h2>
						<p className="text-bu-blue-100 text-lg">Student Dashboard - View your attendance and progress</p>
						{session?.user?.reg_no && (
							<p className="text-bu-blue-100 text-sm mt-1">Registration No: {session.user.reg_no}</p>
						)}
					</div>
					<button 
						onClick={handleRefresh} 
						disabled={refreshing}
						className="px-4 py-2 bg-white text-bu-blue-600 rounded-lg text-sm disabled:opacity-50 shadow-md hover:shadow-lg transition-all font-semibold hover:bg-bu-blue-50"
					>
						{refreshing ? 'Refreshing...' : 'Refresh'}
					</button>
				</div>
			</div>

			{/* Navigation Tabs */}
			<div className="bg-white rounded-lg shadow-lg p-4">
				<div className="flex gap-2 border-b border-gray-200">
					<button
						onClick={() => setActiveView('overview')}
						className={`px-4 py-2 font-semibold transition-all ${activeView === 'overview' ? 'border-b-2 border-bu-blue-500 text-bu-blue-600' : 'text-gray-600 hover:text-bu-blue-600'}`}
					>
						All Records
					</button>
					<button
						onClick={() => setActiveView('date')}
						className={`px-4 py-2 font-semibold transition-all ${activeView === 'date' ? 'border-b-2 border-bu-blue-500 text-bu-blue-600' : 'text-gray-600 hover:text-bu-blue-600'}`}
					>
						View by Date
					</button>
					<button
						onClick={() => setActiveView('course')}
						className={`px-4 py-2 font-semibold transition-all ${activeView === 'course' ? 'border-b-2 border-bu-blue-500 text-bu-blue-600' : 'text-gray-600 hover:text-bu-blue-600'}`}
					>
						Course-wise
					</button>
				</div>
			</div>

			{/* Content based on active view */}
			{activeView === 'overview' && (
				<div className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-bu-blue-500">
					<h3 className="font-bold mb-2 text-bu-blue-700">Your Attendance Records</h3>
					{records.length === 0 ? (
						<p className="text-gray-500 py-4">No attendance records found.</p>
					) : (
						<AttendanceTable records={records} showStudentName={false} />
					)}
				</div>
			)}

			{activeView === 'date' && (
				<DateBasedAttendance studentId={studentId} records={records} />
			)}

			{activeView === 'course' && (
				<CourseWiseAttendance studentId={studentId} records={records} summary={summary} />
			)}
		</div>
	)
}




