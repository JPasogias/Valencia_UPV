plantcoApp.service('teamRequestService', function ($http) {

  var URL = '/api/activities/';

  function responseData(response) {
    return response.data;
  }

  this.getByType = function (type) {
    var url = URL + type;
    return $http.get(url).then(responseData);
  };

  this.getAll = function () {
    var url = URL;
    return $http.get(url).then(responseData);
  };

  this.getUnread = function () {
    var url = URL + 'unread';
    return $http.get(url).then(responseData);
  };

  this.markAsRead = function (type) {
    var url = URL + type;
    return $http.post(url).then(responseData);
  };

  this.getByTeam = function (idTeam) {
    var url = URL + 'team/' + idTeam;
    return $http.get(url).then(responseData);
  };

});
