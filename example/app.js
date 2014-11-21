
var Server = require("../index.js");
var article = require('./article/index');

var server = new Server();

article(server);

server.listen(3000);
