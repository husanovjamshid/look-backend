const fs = require('fs');
const http = require('http');
const Express = require('./lib/express');
const { read, write } = require('./utils/modul');

function httpServer(req, res) {
	let app = new Express(req, res);

	app.get('/foods', (req, res) => {
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.end(JSON.stringify(read('foods')));
	});

	app.get('/users', (req, res) => {
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.end(JSON.stringify(read('users')));
	});

	app.post('users', (req, res) => {
		let str = '';
		req.on('data', (chunk) => (str += chunk));
		req.on('end', () => {
			let user = read('users');
			let { username, contact } = JSON.parse(str);
			let newUser = { userId: user.at(-1)?.userId + 1 || 1, username, contact };

			user.push(newUser);
			write('users', user);

			res.writeHead(201, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ status: 201, success: true }));
		});
	});
}

http
	.createServer(httpServer)
	.listen(5000, () => console.log('server runnig on port: 5000'));
