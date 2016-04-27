/*
 * 文章列子
 * 	-- 路由规则：https://github.com/aaronblohowiak/routes.js
 * 	-- 数据模板文档：http://mockjs.com/
 * */

var Mock = require('mockjs');

module.exports = function (server) {

  // 获取文章列表
  server.get('/article/', {
    delay: 200,
    data: function (params, query) {
      console.log(params);
      console.log(query);

      return [
        '{{ repeat(10) }}',
        {
          'id': '{{ index() }}',
          'title': '{{ lorem(1, "sentences") }}',
          'author': '{{ firstName() }} {{ lastName() }}',
          'brief': '{{ lorem(1, "paragraphs") }}',
          'post_time': '{{ date(new Date(2014, 0, 1), "YYYY-MM-dd HH:mm:ss") }}',
          'read_count': '{{ integer(100, 10000) }}'
        }

      ];

    }
  });

  // 获取文章列表
  server.get('/article/404', {
    statusCode: 404,
    delay: 200,
    data: function (params, query) {
      return {
        status: 404,
        date: '{{ date(new Date(2014, 0, 1), "YYYY-MM-dd HH:mm:ss") }}'
      }
    }
  });

  // 获取一篇文章, 使用 mock.js 解析
  server.get('/article/:id', {
    parser: Mock.mock,
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
          "id": "{{ integer(1, 1000) }}",
          "title": query.title,
          "author": query.author,
          "content": query.content,
          "post_time": function(faker) {
            return faker.date(new Date(), 'YYYY-MM-dd HH:mm:ss');
          }
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
          "post_time": function(faker) {
            return faker.date(new Date(), 'YYYY-MM-dd HH:mm:ss');
          }
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
          "post_time": function(faker) {
            return faker.date(new Date(), 'YYYY-MM-dd HH:mm:ss');
          }
        }
      }
    }
  });


}
