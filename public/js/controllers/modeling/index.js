plantcoApp.controller('modelingController', function (
  $scope,
  $http,
  $window,
  modelService
) {

  function serverError() {
    toastr.error("Error en el servidor");
  }

  $scope.items = []
  $scope.startCreationItem = function(type){
    $("#"+type+"").modal("toggle")
    $scope.badname = false
    $scope.item = {}
    $scope.itemsCombo = []
    for(var a in $scope.items){
      $scope.itemsCombo.push($scope.items[a].name)
    }
    $scope.itemsCombol = $scope.items.length;
  }

  $scope.newName = function(type){
    console.log("aaa");
    if(!$scope.oldname){
      $scope.itemsCombo[$scope.itemsCombol] = $scope.item.name;
    }
    var result = $.grep($scope.items, function(e){ return e.name == $scope.item.name; });
    if(result.length != 0){
      $scope.badname = true
    }
  }



  $scope.accessElement = function(index, type){
    // Abrimos modal
    $("#"+type+"").modal("toggle")
    $scope.badname = false

    // Obtengo la informacion del objeto
    $scope.oldname = $scope.items[index].name;
    $scope.item = $scope.items[index];

    // Actualizo en que posicion se encuentra
    $scope.indexModified = index;

    // Genero el combo
    $scope.itemsCombo = []
    for(var a in $scope.items){
      $scope.itemsCombo.push($scope.items[a].name)
    }
    $scope.itemsCombol = $scope.items.length;

  }

  $scope.addElement = function(type){
    if($scope.oldname){
      // $scope.items.splice($scope.indexModified, 1);

      $scope.items[$scope.indexModified] = $scope.item;

      for(var a in $scope.items){
        if($scope.items[a].dependency1 == $scope.oldname){
          $scope.items[a].dependency1 = $scope.item.name
        }
        if($scope.items[a].dependency2 == $scope.oldname){
          $scope.items[a].dependency2 = $scope.item.name
        }
      }
      $scope.item = {}
      $scope.oldname = ''
      $("#"+type+"").modal("toggle")
      $("#"+type+"").toggle();
      $('.modal-backdrop').hide();
      $("body").removeClass("modal-open");
    }else{
      if($scope.item.name && $scope.item.name.length > 0){
        $scope.item.type = type
        var result = $.grep($scope.items, function(e){ return e.name == $scope.item.name; });
        if(result.length == 0){
          $scope.items.push($scope.item);
          $scope.item = {}
          $scope.oldname = ''
          $("#"+type+"").modal("toggle")
          $("#"+type+"").toggle();
          $('.modal-backdrop').hide();
          $("body").removeClass("modal-open");
        }else{
          $scope.badname = true
        }
      }else{
        $scope.badname = true
      }
    }
  }


  $scope.removeElement = function(index){
    $scope.items.splice(index, 1);

  }


  $scope.model = function(){
    if($scope.items.length > 0){
      modelService.getModel($scope.items)
      .then(function (data) {
        $scope.file = data.file
        $scope.odes ="/model_docs/"+ data.file + "_odes.m"
  $scope.driver ="/model_docs/"+ data.file + "Driver.m"
      }).catch(serverError);
    }
  }
});
