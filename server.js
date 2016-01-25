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

    var searchString = req.params.searchString;

    console.log(searchString);

    /*15 characters is the cap on a twitter users screen_name*/
    if(searchString.length <= 15){
      twitter.getUsers(searchString)
        .then(function(data){
          res.send(data);
          next();
        })
        .catch(function(msg){
          res.send([]);
          next();
        });
    }else{
      res.send([]);
      next();
    }

  },

  getUserTimeline: function(req, res, next){

    var searchString = req.params.searchString;

    twitter.getUserTimeline(searchString)
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

    var searchString = req.params.searchString;

    twitter.getSingleUser(searchString)
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
server.get('/getPotentialUsers/:searchString', RestServer.getPotentialUsers);
server.get('/getSingleUser/:searchString', RestServer.getSingleUser);
server.get('/getUserTimeline/:searchString', RestServer.getUserTimeline);

server.listen(9090, function() {
  console.log('%s listening at %s', server.name, server.url);
});
