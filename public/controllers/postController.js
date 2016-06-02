myApp.controller('postController',['$scope','$http','$q','$stateParams', '$state', 'responseReview', 'externalpost', 'service', 'authService', function($scope, $http, $q,$stateParams,$state,responseReview,externalpost,service,authService){
    
    $scope.pid = $stateParams.pid;
    $scope.loggedIn = false;
    $scope.loaded = false;
   
    var send = function(data, url){
     var deferred = $q.defer();
       
       $http.post(url, data).then(
           function successCallback(response){
              deferred.resolve(response);
              
           },
           function errorCallback(){
              deferred.reject(false);
           }
       );
      
       return deferred.promise;
    }
    
    if($scope.pid>0&&$scope.pid!=undefined&&$scope.pid!=null){
        if(authService.isLoggedIn()){
            //sending thru logged in service
            $scope.loggedIn = true;
            
            service.setPost($scope.pid);
            service.send().then(function(response){
                if(responseReview.check(response.data)){
                    if(response.data.data!=false){
                        $scope.post = response.data.data;
                        $scope.loaded = true;
                    }
                    else{
                        
                    }
                }
            }, function(error){
                $scope.loaded = false;
            });
        }
        else{
            $scope.loggedIn = false;
            //sending thru non-logged in service
            var data = {
                post_id: $scope.pid
            }

            var url = "endpoints/post.php";

            send(data, url).then(function(response){
                
                if(response.data.post!=false){
                    $scope.post = response.data.post;
                    
                    console.log($scope.post);
                    
                    externalpost.sendData($scope.post);
                }
                else{
                        
                }
                $scope.loaded = true;
                
            }, function(error){
                $scope.loaded = false;
            });
        }   
    }
    else{
        console.log("out");
        $state.go("home");
    }
    
}]);