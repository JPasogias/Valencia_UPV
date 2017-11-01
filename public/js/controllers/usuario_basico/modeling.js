plantcoApp.controller('modelingController', function (
  $scope,
  promotoresService,
  proteinasService,
  terminadoresService
) {


  function serverError() {
    toastr.error("Error en el servidor");
  }

  $scope.init = function init() {
    promotoresService.getConstitutivos()
    .then(function (data) {
      $scope.promotores=data;
      $scope.promotorsaeleccionado=data[0];
    })
    .catch(serverError);

    proteinasService.getAll()
    .then(function (data) {
      $scope.proteinas=data;
      $scope.proteinasaeleccionada=data[0];
    })
    .catch(serverError);

    terminadoresService.getAll()
    .then(function (data) {
      $scope.terminadores=data;
      $scope.terminadorseleccionado=data[0];
    })
    .catch(serverError);
  }
});
