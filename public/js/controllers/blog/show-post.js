plantcoApp.controller('blogController', function (
  $scope,
  $http,
  $window,
  blogService
) {

  function serverError() {
    toastr.error("Error en el servidor");
  }

  $scope.init = function(idPost){
    blogService.getById(idPost)
    .then(function (data) {
      $scope.post = data;
      document.getElementById("contentmsg").innerHTML = data.contentmsg;
    })
    .catch(serverError);
  }
});
