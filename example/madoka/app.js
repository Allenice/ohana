/*
* 使用 madoka 生成数据
* */

var madoka = require('madoka');
var Server = require("../../index.js");

var server = new Server({
  parser: madoka.generate
});

server.register([
  require('./article/index')
]);

server.start(4002);
