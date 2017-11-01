plantcoApp.controller('reverifyController', function (
  $scope,
  $http,
  $window
) {

  function serverError() {
    toastr.error("Error en el servidor");
  }

  $scope.init = function (email) {
    $scope.email = email;

  };

  $scope.resendEmail = function (email) {
    $http.post(
      '/api/users/reverifyEmail/' + $scope.email
    ).success(function (response) {
      $window.location.href = '/login';
    }).error(serverError);
  };
});
