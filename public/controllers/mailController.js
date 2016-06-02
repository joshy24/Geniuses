myApp.controller('mailController', ['$scope', '$state', 'service', 'responseReview', 'authService', function($scope, $state, service, responseReview, authService){
    $scope.subject = "";
    $scope.name = "";
    $scope.email = "";
    $scope.message = "";
    $scope.is_error = true;
    $scope.success_message = "";
    $scope.error_message = "";
    
    if(authService.isLoggedIn()){
            var user = authService.getUser();
            $scope.name = user.firstname +" " +user.lastname;
            $scope.email = user.email;
        }
        else{

        }
    
     $scope.$on('current_user',function(){
        if(authService.isLoggedIn()){
            var user = authService.getUser();
            $scope.name = user.firstname +" " +user.lastname;
            $scope.email = user.email;
        }
        else{

        }
    });
    
    $scope.closeMessage = function(){
         var user = authService.getUser();
            $scope.name = user.firstname +" " +user.lastname;
            $scope.email = user.email;
			$scope.subject = "";
			$scope.message = "";
			$scope.is_error = true;
			$scope.success_message = "";
			$scope.error_message = "";
    }
    
    $scope.sendMessage = function(){
        if($scope.message.trim().length>0&&$scope.subject.trim().length>0){
            service.setEmail($scope.message, $scope.subject, $scope.name);
            service.send().then(function(response){
                if(responseReview.check(response.data)){
                    if(response.data.data==true){
                        $scope.is_error = false;
						$scope.subject = "";
						$scope.message = "";
                        $scope.success_message = "Thank you for your message we will reply shortly.";
                    }
                    else{
                        $scope.is_error = true;
                        $scope.error_message = "your message could not be sent at this moment...please try again later.";
                    }
                }
            }, function(error){
                $scope.is_error = true;
                $scope.error_message = "your message could not be sent at this moment...please try again later.";
            });
        }
        else{
            $scope.is_error = true;
            $scope.error_message = "please enter a subject and message.";
        }
    }
}]);