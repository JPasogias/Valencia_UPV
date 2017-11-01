plantcoApp.controller('experimentController', function (
  $scope,
  $http,
  $window,
  experimentsService
) {

  function serverError() {
    toastr.error("Error en el servidor");
  }

  $scope.init = function(){
    experimentsService.getExperiments()
    .then(function (data) {
      $scope.experiments = data;
      $scope.countp = {
        'ALL': data.length,
        'TRANSCRIPTION_WITH_LUCIFERASE': data.filter(function( obj ) {  return obj.category == 'TRANSCRIPTION WITH LUCIFERASE';}).length,
        'TRANSCRIPTION_WITH_FLUORESCENCE': data.filter(function( obj ) {  return obj.category == 'TRANSCRIPTION WITH FLUORESCENCE';}).length,
        'TRANSCRIPTION_WITH_RNA': data.filter(function( obj ) {  return obj.category == 'TRANSCRIPTION WITH RNA';}).length,
        'PROTEIN_EXTRACTION': data.filter(function( obj ) {  return obj.category == 'PROTEIN EXTRACTION';}).length,
        'PROTEIN_PURIFICATION': data.filter(function( obj ) {  return obj.category == 'PROTEIN PURIFICATION';}).length,
        'TRANSFORMATION_EFFICIENCY': data.filter(function( obj ) {  return obj.category == 'TRANSFORMATION EFFICIENCY';}).length,
        'GENOTYPING': data.filter(function( obj ) {  return obj.category == 'GENOTYPING';}).length,
        'RESTRICTION_ANALISIS': data.filter(function( obj ) {  return obj.category == 'RESTRICTION ANALISIS';}).length,
        'CRISP_TARGET_EFFICIENCY': data.filter(function( obj ) {  return obj.category == 'CRISP TARGET EFFICIENCY';}).length,
        'OTHER_EXPERIMENTS': data.filter(function( obj ) {  return obj.category == 'OTHER EXPERIMENTS';}).length,
      }

    })
    .catch(serverError);
  }

  $scope.posibleDeletion = function(postId){
    $scope.posibleDeletionId = postId
  }

  $scope.delete = function(){
    experimentsService.deleteExperiment($scope.posibleDeletionId)
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
