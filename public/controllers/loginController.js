myApp.controller('LoginController', ['$scope', '$rootScope', '$http', '$state', 'currentUser', 'login', 'service', 'responseReview', 'authService', function($scope, $http, $rootScope, $state, currentUser, login, service, responseReview, authService) {
    
    if(authService.isLoggedIn()){
         $state.go("home");
    }    
    else{
        //stay in logged in
    }

    $('.horizontal-menu').hide();
    $('.spinner-div').hide();
    $('.imgpanel').hide();
    
    $scope.error = false;
    var new_fbuser_id = 0;
    $scope.unknown_error = false;
    $scope.age_error = false;
    
    $('#fb-signin-request-modal').on('hide.bs.modal', function (){
        window.location.assign(window.location.href);
    });
    
    $scope.FBlogin = function(){
            $('.spinner-div').show();
     FB.getLoginStatus(function(response) {
         
        if (response.status === 'connected') {
          // Logged into your app and Facebook.
          accessWithFacebook();
        } else if (response.status === 'not_authorized') {
            FB.login(function(response){  
              if(response.authResponse){
                 accessWithFacebook(); 
              }
              else{
                $('#fb-signin-request-modal').modal('show');
              }
            });
        } else { 
            FB.login(function(response){  
              if(response.authResponse){
                 accessWithFacebook(); 
              }
              else{
                 $('#fb-signin-request-modal').modal('show');
              }
            });
        }
         
     });  
        
    }

var accessWithFacebook = function(){
    FB.api(
        "me?fields=age_range,first_name,last_name,gender,picture.type(large),id,email",
        function (response) {
            
          if (response && !response.error){
            var id = response.id;   
              
            $scope.fn = (isAlive(response.first_name)) ? response.first_name : "";
            $scope.ln = (isAlive(response.last_name)) ? response.last_name : "";
            $scope.age_range = parseInt(response.age_range.min);
            $scope.gender = (isAlive(response.gender)) ? response.gender : "";
            $scope.pic_url = "https://graph.facebook.com/"+id+"/picture?type=large";
            $scope.email = (isAlive(response.email)) ? response.email : ""; 
              
            if(id==null||id==undefined||isAlive($scope.age_range)==false){
                //show error message
            }  
            else{
               login.getFBUserSignedIn(id,  $scope.fn,  $scope.ln,  $scope.age_range,  $scope.gender,  $scope.pic_url, $scope.email);
               login.send().then(function(response){
                   if(response.data){
                        switch(response.data.status){
                                case "OK":
                                authService.setAt(response.data.at);
                                authService.setRt(response.data.rt);  

                                $('#signin-modal').modal('hide'); 

                                try{   
                                    var user = authService.getUser();
                                }
                                catch(ex){
                                    authService.logOut();
                                }

                                if(user!==undefined&&user!=null){
                                    $scope.send(user.picture_url);
                                              
                                    $('.imgpanel').show();

                                    $('.horizontal-menu').show();

                                    $state.go("home");
                                } 
                                else{
                                    localStorage.clear();
                                }
                                break;
                                case "U":
                                //show FB sign up modal for user to complete process
                                new_fbuser_id = response.data.data;
                                $('#fb-signup-modal').modal('show');
                                break; 
                                case "IA":
                                $scope.unknown_error = false;
                                $scope.age_error = true;
                                showError();
                                break;
                                case false:
                                $scope.unknown_error = true;
                                $scope.age_error = false;
                                showError();
                                break;
                        }
                   }
                   else{
                       $scope.unknown_error = true;
                       $scope.age_error = false;
                       showError();
                   }
               }, function(error){
                   $scope.unknown_error = true;
                   $scope.age_error = false;
                   showError();
               });
            }  
          }
          else{
            FB.login(function(response){  
              if(response.authResponse){
                 accessWithFacebook(); 
              }
              else{
                $('#fb-signin-request-modal').modal('show');
              }
            });
          }
        }
        );
}   
  
  var showError = function(){
       $('#fb-signup-modal').modal('hide');
       $('#message-modal').modal('show');
  }    
    
  
  $scope.submitDetails = function(){
      $scope.user_error=false;
      console.log("department - "+$scope.signup.school);
      if(new_fbuser_id>0&&new_fbuser_id!=null){
          if(isAlive($scope.signup.username)&&isAlive($scope.signup.class)&&isAlive($scope.signup.school)&&isAliive($scope.signup.department)){
                  login.setFBUserDetailsUpdate($scope.signup.username, new_fbuser_id, $scope.signup.class, $scope.signup.school, $scope.signup.department);
                  login.send().then(function(response){
                      
                      if(response.data.status=="OK"){
                          authService.setAt(response.data.at);
                          authService.setRt(response.data.rt);  

                          $('#fb-signup-modal').modal('hide'); 

                          try{   
                             var user = authService.getUser();
                          }
                          catch(ex){
                             authService.logOut();
                          }

                          if(user!==undefined&&user!=null){
                             $scope.send(user.picture_url);

                             $('.imgpanel').show();

                             $('.horizontal-menu').show();

                             $state.go("home");
                          } 
                          else{
                             localStorage.clear();
                          }                       
                      }
                      else if(response.data.status=="U"){
                          $scope.user_error = true;
                      }
                      else if(response.data.status==false){
                           $scope.unknown_error = true;
                           $scope.age_error = false;
                           showError();
                      }
                      else{
                           $scope.unknown_error = true;
                           $scope.age_error = false;
                           showError();
                      }
                  }, function(error){
                        $scope.unknown_error = true;
                        $scope.age_error = false;
                        showError();
                  });
          }
      }
      else{
          $scope.unknown_error = true;
          $scope.age_error = false;
          showError();
      }
  }
    
  $scope.signup = {
      username : undefined,
      school: undefined,
      class : undefined,
      department: undefined
  }    
  
  $scope.signin = {
     email : undefined,
     password : undefined
  }
  
  $scope.setUserClass = function(uclass){
      $scope.signup.class = uclass;
  }
  
  $scope.setUserDepartment = function(dep){
      $scope.signup.department = dep;
  }
  
  $scope.studentsignup = function(){
   
      var data = {
          username : $scope.signup.username,
          firstname : $scope.signup.firstname,
          lastname : $scope.signup.lastname,
          password : $scope.signup.password,
          repassword : $scope.signup.repassword,
          email : $scope.signup.email,
          skul : $scope.signup.school,
          klas : $scope.signup.class
      }
                   if(isEmpty(data.username)||isEmpty(data.email)||isEmpty(data.firstname)||isEmpty(data.lastname)||isEmpty(data.password)||isEmpty(data.repassword)){
            
                showSignUp("Complete All fields appropriately");       
                     
      }
      else{
      
          if(data.password == data.repassword){
              
              login.make(data,"endpoints/signup.php");
              //if all clear we attempt to post
              login.send().then(function(response){
                  
                if(response.status==200){
                    
                    if(response.data.status==200&&response.data.data=="OK"){
                        $('#signup-modal').modal('hide');  
                        $('#success-signup-modal').modal('show');
                    }
                    else if(response.data.status==401){
                        if(response.data.data=="E"){
                           showSignUp("a user with that email address exists.");
                        }
                        if(response.data.data=="U"){
                           showSignUp("a user with that username exists.");
                        }
                    }
                    else{
                        showSignUp("An Error occurred while attempting to sign you up. please try again later.");
                    }
                }  
                   
              },function(error){
                   showSignUp("An Error occurred while attempting to sign you up. please try again later.");
              });
          }
          else{
              showSignUp("please make sure the passwords you entered match each other.");
          }
      }
      
  }
  
  $scope.send = function(dat){
      currentUser.sendData(dat);
  };
  
  $scope.studentsignin = function(){
      var data= {
          namemail : $scope.signin.email,
          password : $scope.signin.password
      }
      
      showSignIn("");
      
      if(isEmpty(data.namemail)||isEmpty(data.password)){
            showSignIn("Complete All fields appropriately");
            //return error messsage
      }
      else{
          
          login.make(data, "endpoints/login.php");
          
          login.send().then(function(response){
              
              if(response.status==200){
                  
                  if(response.data.status == "OK"){
                     
                     authService.setAt(response.data.at);
                     authService.setRt(response.data.rt);  
                     
                     $('#signin-modal').modal('hide'); 
                       
                      try{   
                          var user = authService.getUser();
                      }
                      catch(ex){
                          authService.logOut();
                      }
                      
                      if(user!==undefined&&user!=null){
                          $scope.send(user.picture_url);
                          
                          $('.imgpanel').show();
                          
                          $('.horizontal-menu').show();
                          
                          $state.go("home");
                      } 
                      else{
                         localStorage.clear();
                      }
                  }
                  else if(response.data.status=="INV"){
                     showSignIn("The password you entered does not match your email address/username.");
                  }
                  else if(response.data.status=="EMP"){
                     showSignIn("Please enter a valid username/email address and password.");
                  }
                  else if(response.data.status=="ERR"){
                     showSignIn("An error occurred while attempting to sign you in. please try again later or sign in with facebook.");
                  }
                  else{
                      
                  }
              }
          },function(error){
              showSignIn("An error occurred while attempting to sign you in. please try again later or sign in with facebook.");
          });
                
      }
      
  }
  
  $scope.gotoLLH = function(){
      window.location = "http://www.geniusesng.com";
  }
  
  var showSignUp = function(msg){
      $scope.signup_message = msg;
  }
  
  $scope.showsignUp = function(){
       showSignUp("");
       $('#signup-modal').modal('show'); 
  }
  
  var showSignIn = function(msg){
      $scope.signin_message = msg;
  }
  
  $scope.showsignIn = function(){
      showSignIn("");
      $('#signin-modal').modal('show'); 
  }
    
  function isEmpty(str) {
    return (!str || 0 === str.length);
  }
    
  var isAlive = function(avar){
          if(avar!=false&&avar!=undefined&&avar!=null&&avar!=""){
              return true;
          }
          else{
              return false;
          }
      
  }
  
}]);


