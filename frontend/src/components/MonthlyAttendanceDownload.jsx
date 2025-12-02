import React, { useEffect, useState } from 'react'

export default function MonthlyAttendanceDownload({ classId, className }) {
	const [month, setMonth] = useState(() => {
		const now = new Date()
		return String(now.getMonth() + 1)
	})
	const [year, setYear] = useState(() => {
		const now = new Date()
		return String(now.getFullYear())
	})
	const [loading, setLoading] = useState(false)

	async function handleDownload() {
		if (!classId || !month || !year) {
			alert('Please select class, month, and year')
			return
		}

		setLoading(true)
		try {
			const url = `/api/attendance/export/class/${classId}/monthly?month=${month}&year=${year}`
			const response = await fetch(url)
			
			if (!response.ok) {
				throw new Error('Failed to download attendance')
			}

			const blob = await response.blob()
			const downloadUrl = window.URL.createObjectURL(blob)
			const link = document.createElement('a')
			link.href = downloadUrl
			link.download = `Attendance_${className}_${year}_${String(month).padStart(2, '0')}.csv`
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
			window.URL.revokeObjectURL(downloadUrl)
		} catch (error) {
			alert('Error downloading attendance: ' + error.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="bg-white rounded shadow p-4">
			<h3 className="text-lg font-semibold mb-3">Download Monthly Attendance Sheet</h3>
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div>
					<label className="block text-sm mb-1 font-medium">Class</label>
					<input 
						type="text" 
						value={className || ''} 
						disabled 
						className="w-full border rounded px-3 py-2 bg-gray-100"
					/>
				</div>
				<div>
					<label className="block text-sm mb-1 font-medium">Month</label>
					<select 
						value={month} 
						onChange={e => setMonth(e.target.value)}
						className="w-full border rounded px-3 py-2"
					>
						{Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
							<option key={m} value={m}>
								{new Date(2000, m - 1).toLocaleString('default', { month: 'long' })}
							</option>
						))}
					</select>
				</div>
				<div>
					<label className="block text-sm mb-1 font-medium">Year</label>
					<select 
						value={year} 
						onChange={e => setYear(e.target.value)}
						className="w-full border rounded px-3 py-2"
					>
						{Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(y => (
							<option key={y} value={y}>{y}</option>
						))}
					</select>
				</div>
				<div className="flex items-end">
					<button
						onClick={handleDownload}
						disabled={loading || !classId}
						className="w-full px-4 py-2 bg-gradient-to-r from-bu-blue-500 to-bu-blue-600 hover:from-bu-blue-600 hover:to-bu-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
					>
						{loading ? 'Downloading...' : 'Download CSV'}
					</button>
				</div>
			</div>
			<p className="text-xs text-gray-500 mt-2">
				Downloads a monthly attendance sheet with all students and dates for the selected month.
			</p>
		</div>
	)
}

