myApp.directive('receivedRequest', ['service', 'responseReview', function(service, responseReview){
    
    return{
        restrict: "AE",
        scope: {
            userinfo: "=",
            show: "&",
            showprofile: "&",
            remove: "&"
        },
        controller: ['$scope', '$element', function($scope, $element){  
           if($scope.userinfo.picture_url==""||$scope.userinfo.picture_url==undefined||$scope.userinfo.picture_url==null){
               $scope.user_picture = "img/default.png";
           }
           else{
               $scope.user_picture = $scope.userinfo.picture_url;
           }
            
           $scope.decline = function(){
               var request_id = $scope.userinfo.request_id;
               var action = 'D';
               
               if(service.setReplyRequest(request_id, action)){
                   service.send().then(function(response){
                
                   if(responseReview.check(response.data)){    
                         if(response.data.data==null){
                             var msg = "Ooops!!...your response was not delivered successfully."; 

                             $scope.show({msg: msg}); 
                         }
                         if(response.data.data=="D"){
                             var msg = "you declined " +$scope.userinfo.firstname +" " +$scope.userinfo.lastname+"'s request to be friends";   
							 $scope.remove({req: $scope.userinfo});
							 
                             $scope.show({msg: msg, status: "D"});

                             $element.remove();
                             $scope.$destroy();
                         }
                   }
                       
                   }, function(error){

                   });
               }
           }
           
           $scope.accept = function(){
               var request_id = $scope.userinfo.request_id;
               var action = 'A';

               if(service.setReplyRequest(request_id, action)){
                   service.send().then(function(response){
                   if(responseReview.check(response.data)){
                         if(response.data.data==null){
                             var msg = "Ooops!!...your response was not delivered successfully."; 

                             $scope.show({msg: msg});
                         }
                         if(response.data.data==true){
                             //var areq = $scope.userinfo;
                             var msg = "you and " +$scope.userinfo.firstname +" " +$scope.userinfo.lastname+" are now friends";   

                             $scope.remove({req: $scope.userinfo});
                             
                             $scope.show({msg: msg, status: "A"});
                             
                             $element.remove();
                             $scope.$destroy();
                         }
                         if(response.data.data=="F"){
                             var msg = "You and " +$scope.userinfo.firstname +" " +$scope.userinfo.lastname+" are friends";  
                             $scope.show({msg: msg});
                         }
                   }

                   }, function(error){

                   });
               }
               
           }
           
           $scope.showProfile = function(){
              $scope.showprofile({id: $scope.userinfo.id});
           }
           
        }],
        templateUrl: "templates/receivedrequests.html",
        link: function(scope, element, attrs){
            
             scope.$watch("userinfo", function(){
                 $('.accepted-div').hide();   
                 $('.founduser').show();   
                 scope.msg = "";
             });
            
        } 
    }
    
}]);