plantcoApp.service('forumHiloService', function ($http) {

  var URL = '/api/forum-hilo/';

  function responseData(response) {
    return response.data;
  }

  this.sendHilo = function (msg) {
    var url = URL;
    return $http.post(url, { data: msg }).then(responseData);
  };

  this.updateHilo = function (msg) {
    var url = URL;
    return $http.put(url, { data: msg }).then(responseData);
  };

  this.deleteHilo = function (id) {
    var url = URL + id;
    return $http.delete(url).then(responseData);
  };

  this.getHilos = function () {
    var url = URL + 'all';
    return $http.get(url).then(responseData);
  };

  this.getById = function (postId) {
    var url = URL + postId;
    return $http.get(url).then(responseData);
  };
  this.getByCategoryId = function (categoryId) {
    var url = URL + 'category/' + categoryId;
    return $http.get(url).then(responseData);
  };


});
