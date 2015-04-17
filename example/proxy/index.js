/*
 * 代理列子
 * 	-- 路由规则：https://github.com/aaronblohowiak/routes.js
 * 	-- 数据模板文档：http://mockjs.com/
 * */

module.exports = function (server) {

  // 使用代理， 可以单独设置根目录
  server.proxy('/PList/hotHospital/', {
    urlRoot: 'http://ourbp.sinaapp.com/api.php'
  });

  server.proxy('/Common/getHosInfo/', {
    urlRoot: 'http://ourbp.sinaapp.com/api.php'
  });

  // 使用默认设置
  server.proxy('/article/');

  server.proxy('/article/:id');

  server.proxy('/article/', {
    method: 'POST'
  });

  server.proxy('/article/:id', {
    method: 'DELETE'
  });

  server.proxy('/article/:id', {
    method: 'PUT'
  });

  server.proxy('/article/:id', {
    method: 'PATCH'
  });

}