plantcoApp.requires.push('ngMaterial');
plantcoApp.controller('newsController', function (
  $scope,
  $http,
  $window,
  newsService
) {

  $scope.toolbar = [
       ['h1', 'h2', 'p', 'quote'],
       ['bold', 'italics', 'underline', 'ul', 'ol', 'redo', 'undo'],
       ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
   ];

  function serverError() {
    toastr.error("Error en el servidor");
  }

  $scope.send = function () {
    newsService.updateNew($scope.msg)
      .then(function (data) {
        $window.location.reload();
      }).catch(serverError);
  };

  $scope.init = function (postId) {
    newsService.getById(postId)
      .then(function (data) {
        $scope.msg = data;
        $scope.msg.creationDate = new Date(data.creationDate);

      }).catch(serverError);
  };

});
