
var fs = require('fs');
var path = require('path');
var jsdom = require('jsdom');
var request = require('request');

// var targets = fs.readFileSync(path.join(__dirname, 'targets'), 'utf-8').replace(/\r\n/g, '\n').split('\n');

var id = '1482181671';

var req = function (url, cb) {
  request(
    url,
    function (err, response, body) {
      if (err) {
        console.log('request error:', err);
        return;
      }

      if (response.statusCode != 200) {
        console.log('status error:', response.statusCode);
        return;
      }

      cb(body);
    }
  );
}

var getInfo = function (id) {
  req(
    'http://p.3.cn/prices/get?type=1&area=1_72_2799&pdtk=&pduid=1444657825&pdbp=0&skuid=J_' + id,
    function (result) {
      console.log('price:', JSON.parse(result)[0].p);
    }
  );

  req(
    'http://chat1.jd.com/api/checkChat?&pid=' + id,
    function (result) {
      console.log('seller:', JSON.parse(result.slice(5, -2)).seller);
    }
  );

  req(
    'http://club.jd.com/clubservice.aspx?method=GetCommentsCount&referenceIds=' + id,
    function (result) {
      console.log('comments:', JSON.parse(result).CommentsCount[0].CommentCount);
    }
  );

  jsdom.env({
    url: 'http://item.jd.com/' + id + '.html',
    scripts: ["http://code.jquery.com/jquery.js"],
    done: function (err, window) {
      var $ = window.$;
      console.log('name:', $('#name>h1').text());
      console.log('brand:', $('#parameter-brand>li>a').first().text());
      window.close();
    }
  });

};

getInfo(id);
