function TwitApi($http, $q, $rootScope){
  this._config = null;
  this._$http = $http;
  this._$q = $q;
  this._$rs = $rootScope;

  this._config = {baseUrl: window.baseUrl};
}

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

TwitApi.prototype.makeRequest = function(request){
  var df = this._$q.defer();
  this._$http(request).success(df.resolve).error(df.reject);
  return df.promise;
};