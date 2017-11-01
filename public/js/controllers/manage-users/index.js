plantcoApp.controller('adminUsersController', function (
  $scope,
  $http,
  $window,
  usersService
) {

  function serverError() {
    toastr.error("Error en el servidor");
  }


  $scope.init = function () {
    usersService.getUsers()
      .then(function (data) {
        console.log(data);
        $scope.superadminUsers = data.filter(function isSuperadmin(o) {
          return o.superadmin === true;
        });
        $scope.adminUsers = data.filter(function isAdmin(o) {
          return o.admin === true;
        });
        $scope.users = data.filter(function isUser(o) {
          return o.admin === false && o.superadmin === false;
        });
      })
      .catch(serverError);
  };

  $scope.setEditableUser = function (userId) {
    $scope.editableUser = userId;
  };

  $scope.updateUser = function (user) {
    usersService.update(user)
      .then(function (data) {
        $scope.init();
      })
      .catch(serverError);
  };

});
