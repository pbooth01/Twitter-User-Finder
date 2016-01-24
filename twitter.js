var _ = require("lodash");
var Q = require("q");


var Twitter = require("twitter-node-client").Twitter;

//Get this data from your twitter apps dashboard
var config = {
  "consumerKey": "HTBilPmnSEd8KM4SjJ43i6dL2",
  "consumerSecret": "rEXriko46bpIEp1CFSu8q6tRFEEmDYuQCq59CHQHY9DOcqjltU",
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

exports.getUsers = function(searchString){
  var df = Q.defer();

  //
  // relevance-based search interface to public user accounts on Twitter
  //

  twitter.getCustomApiCall('/users/search.json',{q:searchString,count: 5, include_entities: 'false'}, error, function(results){
    //console.log(results);
    df.resolve(results);
  });

  return df.promise;
};

exports.getUserTimeline = function(searchString, retweetNumber){
  var df = Q.defer();

  //
  //Returns a collection of the most recent Tweets posted by the user indicated by the
  //

  if(searchString.indexOf("@") < 0){
    searchString = "@" + searchString;
  }

  twitter.getCustomApiCall(('/statuses/user_timeline.json'),{screen_name: searchString, count: '10'}, error, function(results){
    console.log(results);
    df.resolve(results);
  });

  return df.promise;
};

exports.getSingleUser = function(searchString){
  var df = Q.defer();

  //
  //Returns a collection of the most recent Tweets posted by the user indicated by the
  //
  if(searchString.indexOf("@") < 0){
    searchString = "@" + searchString;
  }

  twitter.getUser({ screen_name: searchString}, error, function(results){
    console.log(results);
    df.resolve(results);
  });

  return df.promise;
};