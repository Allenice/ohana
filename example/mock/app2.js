var Mock = require('mockjs');
var Server = require("../../index.js");

var server = new Server({
  parser: Mock.mock,
  proxy: {
    urlRoot: 'http://localhost:4000',
    method: 'GET'
  }
});

server.register([
  require('./proxy/index')
]);

server.start(4001);
