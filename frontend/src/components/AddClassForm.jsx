import React, { useState } from 'react'

export default function AddClassForm({ onCreated }) {
	const [form, setForm] = useState({ class_name:'', department:'', semester:'' })

	async function submit(e){
		e.preventDefault()
		await fetch('/api/class', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) })
		setForm({ class_name:'', department:'', semester:'' })
		onCreated && onCreated()
	}

	return (
		<form onSubmit={submit} className="grid grid-cols-3 gap-2">
			<input placeholder="Class Name" className="border rounded px-2 py-1" value={form.class_name} onChange={e=>setForm({...form, class_name:e.target.value})} required />
			<input placeholder="Department" className="border rounded px-2 py-1" value={form.department} onChange={e=>setForm({...form, department:e.target.value})} required />
			<input placeholder="Semester" className="border rounded px-2 py-1" value={form.semester} onChange={e=>setForm({...form, semester:e.target.value})} required />
			<div className="col-span-3">
				<button className="px-4 py-2 bg-gradient-to-r from-bu-blue-500 to-bu-blue-600 hover:from-bu-blue-600 hover:to-bu-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all font-semibold">Add Class</button>
			</div>
		</form>
	)
}




