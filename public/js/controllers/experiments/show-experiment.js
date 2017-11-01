plantcoApp.controller('experimentController', function (
  $scope,
  $http,
  $window,
  experimentsService
) {

  function serverError() {
    toastr.error("Error en el servidor");
  }

  $scope.init = function(idExperiment){
    experimentsService.getById(idExperiment)
    .then(function (data) {
      $scope.experiment = data;
      document.getElementById("abstractmsg").innerHTML = data.abstractmsg;
      document.getElementById("protocolmsg").innerHTML = data.protocolmsg;
      document.getElementById("conditionsmsg").innerHTML = data.conditionsmsg;
      document.getElementById("resultsmsg").innerHTML = data.resultsmsg;
      document.getElementById("bibliographymsg").innerHTML = data.bibliographymsg;
    })
    .catch(serverError);
  }
  $scope.showforo = function(){
    debugger;

    var url = $window.location.href.substring(0,$window.location.href.indexOf('/experiment')) + $scope.experiment.forum;
    $window.location.href = url;
  }
});
