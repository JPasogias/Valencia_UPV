plantcoApp.controller('newsController', function (
  $scope,
  $http,
  $window,
  newsService
) {

  $scope.toolbar = [
       ['h1', 'h2', 'p', 'quote'],
       ['bold', 'italics', 'underline', 'ul', 'ol', 'redo', 'undo'],
       ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
   ];

  $scope.msg = {
    header: '',
    content: '',
    type: 'NEWS',
    creationDate: new Date(),
    public: true,
  };

  function serverError() {
    toastr.error("Error en el servidor");
  }



  //DATEPICKER
  $scope.open = function () {
    if ($scope.msg.creationDate) {
      $scope.openDatePicker = true;
    } else {
      $scope.msg.creationDate = new Date();
      $scope.openDatePicker = true;
    }
  };

  $scope.formats = ['yyyy', 'dd MMMM yyyy', 'dd/MM/yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[2];

  $scope.dateOptions = {
    showWeeks: false,
    minMode: 'day',
    maxMode: 'year',
    startingDay: 0,
    yearRange: 120,
    minDate: null,
    maxDate: null,
  };

  $scope.send = function () {
    newsService.sendNew($scope.msg)
      .then(function (data) {
        $window.location.reload();
      }).catch(serverError);
  };

});
