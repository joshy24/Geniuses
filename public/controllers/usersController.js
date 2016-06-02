myApp.controller('usersController', ['$scope', 'service', 'responseReview', 'authService', function($scope, service, responseReview, authService){
    
  $scope.isLoggedIn = false;    
    
  if(authService.isLoggedIn()){
      $scope.isLoggedIn = true;
  }    
   
    
  $scope.$on('current_user',function(){
        if(authService.isLoggedIn()){
             $scope.isLoggedIn = true;
        }
        else{

        }
  });    
    
  $scope.selected_user = {
      user_id : 0,
      firstname : "",
      lastname : "",
      picture : "",
      username : "",
      school : "",
      aclass : "",
      department: ""
  }
  
  $scope.message = "";
  
  $scope.clearData = function(){
      $scope.message = "";
      $scope.users = null;
  }
  
  $scope.closeModal = function(){
      $('#findModal').modal('hide');
  }
  
  var attemptedrequest = {
      to_id: null,
      response : null
  }
  
  $scope.users = null;    
    
  $scope.count = 0;
    
  $scope.name = "";
    
  $scope.requestmsg = ""; 
  $scope.sentmsg = "";    
  
  $scope.data = {
      firstname : undefined,
      lastname : undefined, 
      offset : $scope.count
  }
      
  $scope.getUsers = function(){
     if(authService.isLoggedIn()){
        if($scope.name.length>0){
            var name = $scope.name;
            name = name.split(" ");
            if(name.length==2){
                $scope.data.firstname = name[0];
                $scope.data.lastname = name[1];
                doGet();
            }

            if(name.length==1){
                $scope.data.firstname = name[0];
                $scope.data.lastname = "";
                doGet();
            }

            if(name==null||name.length==0){
                $scope.data.firstname = "";
                $scope.data.lastname = "";
            }

        } 
     }
     else{
         $scope.message="Please Signup/Login";
     }
  }
  
  
  var doGet = function(){
      if(service.setGetUsers($scope.data.firstname, $scope.data.lastname, $scope.data.offset)){
      service.send().then(function(response){
          if(responseReview.check(response.data)){
            if(response.data.data){
                 $scope.users = response.data.data;
                 $scope.count+=10;
            }
            else{

            }
          }
                    
      }, function(error){
             console.log(error);
      });
      }
  }
    
}]);