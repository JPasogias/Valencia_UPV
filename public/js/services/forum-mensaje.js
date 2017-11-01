plantcoApp.service('forumMensajeService', function ($http) {

  var URL = '/api/forum-mensaje/';

  function responseData(response) {
    return response.data;
  }
  
  this.getCount = function () {
    var url = URL + "contador";
    return $http.post(url).then(responseData);
  };

  this.sendMensage = function (msg, categoria) {
    var url = URL;
    return $http.post(url, { data: msg, categoria: categoria}).then(responseData);
  };

  this.updateMensage = function (msg) {
    var url = URL;
    return $http.put(url, { data: msg }).then(responseData);
  };

  this.deleteMensage = function (msg) {
    var url = URL + msg._id;
    return $http.delete(url).then(responseData);
  };

  this.getMensages = function () {
    var url = URL + 'all';
    return $http.get(url).then(responseData);
  };

  this.getById = function (postId) {
    var url = URL + postId;
    return $http.get(url).then(responseData);
  };
  this.getByTopicId = function (postId) {
    var url = URL + 'post/' + postId;
    return $http.get(url).then(responseData);
  };

});
