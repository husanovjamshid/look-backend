const url = require('url');
const queryString = require('querystring');

class Express {
	constructor(req, res) {
		this.req = req;
		this.res = res;
	}

	get(route, callback) {
		let { query, pathname } = url.parse(this.req.url);
		this.req.query = queryString.parse(query);
		if (pathname == route && this.req.method == 'GET') {
			callback(this.req, this.res);
		}
	}

	post(route, callback) {
		if (this.req.url == route && this.req.method == 'POST') {
			callback(this.req, this.res);
		}
	}
}

module.exports = Express;
