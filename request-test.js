/**
 * Created by allenice on 15/4/14.
 */

var request = require('request');

request({
  url: 'http://ourbp.sinaapp.com/api.php/Common/getHosInfo/',
  method: 'GET',
  qs: {'hid': 27}
}, function (err, response, body) {
  console.log(body);
});
