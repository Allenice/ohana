/*
* http 代理处理
* author: Allenice
* date: 2015-04-13
* */

var url = require('url'),
    request = require('request');


/**
 *
 * @param req
 * @param res
 * @param match
 * @param options
 * @param server Server 对象
 */
module.exports = function (req, res, match, options, server) {
  var proxyDefault = server.config.proxy,
      path = url.parse(req.url).pathname,
      urlRoot = options.urlRoot || proxyDefault.urlRoot,
      method = req.method;

  var params = {
    method: method,
    url: options.url || urlRoot + path
  };

  if(method.toLowerCase() === 'get') {
    params.qs = match.query;
  } else {
    params.form = match.query;
  }

  request(params, function (err, response, body) {
    var header = {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, DELETE, PUT, PATCH'
    };

    if(err) {
      res.writeHead(500, header);
      res.end(JSON.stringify({status: 500}));
      return;
    }

    header['Content-Type'] = response.headers['content-type'] || header['Content-Type'];
    res.writeHead(200, header);
    res.end(body);
  });
};
