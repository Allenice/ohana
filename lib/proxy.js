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
  var proxyDefault = server.proxyDefault,
      path = url.parse(req.url).pathname,
      urlRoot = options.urlRoot || proxyDefault.urlRoot,
      method = req.method;

  request({
    method: method,
    url: options.url || urlRoot + path,
    qs: match.query
  }, function (err, response, body) {
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

    header['Content-Type'] = response.headers.contentType;
    res.writeHead(200, header);
    res.end(body);
  });
}