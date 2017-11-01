plantcoApp.controller('newslettersController', function (
  $scope,
  $http,
  $window,
  newsletterService
) {

  $scope.toolbar = [
       ['h1', 'h2', 'p', 'quote'],
       ['bold', 'italics', 'underline', 'ul', 'ol', 'redo', 'undo'],
       ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
   ];

  $scope.msg = {
    header: '',
    content: '',
    destination: '1',
  };

  function serverError() {
    toastr.error("Error en el servidor");
  }

  $scope.send = function () {
    newsletterService.sendNewsletter($scope.msg)
      .then(function (data) {
        $window.location.reload();
      }).catch(serverError);
  };

});
