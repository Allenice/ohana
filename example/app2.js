var Server = require("../index.js");

var server = new Server({
  proxy: {
    urlRoot: 'http://localhost:3000',
    method: 'GET'
  }
});

server.register([
  require('./proxy/index')
]);

server.start(3004);
