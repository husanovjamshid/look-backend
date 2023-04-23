const fs = require('fs');
const path = require('path');

function read(fileName) {
	const data = fs.readFileSync(
		path.resolve('database', fileName + '.json'),
		'utf-8',
	);

	return JSON.parse(data);
}

function write(fileName, data) {
	fs.writeFileSync(
		path.resolve('database', fileName + '.json'),
		JSON.stringify(data, null, 4),
	);

	return true;
}

module.exports = {
	read,
	write,
};
