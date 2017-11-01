plantcoApp.controller('passwordController', function (
  $scope,
  $http,
  $window
) {

  function serverError(response) {
    $scope.validUser = false;
  }

  $scope.validUser = true;

  $scope.recoverpassword = function () {

    var dataTransfer = {
      username: $scope.email,
      password: $scope.password,
      remCredentials: $scope.checkbox,
    };

    $http.post(
      '/login',
      dataTransfer

    ).success(function (response) {
      if (response.error && response.data === 'notVerified') {
        $scope.validUser = true;
        $window.location.href = '/account-not-activated';
      } else {
        $scope.validUser = true;
        $window.location.href = '/users/' + response + '/dashboard';
      }
    }).error(serverError);
  };
});
