/*
 * 一个返回模拟 json 数据的 http 服务器
 * @author Allenice
 * @date 2014-11-20
 * */

var Router = require("routes"),
  http = require('http'),
  url = require('url'),
  formidable = require('formidable'),
  extend = require('extend'),
  proxy = require('./lib/proxy');

// 使用第三方的路由 https://github.com/aaronblohowiak/routes.js
var router = Router(),
    header = {
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
var handler = function (req, res, match, options) {
  var data,
      parser = options.parser || this.config.parser,
      _this = this;

  // 使用 mock js 生成 json 数据， 可以接受function
  if (typeof options.data === 'function') {
    // 如果是 function， 则传入路由参数 params 和 url 参数 query
    data = parser(options.data(match.params, match.query));
  } else {
    data = parser(options.data);
  }

  // 延迟输出
  setTimeout(function () {

    // 输出前处理数据
    if(typeof options.beforeResponse === 'function') {
      data = options.beforeResponse.call(this, data) || data;
    }

    // 设置 content-type
    var resHeader = {
      'Content-Type': _this.config.contentType
    };
    if(options.contentType) {
      resHeader['Content-Type'] = options.contentType;
    }

    res.writeHead(options.statusCode || 200, extend(resHeader, header));
    res.end(JSON.stringify(data));
  }, options.delay || 0);
};

// main
var Server = function (options) {

  var _this = this;

  this.config = {

    // 默认解析器，解析数据模板
    parser: function(dataTemplate) {
      return dataTemplate;
    },

    // 默认输出的 content-type
    contentType: 'application/json; charset=utf-8',

    // 出错处理
    onError: function(req, res, statusCode) {
      var resHeader = {
        'Content-Type': _this.config.contentType
      }
      res.writeHead(statusCode, extend(resHeader, header));

      res.end(JSON.stringify({status: statusCode}));
    },

    // http 代理的默认配置
    proxy: {
      urlRoot: '',
      method: 'GET'
    }
  };

  extend(true, this.config, options);
};

Server.prototype = {
  // 添加 'get', 'post', 'delete', 'put', 'patch' 路由

  // -----
  "get": function (path, options) {
    var _this = this;

    router.addRoute("GET" + path, function (req, res, match) {
      handler.call(_this, req, res, match, options);
    });
  },

  "post": function (path, options) {
    var _this = this;

    router.addRoute("POST" + path, function (req, res, match) {
      handler.call(_this, req, res, match, options);
    });
  },

  "delete": function (path, options) {
    var _this = this;

    router.addRoute("DELETE" + path, function (req, res, match) {
      handler.call(_this, req, res, match, options);
    });
  },

  "put": function (path, options) {
    var _this = this;

    router.addRoute("PUT" + path, function (req, res, match) {
      handler.call(_this, req, res, match, options);
    });
  },

  "patch": function (path, options) {
    var _this = this;

    router.addRoute("PATCH" + path, function (req, res, match) {
      handler.call(_this, req, res, match, options);
    });
  },

  // 使用代理
  'proxy': function (path, options) {
    var method,
        server = this;

    options = options || {};
    method = options.method || this.config.proxy.method;

    router.addRoute(method + path, function (req, res, match) {
      proxy(req, res, match, options, server);
    });
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
    var _this = this;

    port = port || 8080;

    http.createServer(function (req, res) {

      var path = url.parse(req.url).pathname,
        statusCode,
        date = new Date(),
        dateString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.toLocaleTimeString();

      // 查找匹配的路由
      var match = router.match(req.method + path);

      // 出错处理
      function responseError(statusCode) {
        console.log(req.method, statusCode, req.url, dateString);
        _this.config.onError(req, res, statusCode);
      }

      if (match) {
        statusCode = 200;
        console.log(req.method, statusCode, req.url, dateString);

        // 获取 get 参数
        match.query = url.parse(req.url, true).query || {};

        if (req.method === 'GET') {
          match.fn(req, res, match);
        } else {
          // 获取非 get 的参数
          var form = new formidable.IncomingForm();
          form.parse(req, function(err, fields, files) {
            if(err) {
              responseError(500);
            }
            extend(match.query, fields, files);
            match.fn(req, res, match);
          });

        }
      } else {
        responseError(404);
      }


    }).listen(port, host);

    console.log('Server running at http://' + (host || 'localhost') + ':' + port + '/');
  }
};

module.exports = Server;
