plantcoApp.service('teamInvitationsService', function ($http) {

  var URL = '/api/teams/invitations/';

  function responseData(response) {
    return response.data;
  }

  this.create = function (teamId, email) {
    var url = URL;
    var dataTransfer = {
      idTeam: teamId,
      email: email,
    };
    return $http.put(url, { data: dataTransfer }).then(responseData);
  };

  this.get = function (teamId) {
    var url = URL + teamId;
    return $http.get(url).then(responseData);
  };

  this.delete = function (invitationId) {
    var url = URL + invitationId;
    return $http.delete(url).then(responseData);
  };

  this.getByUser = function () {
    var url = URL;
    return $http.get(url).then(responseData);
  };

  this.acceptInvitation = function (teamId) {
    var url = URL + teamId + '/accept-invitation';
    return $http.post(url).then(responseData);
  };

});
