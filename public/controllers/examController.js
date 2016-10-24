
myApp.controller('examController', ['$scope', '$state', '$stateParams', 'authService', 'storageService', function( $scope, $state, $stateParams, authService, storageService){
    if(authService.isLoggedIn()){   
       $('.imgpanel').hide();  
		
		if($stateParams.exam){
		  $scope.exam = $stateParams.exam;
		  storageService.setStorageValue("exam", $scope.exam);
		}     
		else{
		  $scope.exam = storageService.getStorageValue("exam");

		  if($scope.exam==false&&$scope.exam==undefined){
			  $state.go("examparameters");	
		  }  
		}
}
    else{
        authService.logOut();
    }
}]);