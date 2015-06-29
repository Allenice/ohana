var Server = require("../index.js");

var server = new Server();

server.register([
  require('./article/index'),
  require('./user/index'),
  require('./action/')
]);

server.start(3000);
