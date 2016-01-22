var _ = require("lodash");
var Q = require("q");


var Twitter = require("twitter-node-client").Twitter;

//Get this data from your twitter apps dashboard
var config = {
  "consumerKey": "ZeGhnvPzjm67yeYOLei9HUV3T",
  "consumerSecret": "VDmNng9rNcv7pBEry4fd7lBo6UgQcAB0cCqtpIlJAcBc5eQriK",
  "accessToken": "3393127126-rlqwVACgOIs7GvezTxgwFlTp3Baq8DB9njpkqPj",
  "accessTokenSecret": "BtmgRuP4VN4WaJ5JsNqPMygRSgdM9XM3FJ55lhupHunD2"
}

var twitter = new Twitter(config);

//Callback functions
var error = function (err, response, body) {
  console.log('ERROR [%s]', err);
  console.log(response);
};

var success = function (data) {
  console.log('Data [%s]', data);
};

exports.tweetsTest = function(){
  var df = Q.defer();

  //
  // Get 10 tweets containing the hashtag haiku
  //

  twitter.getSearch({'q':'#haiku','count': 10}, error, function(results){
    df.resolve(results);
  });

  return df.promise;
};

exports.getUsers = function(){
  var df = Q.defer();

  //
  // relevance-based search interface to public user accounts on Twitter
  //

  twitter.getCustomApiCall('/users/search.json',{q:'pbooth',count: 10, include_entities: 'false'}, error, function(results){
    console.log(results);
    df.resolve(results);
  });

  return df.promise;
};

exports.getUserTimeline = function(){
  var df = Q.defer();

  //
  //Returns a collection of the most recent Tweets posted by the user indicated by the
  //

  twitter.getUserTimeline({ screen_name: 'theemilylewis', count: '10'}, error, function(results){
    console.log(results);
    df.resolve(results);
  });

  return df.promise;
};

exports.getSingleUser = function(){
  var df = Q.defer();

  //
  //Returns a collection of the most recent Tweets posted by the user indicated by the
  //

  twitter.getUser({ screen_name: 'theemilylewis'}, error, function(results){
    console.log(results);
    df.resolve(results);
  });

  return df.promise;
};