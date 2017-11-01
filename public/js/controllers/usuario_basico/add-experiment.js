plantcoApp.controller('addExperimentController', function (
  $scope,
  $http,
  $window
) {
  $scope.experiment = {
    title: '',
    author: '',
    date: '',
    image: '',
    chassis: '',
    keyWords: [],
    abstract: '',
    protocol: '',
    conditions: '',
    result: '',
    bibliography: '',
    attached: ''
  }

  function serverError() {
    toastr.error("Error en el servidor");
  }
  $scope.init = function (user) {
    $scope.user = user
}
  $scope.save = function () {
    crisprElementsService.save($scope.experiment)
    .then(function (data) {
      $window.location.reload();
    })
    .catch(serverError);
  }
});
