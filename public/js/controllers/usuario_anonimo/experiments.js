plantcoApp.controller('experimentsController', function (
  $scope,
  $http,
  $window
) {

  function serverError(response) {
    $scope.validUser = false;
  }

  $scope.experiments = [{
    title: "juan",
    creationDate:"paso"

  },{
  title: "jua2n",
  creationDate:"p2aso"

}
]

});
