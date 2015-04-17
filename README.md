ohana
=====
一个返回模拟 json 数据的 http 服务器
特点：


 - 使用 mockjs 生成 json 数据
 - RESTFul
 - 可跨域访问
 - http 代理转发

## 安装

```bash
npm install ohana
```

## 使用

```javascript
var Server = require("ohana");
var server = new Server();

server.get('/article/', {
		delay: 200,
		data: function(params, query) {
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
						"post_time": "@DATETIME('yyyy-MM-dd HH:mm:ss')",
						"read_count|0-1000": 100
					}
				]
			}
		}
	});

server.listen(3000);

```
## API

### server.get(path, options)
匹配 GET 方式的请求。

 - path: 路由匹配地址
 - options: 
	 - delay: 延迟多少毫秒后返回，
	 - data: 返回的数据，可以接受对象和方法, 方法中的参数 params 是路由匹配的参数，query 是提交或查询的参数。
	 
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

 - path: 路由匹配地址
 - options: 
	 - urlRoot:  目标服务器请求根目录，
	 - method:  请求类型，GET | POST | PUT | PATCH | DELETE
	 

	 
```javascript
server.proxy('/article/:id', {
	urlRoot: 'http://localhost:3000',
	method: DELETE
});

// 可以设置全局默认配置
server.setProxyDefault({
  urlRoot: 'http://localhost:3000',
  method: 'GET'
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

- apiList:  api 模块列表

```javascript
server.register([
	require('./article/index'),
	require('./user/index')
]);
```

### server.start(port, host)
 - port:  服务器监听的网络端口
 - host： 主机

## 路由匹配规则：:
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

## 数据生成
ohana 默认集成了 mockjs，你可以使用 mockjs 生成 json 数据。当然你也可以使用其他的生成工具。
参考文档： http://mockjs.com/editor.html#help
