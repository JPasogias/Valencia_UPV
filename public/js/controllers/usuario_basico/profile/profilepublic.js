plantcoApp.controller('profileController', function (
  $scope,
  $http,
  $window,
  usersService
) {

  function serverError() {
    toastr.error("Error en el servidor");
  }

  $scope.init = function (user, userview) {
    $scope.user = user;
    usersService.getByName(userview)
      .then(function (data) {
        $scope.userview = data;
      })
      .catch(serverError);
  };

});
