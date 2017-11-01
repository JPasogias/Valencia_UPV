plantcoApp.controller('profileController', function (
  $scope,
  $http,
  $window,
  teamsService
) {

  // Funcion de error en el servidor
  function serverError() {
    toastr.error("Error en el servidor");
  }

  // Funcion init, recupera el objeto a editar
  $scope.show = 'info';
  $scope.init = function (team) {
    teamsService.getByNameId(team)
    .then(function (data) {
      $scope.team = data;
      $scope.team.insignia_old = data.insignia;
      $scope.team.name_old = data.name;
    })
    .catch(function () {
    });
  };

  // Metodo para cancelar los cambios
  $scope.cancel = function () {
    $window.location.reload();
  };


  // Metodo para guardar cambios
  $scope.save = function () {
    teamsService.update($scope.team)
    .then(function (data) {
      $window.location.href = $window.location.href.replace($scope.team.nameLowerCase, data.nameLowerCase);
    })
    .catch(function () {
    });
  };

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
    var url  = '/api/teams/uploadphoto';
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
        $scope.team.insignia = status;
        $scope.$apply()
        console.log(status);
      }
    });
    return false;
  });


});
