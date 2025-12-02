import React, { useState } from 'react'

export default function ImportAttendanceForm({ subjectId, professorId, onImportSuccess }) {
	const [file, setFile] = useState(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [success, setSuccess] = useState(false)

	function handleFileChange(e) {
		const selectedFile = e.target.files[0]
		if (selectedFile) {
			const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
			const validExtensions = ['.csv', '.xls', '.xlsx']
			const fileExtension = selectedFile.name.toLowerCase().substring(selectedFile.name.lastIndexOf('.'))
			
			if (!validTypes.includes(selectedFile.type) && !validExtensions.includes(fileExtension)) {
				setError('Please upload a CSV or Excel file (.csv, .xls, .xlsx)')
				setFile(null)
				return
			}
			setError('')
			setFile(selectedFile)
		}
	}

	async function handleImport() {
		if (!file || !subjectId) {
			setError('Please select a file and subject')
			return
		}

		setLoading(true)
		setError('')
		setSuccess(false)

		try {
			const formData = new FormData()
			formData.append('file', file)
			formData.append('subject_id', subjectId)
			formData.append('professor_id', professorId)

			const res = await fetch('/api/attendance/import', {
				method: 'POST',
				body: formData
			})

			const data = await res.json()

			if (!res.ok) {
				throw new Error(data.message || 'Import failed')
			}

			setSuccess(true)
			setFile(null)
			if (onImportSuccess) {
				onImportSuccess()
			}
			setTimeout(() => setSuccess(false), 3000)
		} catch (err) {
			setError(err.message || 'Failed to import attendance')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="bg-white rounded shadow p-4">
			<h3 className="text-lg font-semibold mb-3">Import Attendance from CSV/Excel</h3>
			
			{error && (
				<div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
					{error}
				</div>
			)}

			{success && (
				<div className="mb-3 p-2 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
					Attendance imported successfully!
				</div>
			)}

			<div className="mb-3">
				<label className="block text-sm mb-1 font-medium">Select CSV/Excel File</label>
				<input
					type="file"
					accept=".csv,.xls,.xlsx"
					onChange={handleFileChange}
					className="w-full border rounded px-3 py-2 text-sm"
					disabled={loading}
				/>
				<p className="text-xs text-gray-500 mt-1">
					Supported formats: CSV, XLS, XLSX. First row should be headers. Columns: Reg No/Student ID, Date (YYYY-MM-DD), Status
				</p>
			</div>

			<div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
				<p className="font-semibold mb-1">CSV/Excel Format:</p>
				<p className="text-xs">• Column 1: Reg No (e.g., 24CSEA036) or Student ID</p>
				<p className="text-xs">• Column 2: Date (YYYY-MM-DD format, e.g., 2024-11-06)</p>
				<p className="text-xs">• Column 3: Status (Present/Absent or P/A)</p>
				<p className="text-xs mt-1 text-gray-600">Note: First row should contain headers. Excel files (.xls, .xlsx) are automatically converted.</p>
			</div>

			<button
				onClick={handleImport}
				disabled={loading || !file}
				className="px-4 py-2 bg-gradient-to-r from-bu-blue-500 to-bu-blue-600 hover:from-bu-blue-600 hover:to-bu-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
			>
				{loading ? 'Importing...' : 'Import Attendance'}
			</button>
		</div>
	)
}

