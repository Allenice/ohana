var testCase = require('nodeunit').testCase,
    request = require('request');

// please run example before run test

// example app.js domain
var domain = 'http://localhost:3000/';

module.exports = testCase({
  
  // test get
  'getArticleList': function(test) {
    request({
      method: 'get',
      url: domain + 'article/'
    }, function(err, response, body) {
      test.ok(!err, 'get article list error');
      test.equal(response.headers['content-type'], 'application/json; charset=utf-8', 'Api show return json data');
      test.ok(Object.prototype.toString.call(JSON.parse(body).data), '[object Array]', 'Data should be array');
      test.done();
    });
  }
});
