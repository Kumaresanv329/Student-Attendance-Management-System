import React, { useState } from 'react'

export default function AddStudentForm({ classes, onCreated }) {
	const [form, setForm] = useState({ reg_no:'', name:'', username:'', password:'', email:'', class_id:'' })

	async function submit(e){
		e.preventDefault()
		await fetch('/api/student', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) })
		setForm({ reg_no:'', name:'', username:'', password:'', email:'', class_id:'' })
		onCreated && onCreated()
	}

	return (
		<form onSubmit={submit} className="grid grid-cols-2 gap-2">
			<input placeholder="Reg No" className="border rounded px-2 py-1" value={form.reg_no} onChange={e=>setForm({...form, reg_no:e.target.value})} required />
			<input placeholder="Name" className="border rounded px-2 py-1" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
			<input placeholder="Username" className="border rounded px-2 py-1" value={form.username} onChange={e=>setForm({...form, username:e.target.value})} required />
			<input type="password" placeholder="Password" className="border rounded px-2 py-1" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required />
			<input placeholder="Email" className="border rounded px-2 py-1" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
			<select className="border rounded px-2 py-1" value={form.class_id} onChange={e=>setForm({...form, class_id:e.target.value})} required>
				<option value="">Select Class</option>
				{classes.map(c => <option key={c.id} value={c.id}>{c.class_name}</option>)}
			</select>
			<div className="col-span-2">
				<button className="px-4 py-2 bg-gradient-to-r from-bu-blue-500 to-bu-blue-600 hover:from-bu-blue-600 hover:to-bu-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all font-semibold">Add Student</button>
			</div>
		</form>
	)
}




