/*
* 一个返回模拟 json 数据的 http 服务器
* @author Allenice
* @date 2014-11-20
* */

var Router = require("routes"),
		http = require('http'),
		url = require('url'),
		qs  = require('querystring'),
		Mock = require("mockjs");

// 使用第三方的路由 https://github.com/aaronblohowiak/routes.js
var router = Router();

/**
 * 当 http 请求到达时，处理返回数据
 * @param {Object} req	- node http.request
 * @param {Object} res	- node http.response
 * @param {Object} match	- routers match, {query, params, splats, route, fn, next}
 * @param {Object} options - router handle options {delay, data}
 */
var handle = function (req, res, match, options) {
	var data;

	// 使用 mock js 生成 json 数据， 可以接受 object 和 function
	if(typeof options.data === 'object') {
		data = Mock.mock(options.data);
	} else if(typeof options.data === 'function') {
		// 如果是 function， 则传入路由参数 params 和 url 参数 query
		data = Mock.mock(options.data(match.params, match.query));
	}

	// 延迟输出
	setTimeout(function() {
		res.end(JSON.stringify(data));
	}, options.delay || 0);
}

// main
var Server = function () {}

Server.prototype = {
	// 添加 'get', 'post', 'delete', 'put' 路由

	// -----
	"get": function (path, options) {
		router.addRoute("GET" + path, function(req, res, match) {
			handle(req, res, match, options);
		});
	},

	"post": function (path, options) {
		router.addRoute("POST" + path, function(req, res, match) {
			handle(req, res, match, options);
		});
	},

	"delete": function (path, options) {
		router.addRoute("DELETE" + path, function(req, res, match) {
			handle(req, res, match, options);
		});
	},

	"put": function (path, options) {
		router.addRoute("PUT" + path, function(req, res, match) {
			handle(req, res, match, options);
		});
	},

	/**
	 * create http server
	 * @param port
	 * @param host
	 */
	listen: function (port, host) {
		port = port || 8080;
		host = host || '127.0.0.1';

		http.createServer(function (req, res) {
			var path = url.parse(req.url).pathname;

			// 查找匹配的路由
			var match = router.match(req.method + path);

			if(match) {
				// 允许跨域访问
				res.writeHead(200, {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'POST, GET, DELETE, PUT'
				});

				if(req.method === 'GET') {
					match.query = url.parse(req.url, true).query || {};
					match.fn(req, res, match);
				} else {
					var body = '';

					req.on('data', function (data) {
						body += data;
					});

					req.on('end', function () {
						match.query = qs.parse(body);
						match.fn(req, res, match);
					});
				}
			} else {
				res.writeHead(404, {'Content-Type': 'application/json'});
				res.end(JSON.stringify({status: 404}));
			}

		}).listen(port, host);

		console.log('Server running at http://'+ host +':'+ port +'/');
	}
}

module.exports = Server;