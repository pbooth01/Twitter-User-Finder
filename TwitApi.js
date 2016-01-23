function TwitApi($http, $q, $rootScope){
  this._config = null;
  this._$http = $http;
  this._$q = $q;
  this._$rs = $rootScope;

  this._config = {baseUrl: window.baseUrl};
}
//Used to create a http request object. Takes in two strings and returns an object
TwitApi.prototype.getRequest = function(url, method){
  if(method == undefined){
    method = "GET";
  }

  if( url.indexOf("http") == -1 ){
    url = this._config["baseUrl"] + url;
  }

  return {
    url: url,
    method: method
  };
};

//Used to make request to the server. Takes in a string and returns a promise
TwitApi.prototype.makeRequest = function(request){
  var df = this._$q.defer();
  this._$http(request).success(df.resolve).error(df.reject);
  return df.promise;
};

//Used to test the connection to the server. Takes in no params and returns a collection of tweets
TwitApi.prototype.tweetsTest = function(){
  return this.makeRequest( this.getRequest("/tweetsTest") );
};

//Used to get user objects that match the search string. Takes in search string and returns a collection of user objects
TwitApi.prototype.getPotentialUsers = function(searchString){
  return this.makeRequest( this.getRequest("/getPotentialUsers/" + searchString) );
};

//Used to get user objects that match the search string. Takes in search string and returns a single user object
TwitApi.prototype.getSingleUser = function(searchString){
  return this.makeRequest( this.getRequest("/getSingleUser/" + searchString) );
};

//Used to get tweet objects for a particular user. Takes in search string and a retweetnumber and returns a collection of tweet objects
TwitApi.prototype.getUserTimeline = function(searchString, retweetNumber){
  return this.makeRequest( this.getRequest("/getUserTimeline/" + searchString + "/" + retweetNumber) );
};