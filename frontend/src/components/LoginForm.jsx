import React, { useState } from 'react'
import Footer from './Footer.jsx'

export default function LoginForm({ onSuccess }) {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	async function login(e) {
		e.preventDefault()
		setError('')
		setLoading(true)
		try {
			const res = await fetch('/api/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password })
			})
			if (!res.ok) throw new Error('Invalid credentials')
			const data = await res.json()
			onSuccess(data)
		} catch (err) {
			setError(err.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-bu-blue-50 via-white to-bu-blue-100 flex flex-col">
			<div className="flex-1 flex items-center justify-center py-8 px-4">
				<div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 border border-gray-100">
					<div className="text-center mb-8">
						<div className="mb-4 flex justify-center">
							<div className="relative">
								<img 
									src="/logo.png" 
									alt="Bharathiar University" 
									className="h-28 w-28 rounded-full object-cover border-4 border-bu-blue-500 shadow-lg drop-shadow-md" 
									onError={(e) => { 
										// Show fallback if logo not found
										e.target.style.display = 'none'
										const fallback = e.target.parentElement.querySelector('.logo-fallback')
										if (fallback) fallback.style.display = 'block'
									}} 
								/>
								<div className="logo-fallback hidden h-28 w-28 rounded-full bg-gradient-to-br from-bu-blue-500 to-bu-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg border-4 border-bu-blue-600">
									BU
								</div>
							</div>
						</div>
						<h1 className="text-2xl font-bold text-bu-blue-700 mb-2">Student Attendance Management System</h1>
						<p className="text-sm text-bu-blue-600 font-medium">Bharathiar University, Coimbatore</p>
					</div>
					<form onSubmit={login} className="space-y-4">
						<h2 className="text-xl font-semibold mb-4 text-center text-bu-blue-700">Login</h2>
						{error && <div className="mb-3 text-red-700 text-sm bg-red-50 border-l-4 border-red-500 rounded p-3">{error}</div>}
						<div className="mb-3">
							<label className="block text-sm mb-1 font-medium text-bu-blue-700">Username</label>
							<input 
								className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-bu-blue-500 focus:border-bu-blue-500 transition" 
								value={username} 
								onChange={e => setUsername(e.target.value)} 
								required 
							/>
						</div>
						<div className="mb-4">
							<label className="block text-sm mb-1 font-medium text-bu-blue-700">Password</label>
							<input 
								type="password" 
								className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-bu-blue-500 focus:border-bu-blue-500 transition" 
								value={password} 
								onChange={e => setPassword(e.target.value)} 
								required 
							/>
						</div>
						<button 
							disabled={loading} 
							className="w-full bg-gradient-to-r from-bu-blue-500 to-bu-blue-600 hover:from-bu-blue-600 hover:to-bu-blue-700 text-white rounded-lg py-3 font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
						>
							{loading ? 'Signing in...' : 'Login'}
						</button>
					</form>
				</div>
			</div>
			<Footer />
		</div>
	)
}




