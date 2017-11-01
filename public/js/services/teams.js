plantcoApp.service('teamsService', function ($http) {

  var URL = '/api/teams/';

  function responseData(response) {
    return response.data;
  }

  this.create = function (user) {
    var url = URL;
    return $http.put(url, user).then(responseData);
  };

  this.getByUser = function () {
    var url = URL + 'user';
    return $http.get(url).then(responseData);
  };

  this.getByNameId = function (teamname) {
    var url = URL + 'name-id/' + teamname;
    return $http.get(url).then(responseData);
  };

  this.getById = function (team) {
    var url = URL + team;
    return $http.get(url).then(responseData);
  };

  this.update = function (team) {
    var url = URL + team._id;
    return $http.post(url, { team: team }).then(responseData);
  };

  this.search = function (word) {
    var url = URL + 'search/' + word;
    return $http.get(url).then(responseData);
  };

  this.searchAll = function () {
    var url = URL + 'search/all/';
    return $http.get(url).then(responseData);
  };

  this.leftgroup = function (team) {
    var url = URL + team._id + '/left-group';
    return $http.post(url).then(responseData);
  };

});
