angular
.module('spaces')
.controller('IndexController', function($scope, supersonic, $http) {
  //Setup google maps
  var service = new google.maps.DistanceMatrixService;

  // get user's position
  supersonic.device.geolocation.getPosition().then( function(position) {
    $scope.userPosition = position;
  });
  
  $scope.sortBy = "Availability";
  
  // Get spaces from database
  var Space = supersonic.data.model('Space');
  Space.findAll().then( function(Spaces) {
  	$scope.spaces = Spaces;

    //get distance from user to space
    var spaceDistance = {};
    angular.forEach($scope.spaces, function(space, index){
      service.getDistanceMatrix({
        origins: [{lat: $scope.userPosition.coords.latitude, lng: $scope.userPosition.coords.longitude}],
        destinations: [{lat: space.Location.latitude, lng: space.Location.longitude}],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.IMPERIAL,
        avoidHighways: false,
        avoidTolls: false
      }, function(response, status) {
        if (status !== google.maps.DistanceMatrixStatus.OK) {
          supersonic.logger.info('Error was: ' + status);
        } else {
        spaceDistance[space.Address] = response.rows[0].elements[0].distance.text
        supersonic.logger.info(response.rows[0].elements[0].distance.text)
        }
      });
      $scope.spaceDistance = spaceDistance;
      $scope.$apply;
    });
  }, function(Error) {
    supersonic.logger.info(Error);
  });

  $scope.openSpacePage = function(objectId){
    var view = new supersonic.ui.View("space#index");
    supersonic.ui.layers.push(view, { params: {"spaceId":objectId}});
  }
});