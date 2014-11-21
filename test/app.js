var Server = require("../index.js");
var server = new Server();

// test get method
server.get("/article/:id", {
	delay: 1000,
	data: function(params, query) {
		return {
			"id": params.id,
			"page": query.page
		}
	}
});

server.get("/", {
	data: {
		"title": "index"
	}
});

// test post method
server.post("/article", {
	data: function(params, query) {
		return {
			"message": "create article: " + JSON.stringify(query)
		}
	}
});

// test delete method
server.delete('/article/:id', {
	delay: 500,
	data: function (params) {
		return {
			"message": "delete article, id:" + params.id
		}
	}
});

server.put('/article/:id', {
	data: function (params) {
		return {
			"message": "update article, id:" + params.id
		}
	}
});


server.listen(3000);
