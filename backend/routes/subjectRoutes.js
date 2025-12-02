const express = require('express');
const { readData, writeData, getNextId } = require('../utils/fileHandler');

const router = express.Router();
const FILE = 'subject';

router.get('/', (req, res) => {
	return res.json(readData(FILE));
});

router.get('/:id', (req, res) => {
	const items = readData(FILE);
	const item = items.find(i => String(i.id) === String(req.params.id));
	if (!item) return res.status(404).json({ message: 'Not found' });
	return res.json(item);
});

router.post('/', (req, res) => {
	const items = readData(FILE);
	const newItem = { id: getNextId(items), ...req.body };
	items.push(newItem);
	writeData(FILE, items);
	return res.status(201).json(newItem);
});

router.put('/:id', (req, res) => {
	const items = readData(FILE);
	const idx = items.findIndex(i => String(i.id) === String(req.params.id));
	if (idx === -1) return res.status(404).json({ message: 'Not found' });
	items[idx] = { ...items[idx], ...req.body, id: items[idx].id };
	writeData(FILE, items);
	return res.json(items[idx]);
});

router.delete('/:id', (req, res) => {
	const items = readData(FILE);
	const idx = items.findIndex(i => String(i.id) === String(req.params.id));
	if (idx === -1) return res.status(404).json({ message: 'Not found' });
	const removed = items.splice(idx, 1)[0];
	writeData(FILE, items);
	return res.json(removed);
});

module.exports = router;









