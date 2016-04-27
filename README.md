ohana
=====
A  http server that return simulation json data.

[中文文档](#ch)

## Install

```bash
npm install ohana
```


## Usage

You can use a variety data template parser. Recommendation:  [madoka](https://github.com/Allenice/madoka) and [mockjs](https://github.com/nuysoft/Mock)。
```javascript
var madoka = require("madoka");
var Mock = require('mockjs');
var Server = require("ohana");

// use 'madoka.generate' as default parser
var server = new Server({
  parser: madoka.generate
});

// get article parser
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

// get one article, use mock.js to parse tempate.
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

// process data before response.
server.get('/user/filter/', {
  beforeResponse: function (data) {
    return data.data;
  },
  data: function (params, query) {
    return {
      'data': [
        '{{ repeat(5, 7) }}',
        {
          'user_name': '{{ firstName() }} {{ lastName() }}'
        }
      ]
    }
  }
});

// specify content-type
// return 'text/html'
 server.get('/user/:id/tag', {
   contentType: 'text/html',
   beforeResponse: function(data) {
     return data.tag;
   },
   data: {
     tag: 'loli'
   }
 });

server.start(3000);

```
## API

### Server(options)
Server constructor

 - `options`
   - `parser`:  default parser.  Every function like below can use as a parser.

    ```javascript
    function parser(dataTemplate) {
      // parse tempate logic
      var data = someOperate(dataTemplate);

      // return the parsed data.
      return data;
    }

    ```
   - `contentType`:  default content-type
   - `onError`:  handle error
   - `proxy`:   default proxy request config
     - `urlRoot`:  the root url of the target server
     - `method:`  request method，GET | POST | PUT | PATCH | DELETE

### server.get(path, options)
Listen a  GET request.

 - `path`:  url path
 - `options`:
   - `parser`:  template parser
   - `delay`:  delay response. Unit is ms.
   - `beforeResponse`:  A function process data before response
   - `contentType`:  response content-type
   - `statusCode`:  http status code
   - `data`:  data template.  It can be a function.  Function parameter 'params' matching routing parameters, 'query' is submitted or parameter query.

```javascript
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
```

### server.post(path, options）
POST request.
### server.delete(path, options)
DELETE request.
### server.put(path, options)
PUT request.
### server.patch(path, options)
PATCH request.

### server.proxy(path, option)
Proxy request.

 - `path`:  url path
 - `options`:
   - `urlRoot`:  url root of target server，
   - `method`:  request method，GET | POST | PUT | PATCH | DELETE



```javascript
server.proxy('/article/:id', {
  urlRoot: 'http://localhost:3000',
  method: DELETE
});

// global config
var server = new Server({
  proxy: {
    urlRoot: 'http://localhost:3000',
    method: 'get'
  }
});

// use global config
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
```

### server.register(apiList);
register module

- `apiList`:  api module list

```javascript
server.register([
  require('./article/index'),
  require('./user/index')
]);
```

### server.start(port, host)
 - `port`
 - `host`

## Route
Basic string:

    "/articles" will only match routes that == "/articles".

Named parameters:

    "/articles/:title" will only match routes like "/articles/hello", but *not* "/articles/".

Optional named parameters:

    "/articles/:title?" will match "/articles/hello" AND "/articles/"

Periods before optional parameters are also optional:

    "/:n.:f?" will match "/1" and "/1.json"

Splaaaat! :

    "/assets/*" will match "/assets/blah/blah/blah.png" and "/assets/".

    "/assets/*.*" will match "/assets/1/2/3.js" as splats: ["1/2/3", "js"]

Mix splat with named parameters:

    "/account/:id/assets/*" will match "/account/2/assets/folder.png" as params: {id: 2}, splats:["folder.png"]


Named RegExp:

    "/lang/:lang([a-z]{2})" will match "/lang/en" but not "/lang/12" or "/lang/eng"

Raw RegExp:

    /^\/(\d{2,3}-\d{2,3}-\d{4})\.(\w*)$/ (note no quotes, this is a RegExp, not a string.) will match "/123-22-1234.json". Each match group will be an entry in splats: ["123-22-1234", "json"]

visit： https://github.com/aaronblohowiak/routes.js


----------

# CH
----------


ohana
=====
一个返回模拟 json 数据的 http 服务器。

## 安装

```bash
npm install ohana
```


## 使用
可以使用多种 json 模板解析器。推荐使用 [madoka](https://github.com/Allenice/madoka) 和 [mockjs](https://github.com/nuysoft/Mock)。
```javascript
var madoka = require("madoka");
var Mock = require('mockjs');
var Server = require("ohana");

// 使用 madoka.generate 为默认的解析器，解析数据模板
var server = new Server({
  parser: madoka.generate
});

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

// 输出数据之前，处理一下数据
server.get('/user/filter/', {
  beforeResponse: function (data) {
    return data.data;
  },
  data: function (params, query) {
    return {
      'data': [
        '{{ repeat(5, 7) }}',
        {
          'user_name': '{{ firstName() }} {{ lastName() }}'
        }
      ]
    }
  }
});

// 指定输出的 content-type
// 返回 text/html 类型
 server.get('/user/:id/tag', {
   contentType: 'text/html',
   beforeResponse: function(data) {
     return data.tag;
   },
   data: {
     tag: 'loli'
   }
 });

server.start(3000);

```
## API

### Server(options)
Server构造函数

 - `options`
   - `parser`: 默认数据模板解析器。任何像以下处理的方法都可以作为解析器

    ```javascript
    function parser(dataTemplate) {
      // 解析数据模板的逻辑
      var data = someOperate(dataTemplate);
      // 返回解析后的数据
      return data;
    }

    ```
   - `contentType`:  默认输出数据的 content-type
   - `onError`:  错误处理
   - `proxy`:  代理请求参数
     - `urlRoot`:  目标服务器请求根目录，
     - `method:`  请求类型，GET | POST | PUT | PATCH | DELETE

### server.get(path, options)
匹配 GET 方式的请求。

 - `path`: 路由匹配地址
 - `options`:
   - `parser`:  数据解析器。
   - `delay`: 延迟多少毫秒后返回。
   - `beforeResponse`: 数据输出之前处理数据。
   - `contentType`:  响应数据的 content-type
   - `statusCode`: http 状态码
   - `data`: 返回的数据，可以接受方法, 方法中的参数 params 是路由匹配的参数，query 是提交或查询的参数。

```javascript
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
```

### server.post(path, options）
与 get 同理
### server.delete(path, options)
与 get 同理
### server.put(path, options)
 与 get 同理
### server.patch(path, options)
与 get 同理

### server.proxy(path, option)
代理请求

 - `path`: 路由匹配地址
 - `options`:
   - `urlRoot`:  目标服务器请求根目录，
   - `method`:  请求类型，GET | POST | PUT | PATCH | DELETE



```javascript
server.proxy('/article/:id', {
  urlRoot: 'http://localhost:3000',
  method: DELETE
});

// 可以设置全局默认配置
var server = new Server({
  proxy: {
    urlRoot: 'http://localhost:3000',
    method: 'get'
  }
});

// 之后可以省略配置
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
```

### server.register(apiList);
注册 api

- `apiList`:  api 模块列表

```javascript
server.register([
  require('./article/index'),
  require('./user/index')
]);
```

### server.start(port, host)
 - `port`:  服务器监听的网络端口
 - `host`： 主机

## 路由匹配规则：
字符串:

    "/articles" 只会匹配到 "/articles"。 /articles/ 不会被匹配到。

命名参数:

    "/articles/:title" 只会匹配到像"/articles/hello"的路由, 但是不会匹配到 "/articles/".

可选参数:

    "/articles/:title?" 匹配 "/articles/hello" 和 "/articles/"。

可选参数前面的参数也是可选的:

    "/:n.:f?" 会匹配到 "/1" 和 "/1.json"

星号（splat）:

    "/assets/*" 匹配到 "/assets/blah/blah/blah.png" 和 "/assets/".

    "/assets/*.*" 会匹配到 "/assets/1/2/3.js"， 并且有 splats: ["1/2/3", "js"]

星号和命名参数:

    "/account/:id/assets/*" 会匹配到 "/account/2/assets/folder.png"，并且有 params: {id: 2}, splats:["folder.png"]


正则表达式:

    "/lang/:lang([a-z]{2})" 会匹配到 "/lang/en", 但是不会匹配到 "/lang/12" 和 "/lang/eng"

参考： https://github.com/aaronblohowiak/routes.js
