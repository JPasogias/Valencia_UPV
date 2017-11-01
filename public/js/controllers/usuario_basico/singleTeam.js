plantcoApp.controller('teamController', function (
  $scope,
  $http,
  $window,
  teamsService,
  activitiesService,
  teamInvitationsService,
  teamRequestService,
  crisprElementsService
) {

  function serverError() {
    toastr.error("Error en el servidor");
  }

  $scope.panel = 'dashboard';

  function clearTable(array) {
    array = array.filter(function (este, i) {
        return array.indexOf(este) == i;
      });

    for (var i in array) {
      array[i].openRow = false;
    }
    return array;
  }


  $scope.init = function (user, team) {
    $scope.user = user;
    teamsService.getById(team)
      .then(function (data) {
        $scope.team = data;
        crisprElementsService.getByTeamId(data._id)
          .then(function (data) {
            $scope.crisprs = clearTable(data);
          })
          .catch(serverError);
      })
      .catch(serverError);

  };

  $scope.editableTeam = function () {
    $scope.name = $scope.team.name;
    $scope.description = $scope.team.description;
    $scope.insignia = $scope.team.insignia;
    $scope.isPrivate = !$scope.team.isPublic;
  };

  $scope.cancelEditTeam = function () {
    $scope.editableTeam();
    $scope.panel = 'dashboard';
  };

  $scope.saveEditTeam = function () {
    $scope.team.name = $scope.name;
    $scope.team.description = $scope.description;
    $scope.team.insignia = $scope.insignia;
    $scope.team.isPublic = !$scope.isPrivate;
    $scope.panel = 'dashboard';
    teamsService.update($scope.team)
      .then(function (data) {
        $scope.team = data;
      })
      .catch(serverError);
  };

  $scope.imgSelect = function (imgselected) {
    $scope.insignia = imgselected;
  };

  $scope.leftgroup = function (imgselected) {
    teamsService.leftgroup($scope.team)
      .then(function (data) {
        $window.location.href = '/users/' + $scope.user._id + '/teams';
      })
      .catch(serverError);
  };

  function formatDate(dateString) {
    var date = new Date(dateString);
    var local = new Date(date);
    local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return local.toJSON().slice(0, 16).replace('T', ' ');
  }

  function getHTMLResults(array) {
    var header = '<ul class=" slimscroll height-300 side-nav list-group margin-bottom30" data-slimscroll-visible="true" style="overflow: hidden; width: auto; height: 300px;">';
    var result = '';

    for (element in array) {
      if (array[element].description == 'GROUP_CREATED') {
        result = '	<li class="list-group-item"><a href="#"><i class="fa fa-sign-in"></i>' + formatDate(array[element].time)  + ' ' + 'Creado grupo ' + '<strong>' + array[element].typeGroup.groupName + '</strong></a></li>' + result;
      } else if (array[element].description == 'LEFT_GROUP') {
        result = '	<li class="list-group-item"><a href="#"><i class="fa fa-sign-out"></i>' + formatDate(array[element].time)  + ' ' + 'Abandonado grupo ' + '<strong>' + array[element].typeGroup.groupName + '</strong></a></li>' + result;
      }
    }

    result = header + result + '</ul>';
    return result;
  }

  $scope.loadActivities = function () {
    activitiesService.getByTeam($scope.team._id)
      .then(function (data) {
        document.getElementById('GroupActivities').innerHTML = getHTMLResults(data);
      })
      .catch(serverError);
  };

  $scope.sendInvitation = function () {
    teamInvitationsService.create($scope.team._id, $scope.invitationEmail)
      .then(function (data) {
        $scope.invitationEmail = '';
        $scope.getInvitations();
        if (data.error) {
          $scope.invalidEmail = true;
        }else {
          $scope.invalidEmail = false;
        }
      })
      .catch(serverError);
  };

  $scope.getInvitations = function () {
    teamInvitationsService.get($scope.team._id)
      .then(function (data) {
        $scope.invitations = data;
      })
      .catch(serverError);
  };

  $scope.removeInvitation = function (invitationId) {
    teamInvitationsService.delete(invitationId)
      .then(function (data) {
        $scope.getInvitations();
      })
      .catch(serverError);
  };

});
