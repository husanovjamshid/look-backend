const fs = require('fs');
const http = require('http');
const Express = require('./lib/express');
const { read, write } = require('./utils/modul');

function httpServer(req, res) {
	let app = new Express(req, res);

	app.get('/foods', (req, res) => {
		// res.setHeader('Content-Type', 'application/json');
		// res.setHeader('Access-Control-Allow-Origin', '*');
		// res.end(JSON.stringify(read('foods')));

		const data = read('foods');

		const { foodId } = req.query;
		const filtered = data.filter((user) => user.foodId == foodId);

		if (filtered.length) {
			res.setHeader('Content-Type', 'application/json');
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.end(JSON.stringify(filtered));
		} else {
			res.setHeader('Content-Type', 'application/json');
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.end(JSON.stringify(data));
		}
	});

	app.get('/users', (req, res) => {
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.end(JSON.stringify(read('users')));
	});

	app.get('/orders', (req, res) => {
		// console.log(req.query);

		const data = read('orders');

		const { userId } = req.query;
		const filtered = data.filter((user) => user.userId == userId);

		if (filtered.length) {
			res.setHeader('Content-Type', 'application/json');
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.end(JSON.stringify(filtered));
		}
	});

	app.post('/users', (req, res) => {
		let str = '';
		req.on('data', (chunk) => (str += chunk));
		req.on('end', () => {
			const user = read('users');
			let { username, contact } = JSON.parse(str);
			const newUser = { userId: user.at(-1)?.userId + 1 || 1, username, contact };

			user.push(newUser);
			write('users', user);

			res.writeHead(201, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ status: 201, success: true }));
		});
	});

	app.post('/orders', (req, res) => {
		let str = '';
		req.on('data', (chunk) => (str += chunk));
		req.on('end', () => {
			const orders = read('orders');
			let { userId, foodId, count } = JSON.parse(str);
			res.setHeader('Access-Control-Allow-Origin', '*');

			const newOrder = { userId, foodId, count };
			// console.log(orders);
			let refleks = orders.filter(
				(item) => item.foodId == foodId && item.userId == userId,
			);
			console.log(refleks);
			if (refleks.length > 0) {
				// refleks.length = 0;
				const orders = read('orders');

				orders
					.filter(
						(item) =>
							item.userId == newOrder.userId && item.foodId == newOrder.foodId,
					)
					.map((item) => (item.count += newOrder.count)),
					write('orders', orders);
			} else {
				// refleks.length = 0;
				orders.push(newOrder);
				write('orders', orders);
			}
			// refleks.length = 0;

			res.writeHead(201, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ status: 201, success: true }));
		});
	});
}

http
	.createServer(httpServer)
	.listen(5000, () => console.log('server runnig on port: 5000'));
