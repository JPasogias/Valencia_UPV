plantcoApp.service('newsletterService', function ($http) {

  var URL = '/api/newsletters/';

  function responseData(response) {
    return response.data;
  }

  this.create = function (email) {
    var url = URL;
    var dataTransfer = {
      email: email,
    };
    return $http.post(url, { data: dataTransfer }).then(responseData);
  };

  this.sendNewsletter = function (msg) {
    var url = URL + 'send';
    return $http.post(url, { data: msg }).then(responseData);
  };

});
