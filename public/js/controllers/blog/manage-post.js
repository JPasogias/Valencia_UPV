plantcoApp.controller('blogController', function (
  $scope,
  $http,
  $window,
  blogService
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
    var url  = '/api/blog/uploadphoto';
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
        $scope.msg.image = status;
        $scope.$apply()
        console.log(status);
      }
    });
    return false;
  });



  function serverError() {
    toastr.error("Error en el servidor");
  }



  $scope.init = function(idPost){
    if(idPost){
      blogService.getById(idPost)
      .then(function (data) {
        $scope.msg = data;
        setTimeout(function(){
          $('#datepicker').datepicker('setDate', data.publishdate);
          $("#summernoteEditor").code(data.contentmsg);
        }, 1000);
      })
      .catch(serverError);
    }else{
    $scope.msg = {
      header: '',
      publishdate: '',
      category: 'Latest on Plant SynBio',
      image: '/images/default-post.png',
      contentmsg: ''
    }
    }
  }

  $scope.send = function(){
    $scope.msg.publishdate= $("#datepicker").datepicker( "getDate" );
    $scope.msg.contentmsg= $("#summernoteEditor").code();
    blogService.sendNew($scope.msg)
    .then(function (data) {
      $window.location.href = $window.location.href.substring(0,$window.location.href.indexOf('/manage-post') );
    })
    .catch(serverError);
  }

  $scope.edit = function(){
    $scope.msg.publishdate= $("#datepicker").datepicker( "getDate" );
    $scope.msg.contentmsg= $("#summernoteEditor").code();
    blogService.updateNew($scope.msg)
    .then(function (data) {
      $window.location.href = $window.location.href.substring(0,$window.location.href.indexOf('/manage-post') );
    })
    .catch(serverError);
  }
});
