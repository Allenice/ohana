var Server = require("../index.js");

var server = new Server();

server.register([
  require('./proxy/index')
]);

server.setProxyDefault({
  urlRoot: 'http://ourbp.sinaapp.com/api.php',
  method: 'GET'
});

server.start(3004);
