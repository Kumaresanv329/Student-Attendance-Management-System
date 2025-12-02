import React from 'react'

export default function Footer() {
	const currentYear = new Date().getFullYear()

	return (
		<footer className="bg-bu-blue-700 text-white mt-12">
			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{/* University Info */}
					<div>
						<h3 className="text-lg font-bold mb-4 text-bu-blue-200">Bharathiar University</h3>
						<p className="text-bu-blue-100 text-sm mb-2">Coimbatore, Tamil Nadu, India</p>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="text-lg font-bold mb-4 text-bu-blue-200">Quick Links</h3>
						<ul className="space-y-2 text-sm">
							<li><a href="https://b-u.ac.in" target="_blank" rel="noopener noreferrer" className="text-bu-blue-100 hover:text-white transition">University Website</a></li>
							<li><a href="https://b-u.ac.in/273/university-logo" target="_blank" rel="noopener noreferrer" className="text-bu-blue-100 hover:text-white transition">University Logo</a></li>
						</ul>
					</div>

					{/* Contact Info */}
					<div>
						<h3 className="text-lg font-bold mb-4 text-bu-blue-200">Contact</h3>
						<p className="text-bu-blue-100 text-sm mb-2">Bharathiar University</p>
						<p className="text-bu-blue-100 text-sm">Coimbatore - 641 046</p>
						<p className="text-bu-blue-100 text-sm mt-2">Tamil Nadu, India</p>
					</div>
				</div>

				{/* Copyright */}
				<div className="border-t border-bu-blue-600 mt-8 pt-6 text-center">
					<p className="text-bu-blue-200 text-sm">
						© {currentYear} Bharathiar University. All rights reserved.
					</p>
					<p className="text-bu-blue-200 text-xs mt-2">
						Student Attendance Management System
					</p>
				</div>
			</div>
		</footer>
	)
}

