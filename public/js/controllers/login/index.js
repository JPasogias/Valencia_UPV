plantcoApp.controller('loginController', function (
  $scope,
  $http,
  $window,
  usersService,
  experimentsService,
  forumMensajeService,
  blogService
) {

  $scope.validUser = true;
  function serverError(response) {
    $scope.validUser = false;
  }

  $scope.init = function () {
    $scope.count = {}
    usersService.getCount()
    .then(function (data) {
      $scope.count.usersService = data.value;
    }).catch(serverError);
    experimentsService.getCount()
    .then(function (data) {
      $scope.count.experimentsService = data.value;
    }).catch(serverError);
    forumMensajeService.getCount()
    .then(function (data) {
      $scope.count.forumMensajeService = data.value;
    }).catch(serverError);
    blogService.getCount()
    .then(function (data) {
      $scope.count.blogService = data.value;
    }).catch(serverError);
  }

  $scope.login = function () {

    var dataTransfer = {
      username: $scope.email,
      password: $scope.password,
      remCredentials: $scope.checkbox,
    };

    $http.post(
      '/login',
      dataTransfer
    ).success(function (response) {
      if (response.error) {
        $scope.validUser = true;
        $window.location.href = '/account-not-activated';
      } else {
        $scope.validUser = true;
        $window.location.href = '/users/' + response.userId + '/dashboard';
      }
    }).error(serverError);
  };


  $scope.user = {
    personalInfo: {
      name: '',
      lastname: ''
    },
    email: '',
    password: '',
    teaminvitation: ''
  };

  $scope.register = function () {
    if($scope.user.personalInfo.name.length > 0 &&
      $scope.user.personalInfo.lastname.length > 0 &&
      $scope.user.email.length > 0 &&
      $scope.user.password.length > 0){
        usersService.create($scope.user)
        .then(function (data) {
          if (data.error) {
            $scope.validUser = false;
          } else {
            $window.location.href = '/check-email';
          }
        }).catch(serverError);
      }else{
        $scope.validUser = false;
      }
    };
  });
