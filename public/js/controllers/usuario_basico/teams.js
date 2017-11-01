plantcoApp.controller('teamController', function (
  $scope,
  $http,
  $window,
  teamsService,
  teamInvitationsService
) {

  $scope.isPrivate = true;
  $scope.team = {
    name: '',
    isPublic: !$scope.isPrivate,
    insignia: 'et-presentation',
    description: '',
  };

  function serverError() {
    toastr.error("Error en el servidor");
  }

  $scope.newGroup = function () {
    $scope.team.isPublic =  !$scope.isPrivate;
    teamsService.create($scope.team)
      .then(function (data) {
        $window.location.reload();
      })
      .catch(serverError);

  };

  $scope.init = function (user) {
    $scope.user = user;

    teamInvitationsService.getByUser()
      .then(function (data) {
        $scope.invitations = data;
      })
      .catch(serverError);

    teamsService.getByUser(user._id)
      .then(function (data) {
        $scope.myTeams = data;
      })
      .catch(serverError);

  };

  $scope.search = function () {
    if($scope.valuesearch){
      teamsService.search($scope.valuesearch)
        .then(function (data) {
          $scope.myTeamsSearch = data;
        })
        .catch(serverError);
    }else{
      teamsService.searchAll()
        .then(function (data) {
          $scope.myTeamsSearch = data;
        })
        .catch(serverError);
    }

  };

  $scope.imgSelect = function (imgselected) {
    $scope.team.insignia = imgselected;
  };

  $scope.openGroupWeb = function (groupId) {
    $window.location.href = '/users/' + $scope.user._id + '/teams/' + groupId;
  };

  $scope.removeInvitation = function (invitationId) {
    teamInvitationsService.delete(invitationId)
      .then(function (data) {
        teamInvitationsService.getByUser()
          .then(function (data) {
            $scope.invitations = data;
          })
          .catch(serverError);
      })
      .catch(serverError);
  };

  $scope.acceptInvitation = function (invitationId) {
    teamInvitationsService.acceptInvitation(invitationId)
      .then(function (data) {
        $window.location.reload();
      })
      .catch(serverError);
  };
});
