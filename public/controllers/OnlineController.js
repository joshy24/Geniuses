myApp.controller('OnlineController', ['$scope','$state', '$interval','service', 'responseReview', 'authService', function($scope, $state, $interval, service, responseReview, authService){
    
    var is_checking = false;
    
    $scope.isLoggedIn = false;
    
    if(authService.isLoggedIn()){
        $scope.isLoggedIn = true;
             check_online();
    }
    else{

    }
    
    $scope.$on('logout', function(){
        $scope.isLoggedIn = false;
        $scope.online = [];
    });
    
    $scope.$on('current_user',function(){
        if(authService.isLoggedIn()){
             $scope.isLoggedIn = true;
             check_online();
        }
        else{

        }
    });
    
    
    function check_online(){
       if(authService.isLoggedIn()){ 
            if(service.setfriendsOnline()){
                is_checking = true;
                service.send().then(function(response){
                    if(responseReview.check(response.data)){
                        $scope.online = response.data.data;
                    }
                },function(error){

                }).finally(function(){
                    is_checking = false;
                });
            }
       }
    }
    
    $interval(function(){
        if(is_checking==false){
           check_online(); 
        }
    },3600000);
    
	
	$scope.showProfile = function(uid){
		$state.go("user", {id: uid});
	}
    
}]);