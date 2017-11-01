plantcoApp.service('blogService', function ($http) {

  var URL = '/api/blog/';

  function responseData(response) {
    return response.data;
  }

  this.getCount = function () {
    var url = URL + "contador";
    return $http.post(url).then(responseData);
  };
  
  this.sendNew = function (msg) {
    var url = URL;
    return $http.post(url, { data: msg }).then(responseData);
  };

  this.updateNew = function (msg) {
    var url = URL;
    return $http.put(url, { data: msg }).then(responseData);
  };

  this.deleteNew = function (msgId) {
    var url = URL + msgId;
    return $http.delete(url).then(responseData);
  };

  this.getNews = function () {
    var url = URL + 'all';
    return $http.get(url).then(responseData);
  };

  this.getById = function (postId) {
    var url = URL + postId;
    return $http.get(url).then(responseData);
  };
});
