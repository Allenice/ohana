var Mock = require('mockjs');
var Server = require("../../index.js");

var server = new Server({
  parser: Mock.mock
});

server.register([
  require('./article/index'),
  require('./user/index'),
  require('./action/')
]);

server.start(4000);
