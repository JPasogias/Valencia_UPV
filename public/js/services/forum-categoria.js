plantcoApp.service('forumCategoriaService', function ($http) {

  var URL = '/api/forum-categoria/';

  function responseData(response) {
    return response.data;
  }

  this.sendCategory = function (msg) {
    var url = URL;
    return $http.post(url, { data: msg }).then(responseData);
  };

  this.updateCategory = function (msg) {
    var url = URL;
    return $http.put(url, { data: msg }).then(responseData);
  };

  this.deleteCategory = function (msg) {
    var url = URL + msg._id;
    return $http.delete(url).then(responseData);
  };

  this.getCategorys = function () {
    var url = URL + 'all';
    return $http.get(url).then(responseData);
  };

  this.getById = function (postId) {
    var url = URL + postId;
    return $http.get(url).then(responseData);
  };
});
