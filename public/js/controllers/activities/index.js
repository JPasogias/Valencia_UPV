plantcoApp.controller('activitiesController', function (
  $scope,
  $http,
  $window,
  activitiesService
) {

  function serverError() {
    toastr.error("Error en el servidor");
  }

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
      if (array[element].description == 'USER_CREATED') {
        result = '	<li class="list-group-item"><a href="#"><i class="fa fa-user-plus"></i>' + formatDate(array[element].time)  + ' ' + 'Usuario creado' + '</a></li>' + result;
      } else if (array[element].description == 'USER_LOGIN') {
        result = '	<li class="list-group-item"><a href="#"><i class="fa fa-plane"></i>' + formatDate(array[element].time)  + ' ' + 'Abierta sesión de usuario' + '</a></li>' + result;
      } else if (array[element].description == 'GROUP_CREATED') {
        result = '	<li class="list-group-item"><a href="#"><i class="fa fa-sign-in"></i>' + formatDate(array[element].time)  + ' ' + 'Creado grupo ' + '<strong>' + array[element].typeGroup.groupName + '</strong></a></li>' + result;
      } else if (array[element].description == 'LEFT_GROUP') {
        result = '	<li class="list-group-item"><a href="#"><i class="fa fa-sign-out"></i>' + formatDate(array[element].time)  + ' ' + 'Abandonado grupo ' + '<strong>' + array[element].typeGroup.groupName + '</strong></a></li>' + result;
      }
    }

    result = header + result + '</ul>';
    return result;
  }

  getUserActivities = function () {
    activitiesService.getByType('USER')
      .then(function (data) {
        var unreadActivities = _.filter(data, { readed: false });
        var numActivities = unreadActivities !== undefined ? unreadActivities.length : 0;
        if (numActivities === 0) {
          $scope.numActivitiesUnread = '';
        }else if (numActivities < 100) {
          $scope.numUnreadTypeUser = numActivities;
        }else {
          $scope.numUnreadTypeUser = '+99';
        }

        document.getElementById('UserActivities').innerHTML = getHTMLResults(data);
      })
      .catch(serverError);
  };

  getLogsActivities = function () {
    activitiesService.getByType('LOGIN')
      .then(function (data) {
        var unreadActivities = _.filter(data, { readed: false });
        var numActivities = unreadActivities !== undefined ? unreadActivities.length : 0;
        if (numActivities === 0) {
          $scope.numActivitiesUnread = '';
        }else if (numActivities < 100) {
          $scope.numUnreadTypeLogin = numActivities;
        }else {
          $scope.numUnreadTypeLogin = '+99';
        }

        document.getElementById('LogActivities').innerHTML = getHTMLResults(data);
      })
      .catch(serverError);
  };

  getGroupActivities = function () {
    activitiesService.getByType('GROUP')
      .then(function (data) {
        var unreadActivities = _.filter(data, { readed: false });
        var numActivities = unreadActivities !== undefined ? unreadActivities.length : 0;
        if (numActivities === 0) {
          $scope.numActivitiesUnread = '';
        }else if (numActivities < 100) {
          $scope.numUnreadTypeGroup = numActivities;
        }else {
          $scope.numUnreadTypeGroup = '+99';
        }

        document.getElementById('GroupActivities').innerHTML = getHTMLResults(data);
      })
      .catch(serverError);
  };

  $scope.markAsRead = function (type) {
    activitiesService.markAsRead(type)
      .then(function (data) {
        $window.location.reload();
      })
      .catch(serverError);
  };

  $scope.init = function (user) {
    $scope.user = user;
    getUserActivities();
    getLogsActivities();
    getGroupActivities();
  };

  $scope.openGroupWeb = function (groupId) {
    $window.location.href = '/users/' + $scope.user._id + '/teams/' + groupId;
  };
});
