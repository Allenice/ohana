var testCase = require('nodeunit').testCase,
    request = require('request');

// please run example before run test

// example app.js domain
var domain = 'http://localhost:3000/';

module.exports = testCase({
  
  // test get
  'get': testCase({

    // get list
    'getArticleList': function(test) {
      request({
        method: 'get',
        url: domain + 'article/'
      }, function(err, response, body) {
        test.ok(!err, 'get article list error');
        test.equal(response.headers['content-type'], 'application/json; charset=utf-8', 'Api show return json data');
        test.equal(JSON.parse(body).data.length, 10, 'should return 10 items');
        test.done();
      });
    },

    // get one
    'getOneArticle': function(test) {
      request({
        method: 'get',
        url: domain + 'article/1'
      }, function(err, response, body) {
        test.ok(!err, 'get article error');
        test.equal(response.headers['content-type'], 'application/json; charset=utf-8', 'Api show return json data');
        test.equal(JSON.parse(body).data.id, 1, 'should return data, and id equal 1');
        test.done();
      });
    }
  })

});
