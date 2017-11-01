plantcoApp.controller('profileController', function (
  $scope,
  $http,
  $window,
  usersService
) {

  // upload on file select or drop
  $scope.upload = function (file) {
      Upload.upload({
          url: '/api/users/uploadphoto',
          data: {file: file, 'username': $scope.user._id}
      }).then(
        function (resp) {
          $window.location.reload();
      }, function (resp) {
          console.log('Error status: ' + resp.status);
      }, function (evt) {
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          console.log('progress: ' + progressPercentage + '% ');
      });
  };


  // upload later on form submit or something similar
  $scope.saveImagen = function() {
      $scope.upload($scope.picFile);
  };



    function serverError() {
      toastr.error("Error en el servidor");
    }

    $scope.show = 'info';
    $scope.init = function (user) {
      $scope.user = user;
      $scope.personalInfo = user.personalInfo || {};
      if ($scope.user.welcomeModal == true) {
        $scope.user.welcomeModal = false;
        usersService.update($scope.user)
          .then(function (data) {
            $window.location.href = '/users/' + data._id + '/manage-profile';
          })
          .catch(function () {
          });
      }

    };

    $scope.cancel = function () {
      $window.location.href = '/users/' + $scope.user._id + '/' + params;
    };

    $scope.changepassword = function () {
      $scope.flagpassword = false;
      $scope.flagpassword2 = false;
      if($scope.pasword.newpassword1 === $scope.pasword.newpassword2){
        usersService.updatePassword($scope.pasword)
          .then(function (data) {
            if(data){
              toastr.success('Password changed successfully');
              $scope.pasword = {}
            }else{
              $scope.flagpassword2 = true;
            }
          })
          .catch(function () {
          });
      }else{
        $scope.flagpassword = true;
      }
    }

    $scope.save = function () {
      $scope.user.personalInfo = $scope.personalInfo;
      usersService.update($scope.user)
        .then(function (data) {
          $window.location.href = '/users/' + data._id + '/profile';
        })
        .catch(function () {
        });
    };

  });
