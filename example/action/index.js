/*
 * 上传等列子 列子
 * 	-- 路由规则：https://github.com/aaronblohowiak/routes.js
 * 	-- 数据模板文档：http://mockjs.com/
 * */

module.exports = function (server) {
  // 上传文件
  server.post('/upload/', {
    delay: 200,
    data: function (params, query) {
      console.log(params);
      console.log(query);

      return {
        "status": "ok"
      }
    }
  });

}