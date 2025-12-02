import React, { useState } from 'react'

export default function AddSubjectForm({ classes, professors, onCreated }) {
	const [form, setForm] = useState({ subject_code:'', subject_name:'', class_id:'', professor_id:'' })

	async function submit(e){
		e.preventDefault()
		await fetch('/api/subject', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) })
		setForm({ subject_code:'', subject_name:'', class_id:'', professor_id:'' })
		onCreated && onCreated()
	}

	return (
		<form onSubmit={submit} className="grid grid-cols-2 gap-2">
			<input placeholder="Subject Code" className="border rounded px-2 py-1" value={form.subject_code} onChange={e=>setForm({...form, subject_code:e.target.value})} required />
			<input placeholder="Subject Name" className="border rounded px-2 py-1" value={form.subject_name} onChange={e=>setForm({...form, subject_name:e.target.value})} required />
			<select className="border rounded px-2 py-1" value={form.class_id} onChange={e=>setForm({...form, class_id:e.target.value})} required>
				<option value="">Select Class</option>
				{classes.map(c => <option key={c.id} value={c.id}>{c.class_name}</option>)}
			</select>
			<select className="border rounded px-2 py-1" value={form.professor_id} onChange={e=>setForm({...form, professor_id:e.target.value})} required>
				<option value="">Select Professor</option>
				{professors.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
			</select>
			<div className="col-span-2">
				<button className="px-4 py-2 bg-gradient-to-r from-bu-blue-500 to-bu-blue-600 hover:from-bu-blue-600 hover:to-bu-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all font-semibold">Add Subject</button>
			</div>
		</form>
	)
}




