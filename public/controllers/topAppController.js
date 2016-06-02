myApp.controller('TopAppController', ['$scope', '$state', 'currentUser', 'service', 'responseReview', 'requestsService', 'logout', 'authService', function($scope, $state, currentUser, service, responseReview, requestsService, logout, authService){
   
    $scope.user_name = "";
    
    $scope.loggedIn = false;
    
    if(authService.isLoggedIn()){
       var user = authService.getUser();
       
       $scope.user_name = user.firstname;
        
       $scope.loggedIn = true;    
       
       if(user.picture_url){
           $('#profileimage').attr("src", user.picture_url);
       }
       else{
           $('#profileimage').attr("src", "img/defaultwhite.png");
       }
    }
    else{
        $('#profileimage').attr("src", "img/defaultwhite.png");
    }
    
    
    
    $scope.showProfile = function(){
       if(authService.isLoggedIn()){
         if($state.current!="user"){
            var usid = authService.getUser().id;
            
            $state.go("user", {id: usid});
         }
       }
       else{
           $state.go("login");
       }
   }
   
   $scope.showAccount = function(){
       if(authService.isLoggedIn()){
         if($state.current!="profile"){
            $state.go("profile");
         }
       }
       else{
           authService.logOut();
       }
   }
   
   $scope.logOut = function(){
        if(service.setLogOut()===true){
            service.send().then(function(response){
                if(responseReview.check(response.data)){
                    
                }
            },function(error){
                
            });
        }
       
        send("logout");
       
        $('#profileimage').attr("src", "img/defaultwhite.png");
        $scope.loggedIn = false;
        $scope.user_name = "";
        $('.horizontal-menu').hide();
        localStorage.clear();
        $state.go('login');
   }
   
   var showNotifications = function(){
	   if($scope.received!=null){
		   $('#notificationsModal').modal("show");
	   }
	   else{
		  $scope.message = "you dont have any notifications at this moment";
		  $('#notificationsModal').modal("show");
	   }
   }
   
   $scope.showNotifications = function(){
        showNotifications();
   }    
    
   $scope.$on('current_user',function(){
        if(authService.isLoggedIn()==true){     
              var user = authService.getUser();
       
              getNotifications();
            
              $scope.user_name = user.firstname;
            
              $scope.loggedIn = true;
       
              var picture_url =  currentUser.getData();    
              if(picture_url!=undefined&&picture_url.length>0){
                   var img = picture_url;
                  
                   $('#profileimage').attr("src", img);
              }
        }
        else{
           $('#profileimage').attr("src", "img/defaultwhite.png");
           $scope.user_name = "";
           $scope.loggedIn = false;
           $state.go("login");
        }
   });
    
   var send = function(dat){
         logout.sendData(dat);
   }    
    
   $scope.$on('logout', function(){
       if(authService.isLoggedIn()==true){
           if(service.setLogOut()===true){
                service.send().then(function(response){
                    if(responseReview.check(response.data)){

                    }
                },function(error){

                });
           }
           
           $('.horizontal-menu').hide();
           $('#profileimage').attr("src", "img/defaultwhite.png");
           $scope.loggedIn = false;
           $scope.user_name = "";
       }   
       else{
           $state.go("login");
       }
   });   
   
   
    
   var getNotifications = function(){  
       if(authService.isLoggedIn()){
               var req = requestsService.getRequests();
           
               service.setNotofication();
               service.send().then(function(response){
                   if(response.status==200){
                       if(responseReview.check(response.data)==true){
                           if(response.data.data1!=false&&response.data.data1!=null){
                               $scope.received = response.data.data1;
							   $scope.sent = response.data.data1;
                               $scope.notification_count = response.data.data1.length;
                               adjustRequests();
							   
							   console.log($state.current.name);
							   
							   if($scope.received!=null){
								  if($state.current.name.trim()==""||$state.current.name=="home"){
									 
								   	 showNotifications();	
							   	  } 	
							   }
							   
                           }
                           else{
                               $scope.notification_count = 0;
                           }
                       }
                   }
               }, function(error){
				   
               }); 
       }
   }
   
   $scope.$on('requestschange', function(){
       
       var req = requestsService.getRequests();
       
       if(req===false||$.isEmptyObject(req)){
           $scope.received = [];
           $scope.notification_count = 0;
       }
       else{
           $scope.received = req;
           $scope.notification_count = req.length;
           adjustRequests();
       }
   });

   var adjustRequests = function(){
        for(var i=0;i<$scope.received.length;i++){
            if($scope.received[i].picture_url.trim()==""){
                $scope.received[i].picture_url = "img/default.png";
            }
        }
   }
    
   $scope.showFriendProfile = function(fid){
       $('#notificationsModal').modal("hide");
       $state.go("user", {id: fid});
   }
   
   $scope.showFriends = function(){
       $('#notificationsModal').modal("hide");
       $state.go("friends");
   }
   
   getNotifications(); 
	
}]);