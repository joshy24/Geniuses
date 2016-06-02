myApp.controller('userProfileController', ['$scope', '$state', '$stateParams', 'service', 'responseReview', 'authService', function($scope, $state, $stateParams, service, responseReview, authService){
    $scope.user_id = null;
    $scope.user = null;
    $scope.information=null;
    $scope.performAction= null;
    $scope.sentmsg = null;    
    $scope.respond=false;
    $('#user-action').hide();
    $('#edit-profile').hide();
    $('.horizontal-menu').show();
    
    $scope.showFriends = function(){
        
        if($scope.id!==undefined){
            $('#msgModal').modal('hide');
            $state.go('friends');
        }
    }
	
    if(authService.isLoggedIn()){
        
        $scope.id = $stateParams.id;
          
        if($scope.id!=null&&$scope.id>0){
            if(service.setUser($scope.id, "S")){
                service.send().then(function(response){
                    
                  if(responseReview.check(response.data)){    
                    
                    $scope.user = response.data.data;
                      
					if($scope.user.picture_url==""||$scope.user.picture_url==null){
						$scope.user_picture = "img/default.png"; 
					}
					else{
						$scope.user_picture = $scope.user.picture_url; 
					}  
					  
                    if($scope.id==authService.getUser().id){
                        $('#edit-profile').show();
                        $scope.information = "Edit My Profile";
                        $scope.performAction = function(){
                            $state.go('profile');
                        }
                    }
                    else{
                        if(response.data.data1==true){
                            $scope.friend_information = $scope.user.firstname +" is your friend.";
                            $('#user-action').hide();
                            $('#edit-profile').hide();
                        }
                        else{
                            $('#user-action').show();
                            $scope.information = "Send Friend Request";
                            $scope.friend_information = $scope.user.firstname +" is not your friend.";
                            
                            $scope.performAction = function(){
                                
                            if(service.setSendRequest($scope.user.id, "S")){

                              service.send().then(function(response){
                                if(responseReview.check(response.data)){
                                   
                                    if(response.data.data=="BA"){
                                       $scope.sentmsg = $scope.user.firstname +" sent you a friend request.";
                                        $scope.respond=true;
                                    }
                                    if(response.data.data=="AB"){
                                       $scope.sentmsg = $scope.user.firstname+" has not responded to your friend request.";

                                    }
                                    if(response.data.data=="F"){
                                        $scope.sentmsg = "you and "+$scope.user.firstname+" are friends.";

                                    }
                                    if(response.data.data=="S"){
                                        $scope.sentmsg = "your request has been sent.";

                                    }
                                    if(response.data.data=="E"){
                                        $scope.sentmsg = "Your request was NOT sent successfully..";
                                    }
                                    
                                    $('#msgModal').modal('show');
                                }
                                else{

                                }
               
                              }, function(error){
                                   
                              });

                            }
                            else{
                                $scope.requestmsg = "Your request was NOT sent successfully..";
                                $('#msgModal').modal('show');
                            }
                                //end of sendrequest.make() function
                            }
                        }
                        
                    }
                  }
                   
                    
                }, function(error){
                    $state.go("home");
                });
            }
        }
        else{
            $state.go("home");
        }
        
    }
    else{
    
    }
}]);