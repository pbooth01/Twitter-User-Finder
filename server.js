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

  },

  getPotentialUsers: function(req, res, next){

    //params will be passed in from req
    twitter.getUsers()
      .then(function(data){
        res.send(data);
        next();
      })
      .catch(function(msg){
        res.send(msg);
        next();
      });
  },

  getUserTimeline: function(req, res, next){

    //params will be passed in from req
    twitter.getUserTimeline()
      .then(function(data){
        res.send(data);
        next();
      })
      .catch(function(msg){
        res.send(msg);
        next();
      });
  },

  getSingleUser: function(req, res, next){

    //params will be passed in from req
    twitter.getSingleUser()
      .then(function(data){
        res.send(data);
        next();
      })
      .catch(function(msg){
        res.send(msg);
        next();
      });
  },


};

var server = restify.createServer();

server.use( restify.authorizationParser() );
server.use( restify.CORS() );
server.use( restify.fullResponse() );
server.use( restify.bodyParser() );

restify.CORS.ALLOW_HEADERS.push('authorization');

server.get('/tweetsTest', RestServer.gettweetscheck);
server.get('/getPotentialUsers', RestServer.getPotentialUsers);
server.get('/getSingleUser', RestServer.getSingleUser);
server.get('/getUserTimeline', RestServer.getUserTimeline);

server.listen(9090, function() {
  console.log('%s listening at %s', server.name, server.url);
});
