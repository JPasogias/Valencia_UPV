plantcoApp.service('modelService', function ($http) {

  var URL = '/api/model/';

  function responseData(response) {
    return response.data;
  }

  this.getModel = function (msg) {
    var url = URL;
    return $http.post(url, { data: msg }).then(responseData);
  };

});
