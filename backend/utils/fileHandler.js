const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');

function getFilePath(fileName) {
	return path.join(dataDir, `${fileName}.json`);
}

function ensureFile(fileName) {
	const filePath = getFilePath(fileName);
	if (!fs.existsSync(dataDir)) {
		fs.mkdirSync(dataDir, { recursive: true });
	}
	if (!fs.existsSync(filePath)) {
		fs.writeFileSync(filePath, '[]', 'utf-8');
	}
	return filePath;
}

function readData(fileName) {
	const filePath = ensureFile(fileName);
	const content = fs.readFileSync(filePath, 'utf-8');
	try {
		const data = JSON.parse(content || '[]');
		if (!Array.isArray(data)) return [];
		return data;
	} catch {
		return [];
	}
}

function writeData(fileName, data) {
	const filePath = ensureFile(fileName);
	fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function getNextId(items) {
	if (!Array.isArray(items) || items.length === 0) return 1;
	return Math.max(...items.map(i => Number(i.id) || 0)) + 1;
}

module.exports = {
	readData,
	writeData,
	getNextId,
};









