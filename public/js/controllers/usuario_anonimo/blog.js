plantcoApp.controller('dashboardController', function (
  $scope,
  $http,
  $window,
  newsService
) {

  function serverError() {
    toastr.error("Error en el servidor");
  }

  $scope.init = function () {
    newsService.getNews()
      .then(function (data) {
        $scope.posts = data;
      }).catch(serverError);
  };

});
