global.DEBUG = true;

var restify = require('restify');
var _ = require("lodash");
var Q = require("q");
var twitter = require("./twitter.js")

var RestServer = {

  gettweetscheck: function(req, res, next){
    twitter.tweetsTest()
      .then(function(data){
        res.send(data);
        next();
      })
      .catch(function(msg){
        res.send(msg);
        next();
      });

  }


};

var server = restify.createServer();

server.use( restify.authorizationParser() );
server.use( restify.CORS() );
server.use( restify.fullResponse() );
server.use( restify.bodyParser() );

restify.CORS.ALLOW_HEADERS.push('authorization');

server.get('/tweetsTest', RestServer.gettweetscheck);

server.listen(9090, function() {
  console.log('%s listening at %s', server.name, server.url);
});
