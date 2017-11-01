plantcoApp.controller('newsController', function (
  $scope,
  $http,
  $window,
  newsService
) {

  $scope.msg = {
    header: '',
    content: '',
    type: 'NEWS',
    creationDate: new Date(),
    public: true,
  };

  function serverError() {
    toastr.error("Error en el servidor");
  }

  $scope.send = function () {
    newsService.sendNew($scope.msg)
      .then(function (data) {
        $window.location.reload();
      }).catch(serverError);
  };

  $scope.init = function () {
    newsService.getNews()
      .then(function (data) {
        $scope.posts = data;
      }).catch(serverError);
  };

  $scope.deletePost = function (post) {
    newsService.deleteNew(post)
      .then(function (data) {
        $window.location.reload();
      }).catch(serverError);
  };

  $scope.editPost = function (post) {
    $window.location.href = '/users/' + $scope.user._id + '/news/' + post;
  };

});
