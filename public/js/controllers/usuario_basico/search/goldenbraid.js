plantcoApp.controller('gbSearchController', function (
  $scope,
  $http,
  $window,
  gbElementsService,
  gbElementsTypesService
) {

  function serverError() {
    toastr.error("Error en el servidor");
  }

  $scope.init = function (user, element) {
    $scope.user = user;
    if (element) {
      $scope.element = element;
      gbElementsTypesService.get()
      .then(function (data) {
        for (var type in data) {
          if (data[type].key == element) {
            for (var subtype in data[type].subtypes) {
              data[type].subtypes[subtype].token = data[type].subtypes[subtype].ini + ' - ' + data[type].subtypes[subtype].end;
            }

            $scope.subtype = data[type].subtypes[0];
            $scope.combotypes = data[type].subtypes;

            if (data[type].subtypes.length > 1) {
              $scope.showSubtypes = true;
            }
          }
        }
      })
      .catch(function () {
      });

      $scope.showResults = true;
    }
  };

});
