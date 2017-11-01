
plantcoApp.controller('forumController', function (
  $scope,
  $http,
  $window,
  forumCategoriaService,
  forumHiloService,
  forumMensajeService
) {




  function serverError() {
    toastr.error("Error en el servidor");
  }

  $scope.category = {
    type: 'general'
  }

  $scope.deletePost = function(id){
    forumHiloService.deleteHilo(id)
      .then(function (data) {
        $window.location.reload();
      })
      .catch(serverError);
  }


  $scope.newCategory = function (params) {
    forumCategoriaService.sendCategory($scope.category)
      .then(function (data) {
        $scope.category = {
          type: 'general'
        }
        toastr.success('Categoria creada con exito');
        $window.location.href = '/users/' + $scope.user._id + '/categories/' + data._id;
      })
      .catch(serverError);
  };
  $scope.newHilo = function (params) {
    $scope.topic.idCategoria = $scope.categoryId;
    forumHiloService.sendHilo($scope.topic)
      .then(function (data) {
        toastr.success('Topic created succesfully');
        $window.location.href = '/users/' + $scope.user._id + '/categories/' + $scope.category + '/topic/' + data._id;
      })
      .catch(serverError);
  };
  $scope.sendPost = function () {
    var content = $(".summernote").code();
    forumMensajeService.sendMensage(content, $scope.topicId)
      .then(function (data) {
        toastr.success('Topic created succesfully');
        $window.location.reload();
      })
      .catch(serverError);
  };
  $scope.init = function () {
    forumCategoriaService.getCategorys()
      .then(function (data) {
        $scope.categories = data;
      }).catch(serverError);
  };

  $scope.initTopic = function (category) {
    $scope.categoryId = category;
    forumHiloService.getByCategoryId(category)
      .then(function (data) {
        $scope.topics = data;
      }).catch(serverError);
  };
  $scope.initPost = function (category, post) {
    $scope.categoryId = category;
    $scope.topicId = post;
    forumMensajeService.getByTopicId(post)
      .then(function (data) {
        $scope.posts = data;
      }).catch(serverError);
  };
});
