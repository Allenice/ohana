var Server = require("../index.js");

var server = new Server();

server.register([
  require('./proxy/index')
]);

server.setProxyDefault({
  urlRoot: 'http://localhost:3000',
  method: 'GET'
});

server.start(3004);
