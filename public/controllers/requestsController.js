myApp.controller('requestsController', ['$scope', 'service', 'responseReview', 'authService', function($scope, service, responseReview, authService){
    $scope.sent=null;
    $scope.received=null;
    $scope.sentmsg = null;    
    
    /* $scope.removeRequest = function(req){
        var index = $scope.received.indexOf(req);
        
        if(index>-1){
           $scope.received.splice(index, 1);
        }
    }*/
    
    
    $scope.showMessage = function(msg){
        $scope.sentmsg = msg;
        $('#msgModal').modal('show');
    }    
    
    
    if(authService.isLoggedIn()){
        if(service.setRequests()){
            service.send().then(function(response){

            if(responseReview.check(response.data)){
                 if(response.data.data!=null){
                     $scope.sent = response.data.data;
                 }
                 if(response.data.data1!=null){
                     $scope.received = response.data.data1;

                 }
                 else{
                    $scope.received = null; 
                    $scope.message = "you dont have any friend requests.";
                 }

            }
            else{

            }
                    
      }, function(error){
             
      });  
     }
    }
    
}]);