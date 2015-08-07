var testCase = require('nodeunit').testCase,
    request = require('request');

// please run example before run test

// example app.js domain
var domain = 'http://localhost:4000/';

module.exports = testCase({

  // test before response
  'beforeResponse': testCase({
    'filterUser': function(test) {
      request({
        method: 'get',
        url: domain + 'user/filter/'
      }, function(err, response, body) {
        test.ok(!err, 'get user list error');
        test.equal(Object.prototype.toString.call(JSON.parse(body)), '[object Array]', 'should return array');
        test.done();
      });
    }
  }),

  // test response content-type
  'contentType': testCase({
    'getUserTag': function(test) {
      request({
        method: 'get',
        url: domain + 'user/1/tag'
      }, function(err, response, body) {
        test.ok(!err, 'get user tag error');
        test.equal(response.headers['content-type'], 'text/html', 'Api show return text/html');
        test.done();
      });
    }
  }),

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
  }),

  // test post
  'post': testCase({
    'addArticle': function(test) {
      var article = {
        author: 'Allenice',
        title: 'test title',
        content: 'test content post'
      };

      request({
        method: 'post',
        url: domain + 'article/',
        form: article
      }, function(err, response, body) {
        var data = JSON.parse(body).data;
        test.equal(data.author, article.author, 'author should equal');
        test.equal(data.title, article.title, 'title should equal');
        test.equal(data.content, article.content, 'content should equal');
        test.done();
      });
    }
  }),

  // test delete
  'delete': testCase({
    'deleteArticle': function(test) {
      request({
        method: 'delete',
        url: domain + 'article/10'
      }, function(err, response, body) {
        test.ok(!err, 'delete article error');
        test.equal(JSON.parse(body).message, 'delete article: 10', 'article id not equal');
        test.done();
      });
    }
  }),

  // tet put
  'put': testCase({
    'updateArticle': function(test) {

      var article = {
        author: 'Allenice',
        title: 'test title',
        content: 'test content'
      };

      request({
        method: 'put',
        url: domain + 'article/1',
        form: article
      }, function(err, response, body) {
        var data = JSON.parse(body).data;
        test.equal(data.author, article.author, 'author should equal');
        test.equal(data.title, article.title, 'title should equal');
        test.equal(data.content, article.content, 'content should equal');
        test.done();
      });
    }
  }),

  // test patch
  'patch': testCase({
    'updateArticle': function(test) {

      var article = {
        author: 'Allenice',
        title: 'test title patch',
        content: 'test content patch'
      };

      request({
        method: 'patch',
        url: domain + 'article/1',
        form: article
      }, function(err, response, body) {
        var data = JSON.parse(body).data;
        test.equal(data.author, article.author, 'author should equal');
        test.equal(data.title, article.title, 'title should equal');
        test.equal(data.content, article.content, 'content should equal');
        test.done();
      });
    }
  }),

  // test error handler
  'onError': testCase({
    '404': function (test) {
      request({
        method: 'get',
        url: domain + '404/'
      }, function (err, response, body) {
        var data = JSON.parse(body);
        test.equal(data.status, 404, '404 error should occur');
        test.done();
      });
    }
  })

});
