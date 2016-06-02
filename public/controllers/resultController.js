myApp.controller('resultController', ['$scope', '$state', '$stateParams', 'authService', function($scope, $state, $stateParams, authService){
      if(authService.isLoggedIn()){
          
        $('.horizontal-menu').show();
        $('.imgpanel').show();  
          
        if($stateParams.result&&$stateParams.result!=false){
           
            $scope.result  = $stateParams.result;
        }
        else{
            $state.go("examparameters");  
        }
      }
      else{
          authService.logOut();
      }
    
}]);