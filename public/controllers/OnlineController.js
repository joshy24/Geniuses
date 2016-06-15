myApp.controller('OnlineController', ['$scope','$state', '$interval','service', 'responseReview', 'authService', 'socket', function($scope, $state, $interval, service, responseReview, authService, socket){
    
    var is_checking = false;
    
    $scope.isLoggedIn = false;
	
	$scope.online = [];
    
    check_online();
    
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
			$scope.isLoggedIn = true;

			socket.on("new friend online",function(data){
				var contains = false;

				if($scope.online.length>0){
					for(var i=0;i<$scope.online.length;i++){
						if($scope.online[i].id==data.id){
							contains = true;
							break;
						}
					}

					if(contains===false){
						$scope.online.push(data);
					}
				}
				else{
					$scope.online.push(data);
				}
			});
		   
		    socket.on("friend disconnected",function(data){
				var contains = false;
				console.log(data);
				if($scope.online.length>0){
					for(var i=0;i<$scope.online.length;i++){
						
					}

					if(contains===false){
						$scope.online.push(data);
					}
				}
				else{
					$scope.online.push(data);
				}
			});

			//check_online();
		}
		else{

		}	
		
       /*if(authService.isLoggedIn()){ 
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
       }*/
    }
    
    /*$interval(function(){
        if(is_checking==false){
           check_online(); 
        }
    },3600000);*/
    
	
	$scope.showProfile = function(uid){
		$state.go("user", {id: uid});
	}
	
}]);