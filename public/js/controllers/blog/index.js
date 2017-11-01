plantcoApp.controller('blogController', function (
  $scope,
  $http,
  $window,
  blogService
) {

  function serverError() {
    toastr.error("Error en el servidor");
  }

  $scope.init = function(){
    blogService.getNews()
    .then(function (data) {
      $scope.posts = data;
      // $scope.countp = {
      //   'ALL': data.length,
      //   'NEW': data.filter(function( obj ) {  return obj.category == 'NEW';}).length,
      //   'MEDIA': data.filter(function( obj ) {  return obj.category == 'MEDIA';}).length,
      //   'USER_SUPPORT': data.filter(function( obj ) {  return obj.category == 'USER SUPPORT';}).length,
      //   'DEVELOPMENT': data.filter(function( obj ) {  return obj.category == 'DEVELOPMENT';}).length,
      //   'UNCATEGORIZED': data.filter(function( obj ) {  return obj.category == 'UNCATEGORIZED';}).length,
      // }

    })
    .catch(serverError);
  }

  $scope.posibleDeletion = function(postId){
    $scope.posibleDeletionId = postId
  }

  $scope.delete = function(){
    blogService.deleteNew($scope.posibleDeletionId)
    .then(function (data) {
      $window.location.reload();
    })
    .catch(serverError);
  }

  $scope.filterC = 'ALL';
  $scope.setGroup = function (name) {
    $scope.filterC = name;
  };
});
