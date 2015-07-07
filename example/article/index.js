/*
 * 文章列子
 * 	-- 路由规则：https://github.com/aaronblohowiak/routes.js
 * 	-- 数据模板文档：http://mockjs.com/
 * */

module.exports = function (server) {

  // 获取文章列表
  server.get('/article/', {
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
            "title": "@TITLE(5, 7)",
            "author": "@NAME",
            "brief": "中文测试",
            "post_time": "@DATETIME('yyyy-MM-dd HH:mm:ss')",
            "read_count|0-1000": 100
          }
        ]
      }
    }
  });

  // 获取一篇文章
  server.get('/article/:id', {
    data: function (params, query) {
      return {
        "status": "ok",
        "data": {
          "id": params.id,
          "title": "@TITLE(5, 7)",
          "author": "@NAME",
          "post_time": "@DATETIME('yyyy-MM-dd HH:mm:ss')",
          "content": "@PARAGRAPH(2)",
          "poster": "@IMAGE('700x350', '#ccc', '#000', 'hello world')",
          "read_count|0-1000": 100
        }
      }
    }
  });

  // 添加一篇文章
  server.post('/article/', {
    data: function (params, query) {
      return {
        "status": "ok",
        "data": {
          "id|1-10000": 1,
          "title": query.title,
          "author": query.author,
          "content": query.content,
          "post_time": "@NOW"
        }
      }
    }
  });

  // 删除一篇文章
  server.delete('/article/:id', {
    data: function (params, query) {
      return {
        "status": "ok",
        "message": "delete article: " + params.id
      }
    }
  });

  // 更新一篇文章
  server.put('/article/:id', {
    data: function (params, query) {
      return {
        "status": "ok",
        "data": {
          "id": params.id,
          "title": query.title,
          "author": query.author,
          "content": query.content,
          "post_time": "@NOW"
        }
      }
    }
  });

  // 更新一篇文章
  server.patch('/article/:id', {
    data: function (params, query) {
      return {
        "status": "ok",
        "data": {
          "id": params.id,
          "title": query.title,
          "author": query.author,
          "content": query.content,
          "post_time": "@NOW"
        }
      }
    }
  });


}