plantcoApp.controller('experimentController', function (
  $scope,
  $http,
  $window,
  experimentsService
) {


  // ****************************************************************************
  // Editar foto de perfil
  // ****************************************************************************
  // Metodo para que un boton llame al "boton oculto" de seleccion de fichero
  $(document).ready( function() {
    $('#falseinput').click(function(){
      $("#image_file").click();
    });
  });

  // Metodo para que una vez se haya seleccionado un fichero se simule un click en el envio del formularop
  document.getElementById("image_file").onchange = function() {
    $("#fileinput").click();
  };

  $("#image_file").change(function(){
    event.preventDefault();
    var url  = '/api/experiments/uploadphoto';
    var image_file = $('#image_file').get(0).files[0];
    var formData = new FormData();
    formData.append("image_file", image_file);
    $.ajax({
      url: url,
      type: 'POST',
      data: formData,
      async: true,
      cache: false,
      contentType: false,
      processData: false,
      success: function (status) {
        $scope.experiment.abstractimage = status;
        $scope.$apply()
        console.log(status);
      }
    });
    return false;
  });

  function serverError() {
    toastr.error("Error en el servidor");
  }

  $scope.concentration = 0;

  $scope.init = function(idExperiment){
    if(idExperiment){
      experimentsService.getById(idExperiment)
      .then(function (data) {
        $scope.experiment = data;
        setTimeout(function(){
          $('#abstractmsg').code(data.abstractmsg);
          $('#protocolmsg').code(data.protocolmsg);
          $('#conditionsmsg').code(data.conditionsmsg);
          $('#resultsmsg').code(data.resultsmsg);
          $('#bibliographymsg').code(data.bibliographymsg);
        }, 1000);
      })
      .catch(serverError);
    }else{
      $scope.experiment = {
        title: '',
        category: 'OTHER EXPERIMENTS',
        status: 'SUCCESS',
        chassis: '',
        keyword1: '',
        keyword2: '',
        keyword3: '',
        keyword4: '',
        team:'',
        abstractmsg: '',
        abstractimage: '/images/default-experiment.png',
        protocolmsg: '',
        reactives:[],
        equipment:[],
        conditionsmsg: '',
        plants: 0,
        replications: 0,
        resultsmsg: '',
        bibliographymsg: '',
      }
    }
  }

  $scope.addReactive = function() {
    var alreadyin = false;
    if ($scope.reactives != '' && $scope.concentration > 0) {
      for(var o in $scope.experiment.reactives){
        if ( $scope.experiment.reactives[o].name == $scope.reactives) {
          alreadyin = true;
        }
      }
      if(!alreadyin){
        $scope.experiment.reactives.push({
          name:$scope.reactives,
          concentration:$scope.concentration,
        })
      }
      $scope.reactives = '';
      $scope.concentration = 0;
    }
  }

  $scope.deleteReactive = function(reactive) {
    var newarr = []
    for( var o in $scope.experiment.reactives)  {
      if ( $scope.experiment.reactives[o].name != reactive) {
        newarr.push( $scope.experiment.reactives[o]);
      }
    }
    $scope.experiment.reactives = newarr;
  }

  $scope.editReactive = function(reactive) {
    var newarr = []
    for( var o in $scope.experiment.reactives)  {
      if ( $scope.experiment.reactives[o].name != reactive) {
        newarr.push( $scope.experiment.reactives[o]);
      }else {
        $scope.reactives = $scope.experiment.reactives[o].name;
        $scope.concentration = $scope.experiment.reactives[o].concentration;
      }
    }
    $scope.experiment.reactives = newarr;
  }

  $scope.addEquipment = function() {
    var alreadyin = false;
    if ($scope.equip != '') {
      for(var o in $scope.experiment.equipment){
        if ( $scope.experiment.equipment[o].name == $scope.equip) {
          alreadyin = true;
        }
      }
      if(!alreadyin){
        $scope.experiment.equipment.push({
          name:$scope.equip,
        })
      }
      $scope.equip = '';
    }
  }

  $scope.deleteEquipment = function(equip) {
    var newarr = []
    for( var o in $scope.experiment.equipment)  {
      if ( $scope.experiment.equipment[o].name != equip) {
        newarr.push( $scope.experiment.equipment[o]);
      }
    }
    $scope.experiment.equipment = newarr;
  }

  $scope.editEquipment = function(equip) {
    var newarr = []
    for( var o in $scope.experiment.equipment)  {
      if ( $scope.experiment.equipment[o].name != equip) {
        newarr.push( $scope.experiment.equipment[o]);
      }else {
        $scope.equip = $scope.experiment.equipment[o].name;
      }
    }
    $scope.experiment.equipment = newarr;
  }

  $scope.send = function(){
    $scope.experiment.abstractmsg = $('#abstractmsg').code();
    $scope.experiment.protocolmsg = $('#protocolmsg').code();
    $scope.experiment.conditionsmsg = $('#conditionsmsg').code();
    $scope.experiment.resultsmsg = $('#resultsmsg').code();
    $scope.experiment.bibliographymsg = $('#bibliographymsg').code();
    experimentsService.sendExperiment($scope.experiment)
    .then(function (data) {
      var url = $window.location.href.substring(0,$window.location.href.indexOf('/manage-experiment') -1) + "/"  + data._id;
      $window.location.href = url;
    })
    .catch(serverError);
  }

  $scope.edit = function(){
    $scope.experiment.abstractmsg = $('#abstractmsg').code();
    $scope.experiment.protocolmsg = $('#protocolmsg').code();
    $scope.experiment.conditionsmsg = $('#conditionsmsg').code();
    $scope.experiment.resultsmsg = $('#resultsmsg').code();
    $scope.experiment.bibliographymsg = $('#bibliographymsg').code();
    experimentsService.updateExperiment($scope.experiment)
    .then(function (data) {
      var url = $window.location.href.substring(0,$window.location.href.indexOf('/manage-experiment') -1) + "/" + data._id;
      $window.location.href = url;
    })
    .catch(serverError);
  }
});
