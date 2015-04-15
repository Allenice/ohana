/*
 * 代理列子
 * 	-- 路由规则：https://github.com/aaronblohowiak/routes.js
 * 	-- 数据模板文档：http://mockjs.com/
 * */

module.exports = function (server) {

  // 使用代理
  server.proxy('/PList/hotHospital/');
  server.proxy('/Common/getHosInfo/');

  server.proxy('/article/', {
    urlRoot: 'http://localhost:3000'
  });

  server.proxy('/article/:id', {
    urlRoot: 'http://localhost:3000'
  });

  server.proxy('/article/', {
    urlRoot: 'http://localhost:3000',
    method: 'POST'
  });

  server.proxy('/article/:id', {
    urlRoot: 'http://localhost:3000',
    method: 'DELETE'
  });

  server.proxy('/article/:id', {
    urlRoot: 'http://localhost:3000',
    method: 'PUT'
  });

  server.proxy('/article/:id', {
    urlRoot: 'http://localhost:3000',
    method: 'PATCH'
  });

}