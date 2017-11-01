plantcoApp.controller('commonController', function (
  $scope,
  $http,
  $window,
  teamsService,
  activitiesService
) {

  function serverError() {
    toastr.error("Error en el servidor");
  }


  $scope.initController = function (user) {
    if(user){
      $scope.user = user;
      activitiesService.getUnread()
      .then(function (data) {
        var unreadActivities = _.filter(data, { readed: false });
        var numActivities = unreadActivities !== undefined ? unreadActivities.length : 0;
        if (numActivities === 0) {
          $scope.numActivitiesUnread = '';
        }else if (numActivities < 100) {
          $scope.numActivitiesUnread = numActivities;
        }else {
          $scope.numActivitiesUnread = '+99';
        }
      })
      .catch(serverError);

    }
  };
  // **************************************************************************
  // ROUTES
  // **************************************************************************
  $scope.getURLLogged = function (params) {
      if($scope.user){
        $window.location.href = '/users/' + $scope.user._id + '/' + params;
      }else{
        $window.location.href = '/' + params;
      }
  };




});
