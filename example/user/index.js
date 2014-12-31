/*
 * user 列子
 * 	-- 路由规则：https://github.com/aaronblohowiak/routes.js
 * 	-- 数据模板文档：http://mockjs.com/
 * */

module.exports = function (server) {
  // 获取用户列表
  server.get('/user/', {
    delay: 200,
    data: function (params, query) {
      console.log(params);
      console.log(query);

      return {
        "status": "ok",
        "total_count": 100,
        "data|10": [
          {
            "id|1-10000": 1,
            "user_name": "@NAME",
            "gender|1": ['male', 'female']
          }
        ]
      }
    }
  });

}