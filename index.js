/*
 * 一个返回模拟 json 数据的 http 服务器
 * @author Allenice
 * @date 2014-11-20
 * */

var Router = require("routes"),
  http = require('http'),
  url = require('url'),
  qs = require('querystring'),
  Mock = require("mockjs"),
  proxy = require('./lib/proxy');

// 使用第三方的路由 https://github.com/aaronblohowiak/routes.js
var router = Router(),
    header = {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, DELETE, PUT, PATCH'
    };

/**
 * 当 http 请求到达时，处理返回数据
 * @param {Object} req  - node http.request
 * @param {Object} res  - node http.response
 * @param {Object} match  - routers match, {query, params, splats, route, fn, next}
 * @param {Object} options - router handle options {delay, data}
 */
var handle = function (req, res, match, options) {
  var data;

  // 使用 mock js 生成 json 数据， 可以接受 object 和 function
  if (typeof options.data === 'object') {
    data = Mock.mock(options.data);
  } else if (typeof options.data === 'function') {
    // 如果是 function， 则传入路由参数 params 和 url 参数 query
    data = Mock.mock(options.data(match.params, match.query));
  }

  // 延迟输出
  setTimeout(function () {
    res.writeHead(200, header);
    res.end(JSON.stringify(data));
  }, options.delay || 0);
}

// main
var Server = function () {

  // http 代理的默认配置
  this.proxyDefault = {
    urlRoot: '',
    method: 'GET'
  };
}

Server.prototype = {
  // 添加 'get', 'post', 'delete', 'put', 'patch' 路由

  // -----
  "get": function (path, options) {
    router.addRoute("GET" + path, function (req, res, match) {
      handle(req, res, match, options);
    });
  },

  "post": function (path, options) {
    router.addRoute("POST" + path, function (req, res, match) {
      handle(req, res, match, options);
    });
  },

  "delete": function (path, options) {
    router.addRoute("DELETE" + path, function (req, res, match) {
      handle(req, res, match, options);
    });
  },

  "put": function (path, options) {
    router.addRoute("PUT" + path, function (req, res, match) {
      handle(req, res, match, options);
    });
  },

  "patch": function (path, options) {
    router.addRoute("PATCH" + path, function (req, res, match) {
      handle(req, res, match, options);
    });
  },

  // 使用代理
  'proxy': function (path, options) {
    var method,
        server = this;

    options = options || {};
    method = options.method || this.proxyDefault.method

    router.addRoute(method + path, function (req, res, match) {
      proxy(req, res, match, options, server);
    });
  },

  setProxyDefault: function (proxyDefault) {
    for(var key in proxyDefault) {
      this.proxyDefault[key] = proxyDefault[key];
    }
  },

  /**
   * 注册 api
   * @param {Array[Function]} apiList - api 模块列表
   */
  register: function (apiList) {
    var self = this;

    apiList.forEach(function (api) {
      if (typeof api === 'function') {
        api(self);
      }
    });
  },

  /**
   * create http server
   * @param port
   * @param [host]
   */
  start: function (port, host) {
    port = port || 8080;

    http.createServer(function (req, res) {

      var path = url.parse(req.url).pathname,
        statusCode,
        date = new Date(),
        dateString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.toLocaleTimeString();

      // 查找匹配的路由
      var match = router.match(req.method + path);

      if (match) {
        statusCode = 200;
        console.log(req.method, statusCode, req.url, dateString);

        if (req.method === 'GET') {
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
        statusCode = 404;
        console.log(req.method, statusCode, req.url, dateString);
        res.writeHead(statusCode, header);
        res.end(JSON.stringify({status: statusCode}));
      }


    }).listen(port, host);

    console.log('Server running at http://' + (host || 'localhost') + ':' + port + '/');
  }
};

module.exports = Server;