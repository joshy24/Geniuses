myApp.controller('friendsController', ['$scope', '$state', 'service', 'requestsService', 'responseReview', 'authService', function($scope, $state, service, requestsService, responseReview, authService){
    $scope.friends=[];
    
    $('#spinner-div').hide();
    
    $scope.offset = 0;
    
    $scope.received=null;
    $scope.message = null;
    
    $scope.search_param = "";
    
    $scope.showMsg = function(msg, status){
        $scope.message = msg;
        
        if(status=="A"){
            getAllFriends();
        }
    }
    
    $scope.showProfile = function(id){
        $('#requestsModal').modal("hide");
        
        $state.go('user', {id: id});
    }
    
    $scope.remove = function(req){
        if($scope.received.length==1){   
            requestsService.sendData(false);
        }
        if($scope.received.length>1){
            var new_req = $scope.received.splice($scope.received.indexOf(req),1);
                             
            requestsService.sendData(new_req);
        }
    }
    
    function pullFriends(){
        if(service.setFriends($scope.offset)){
            service.send().then(function(response){
                if(responseReview.check(response.data)==true){
                    if(response.data.data!=null&&response.data.data!=false){
                        if($scope.friends.length>0){
                            $scope.friends.push(response.data.data);
                            $scope.offset+=20;   
                        }else{
                            $scope.friends = response.data.data;
                            $scope.offset+=20;   
                        }
                    }
                }

                 }, function(error){
                    $scope.err_message = "Oooops...your friends could not be retreived at this time. please try again later.";
                    $('#messageModal').modal('show');
                 });;
        }        
    }
    
    var getAllFriends = function(){
        if($scope.offset==$scope.friends.length){
             pullFriends()           
        }
    }
    
	var getFriendRequests = function(){
		if(service.setRequests()){
            service.send().then(function(response){
                    
            if(responseReview.check(response.data)){
                
                 if(response.data.data!=null){
                     $scope.sent = response.data.data;
                 }
                 if(response.data.data1!=null){
                     $scope.received = response.data.data1;
                     $('#requestsModal').modal("show");
                 }
            }
            else{

            }

          }, function(error){
				
          });     
       }    
	}
	
    if(authService.isLoggedIn()){
        getAllFriends();
    }
    else{
        authService.logOut();
    }
    
    $scope.getFriendRequests = function(){
       if(service.setRequests()){
            service.send().then(function(response){
                    
            if(responseReview.check(response.data)){
                
                 if(response.data.data!=null){
                     $scope.sent = response.data.data;
                 }
                 if(response.data.data1!=null){
                     $scope.received = response.data.data1;
                     $('#requestsModal').modal("show");
                 }
                 else{
                    $scope.message = "you dont have any friend requests.";
                    $scope.received = null;
                    $('#requestsModal').modal("show");
                 }

            }
            else{

            }

          }, function(error){
				$scope.message = "An error occurred retreiving your friend requests. Please try again later.";
                $scope.received = null;
                $('#requestsModal').modal("show");
          });     
       }    
    }
    
    $scope.searchFriends = function(){
        if($scope.friends!=null){
            if($scope.search_param.trim().length>0){
                if(($scope.offset-20)==$scope.friends.length){
                    service.setSearchFriends();   
                }
                else{
                    
                }
            }
            else{
                $scope.err_message = "Please enter a school, class or name.";
                $('#messageModal').modal('show');
            }
        }
        else{
            $scope.err_message = "you dont have any friend's yet. you can search for other students on Geniuses by clicking on the find user button on the grey bar above.";
            $('#messageModal').modal('show');
        }
    }
		
	getFriendRequests();

}]);