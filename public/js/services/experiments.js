plantcoApp.service('experimentsService', function ($http) {

  var URL = '/api/experiments/';

  function responseData(response) {
    return response.data;
  }

  this.getCount = function () {
    var url = URL + "contador";
    return $http.post(url).then(responseData);
  };
  
  this.sendExperiment = function (msg) {
    var url = URL;
    return $http.post(url, { data: msg }).then(responseData);
  };

  this.updateExperiment = function (msg) {
    var url = URL;
    return $http.put(url, { data: msg }).then(responseData);
  };

  this.deleteExperiment = function (msgId) {
    var url = URL + msgId;
    return $http.delete(url).then(responseData);
  };

  this.getExperiments = function () {
    var url = URL + 'all';
    return $http.get(url).then(responseData);
  };

  this.getById = function (postId) {
    var url = URL + postId;
    return $http.get(url).then(responseData);
  };
});
