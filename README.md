ohana
=====
一个返回模拟 json 数据的 http 服务器
特点：


 - 使用 mockjs 生成 json 数据
 - 支持路由规则
 - 可跨域访问

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

## 路由匹配规则：
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

参考： https://github.com/aaronblohowiak/routes.js

## 数据生成
ohana 默认集成了 mockjs，你可以使用 mockjs 生成 json 数据。当然你也可以使用其他的生成工具。
参考文档： http://mockjs.com/editor.html#help
