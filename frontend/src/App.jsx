import React, { useState } from 'react'
import LoginForm from './components/LoginForm.jsx'
import AdminDashboard from './components/AdminDashboard.jsx'
import ProfessorDashboard from './components/ProfessorDashboard.jsx'
import StudentDashboard from './components/StudentDashboard.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
	const [session, setSession] = useState(() => {
		const raw = localStorage.getItem('session')
		return raw ? JSON.parse(raw) : null
	})

	function handleLoginSuccess(data) {
		localStorage.setItem('session', JSON.stringify(data))
		setSession(data)
	}

	function logout() {
		localStorage.removeItem('session')
		setSession(null)
	}

	if (!session) {
		return <LoginForm onSuccess={handleLoginSuccess} />
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-bu-blue-50 via-gray-50 to-bu-blue-100 flex flex-col">
			<div className="flex-1">
				<div className="max-w-7xl mx-auto p-4">
					<div className="flex items-center justify-between mb-6 bg-white rounded-lg shadow-lg p-4 border-l-4 border-bu-blue-500">
						<div className="flex items-center gap-4">
							<img 
								src="/logo.png" 
								alt="Bharathiar University" 
								className="h-16 w-16 rounded-full object-cover border-4 border-bu-blue-500 shadow-md" 
								onError={(e) => { 
									e.target.style.display = 'none'
								}} 
							/>
							<div>
								<h1 className="text-2xl font-bold text-bu-blue-700">Student Attendance Management System</h1>
								<p className="text-sm text-bu-blue-600 font-medium">Bharathiar University, Coimbatore</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<span className="text-sm text-bu-blue-600 capitalize font-medium bg-bu-blue-50 px-3 py-1.5 rounded-full">{session.userType}</span>
							<button 
								onClick={logout} 
								className="px-4 py-2 bg-gradient-to-r from-bu-blue-500 to-bu-blue-600 hover:from-bu-blue-600 hover:to-bu-blue-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg font-medium"
							>
								Logout
							</button>
						</div>
					</div>
					{session.userType === 'admin' && <AdminDashboard session={session} />}
					{session.userType === 'professor' && <ProfessorDashboard session={session} />}
					{session.userType === 'student' && <StudentDashboard session={session} />}
				</div>
			</div>
			<Footer />
		</div>
	)
}




