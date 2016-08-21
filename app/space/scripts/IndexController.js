angular
  .module('space')
  .controller('IndexController', function($scope, supersonic) {
    var stopListening = supersonic.ui.views.current.params.onValue( function(params) {
	  $scope.spaceId = params.spaceId;
	});

  	$scope.getAvail = function() {
  		$scope.refreshing = "refreshing..."
		$scope.$apply();
	  	Space.find($scope.spaceId).then( function(result) {
		  	supersonic.logger.info(result);
		  	$scope.space = result;
		  	$scope.refreshing = "";
		  	$scope.$apply();
		}, function(error) {
			supersonic.logger.info(error);
		});
	}

	// Get space from database
  	var Space = supersonic.data.model('Space');
  	$scope.getAvail();
  });
