var myApp = angular.module('geniuses', ['ui.router','timer']);
    
window.fbAsyncInit = function() {
	FB.init({
	  appId      : '1152198031480823',
	  xfbml      : true,
	  version    : 'v2.5'
	});
};


(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.6&appId=1152198031480823";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


myApp.config(['$stateProvider','$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider){
    
    $urlRouterProvider.otherwise("/home"); 
    
    $stateProvider
    .state("login", {
        url: "/",
        controller: "LoginController",
        templateUrl: "templates/login.html",
        authenticated:false
    })
    .state("home", {
        url: "/home",
        controller: "TimelineController",
        templateUrl: "templates/timeline.html",
        authenticated:true
    })
     .state("loginerror", {
        url: "/loginerror",
        controller: "LoginController",
        templateUrl: "templates/error.html",
        authenticated:true
    })
    .state("profile", {
        url: "/profile",
        controller: "ProfileController",
        templateUrl: "templates/profile.html",
        authenticated:true
    })
    .state("friends", {
        url: "/friends",
        controller: "friendsController",
        templateUrl: "templates/friends.html",
        authenticated:true
    })
    .state("user", {
        url: "/user",
        controller: "userProfileController",
        templateUrl: "templates/user.html",
        params: {id: null},
        authenticated:true
    })
    .state("examparameters", {
        url: "/examparameters",
        controller: "examParameterController",
        templateUrl: "templates/examParameters.html",
        authenticated:true
    })
    .state("exam", {
        url: "/exam",
        controller: "examController",
        templateUrl: "templates/exam.html",
        params: {exam: null},
        authenticated:true
    })
    .state("result", {
        url: "/result",
        controller: "resultController",
        templateUrl: "templates/examresult.html",
        params: {result: null},
        authenticated:true
    })
    .state("post", {
        url: "/post/:pid",
        controller: "postController",
        templateUrl: "templates/post.html",
        authenticated:false
    })
    .state("terms", {
        url: "/terms",
        controller: "termsController",
        templateUrl: "templates/terms.html",
        authenticated:false
    })
	
	$locationProvider.html5Mode(true);
}]);


myApp.run(['$rootScope', '$state', '$location', "authService", function($rootScope, $state, $location, authService){
    $rootScope.$on('$stateChangeStart', function(event,toState, toParams, fromState, fromParams){   
  
      if(authService.isLoggedIn()){
         
      }
      else{
          if(toState.authenticated===true){
             event.preventDefault();
             return $state.go('login');
          }
      }
      
    });
}]);

myApp.controller('termsController', ['$scope','$state','authService', function($scope, $state, authService){
    
    $scope.isLoggedIn = authService.isLoggedIn();
    
    $('.spinner-div').hide();
    $('.horizontal-menu').hide();
    $scope.goLogin = function(){
        $state.go("login");
    }
}]);

myApp.controller('postController',['$scope','$stateParams','externalpost','getExternalPost','authService', function($scope,$stateParams,externalpost,getExternalPost,authService){
   
    if(authService.isLoggedIn()){
         $scope.loggedIn = true;
    }
    else{
         $scope.loggedIn = false;
    }
    
    var pid = $stateParams.pid;
    
    getExternalPost.getPost(pid);
}]);

myApp.controller('LoginController', ['$q','$scope', '$rootScope', '$http', '$state', 'currentUser', 'login', 'service', 'showAbout', 'responseReview', 'getSchools', 'authService', 'service', function($q, $scope, $rootScope, $http, $state, currentUser, login, service, showAbout, responseReview, getSchools, authService, service) {
    
    if(authService.isLoggedIn()){
         $state.go("home");
    }    

    $scope.showQuickAbout = function(){
        showAbout.showAbout();
    }
    
    $('.horizontal-menu').hide();
    $('.spinner-div').hide();
    $('.imgpanel').hide();
    
    $scope.error = false;
    var new_fbuser_id = 0;
    $scope.unknown_error = false;
    $scope.age_error = false;
    
    
    getSchools.getSchoolsHttp("endpoints/schools.php").then(function(response){
        var result = response.data.schools;
        $scope.schools = result.sort();
        
    }, function(error){
    });
    
	$scope.setSchoolMail = function(skul){
		$scope.signupmail.school = $scope.schools[skul];
	}
	
    $scope.setSchool = function(skul){
        $scope.signup.school = $scope.schools[skul];
    }
    
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
              
            if(id==null||id==undefined||isAlive($scope.age_range)===false){
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
	  
      if(new_fbuser_id>0&&new_fbuser_id!=null){
          if(isAlive($scope.signup.username)&&isAlive($scope.signup.class)&&isAlive($scope.signup.school)&&isAlive($scope.signup.department)&&isAlive($scope.signup.phone)){
			  
                  login.setFBUserDetailsUpdate($scope.signup.username, new_fbuser_id, $scope.signup.class, $scope.signup.school, $scope.signup.department, $scope.signup.phone);
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
                              
                             $rootScope.isnew = true;  
                                 
                          } 
                          else{
                             localStorage.clear();
                          }                       
                      }
                      else if(response.data.status=="U"){
                          $scope.user_error = true;
                      }
                      else if(response.data.status===false){
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
      department: undefined,
	  phone: undefined
  }   
  
   $scope.signupmail = {
      username : undefined,
      school: undefined,
      class : undefined,
      department: undefined,
	  password: undefined,
	  repassword: undefined,
	  email: undefined,
	  school: undefined,
	  phone : undefined
  } 
  
  $scope.signin = {
     email : undefined,
     password : undefined
  }
  
  $scope.setUserClass = function(uclass){
      $scope.signupmail.class = uclass;
	  $scope.signup.class = uclass;
  }
  
  $scope.setUserDepartment = function(dep){
      $scope.signup.department = dep;
  }
  
  $scope.studentsignup = function(){
   
      var data = {
          username : $scope.signupmail.username,
          firstname : $scope.signupmail.firstname,
          lastname : $scope.signupmail.lastname,
          password : $scope.signupmail.password,
          repassword : $scope.signupmail.repassword,
		  department: $scope.signupmail.department,
          email : $scope.signupmail.email,
          skul : $scope.signupmail.school,
          klas : $scope.signupmail.class,
		  phone: $scope.signupmail.phone
      }
                   				if(isEmpty(data.username)||isEmpty(data.email)||isEmpty(data.firstname)||isEmpty(data.lastname)||isEmpty(data.password)||isEmpty(data.repassword)){
                showSignUp("Complete All fields appropriately");       
      }
      else{
      
          if(data.password == data.repassword&&data.phone.length>=11){
              
              login.make(data,"endpoints/signup.php");
              //if all clear we attempt to post
              login.send().then(function(response){
                if(response.status==200){
                    console.log(response.data);
                    if(response.data.status==200&&response.data.data=="OK"){
                        $('#signup-modal').modal('hide');  
                        $('#success-signup-modal').modal('show');
                    }
					else if(response.data.status==200&&response.data.data=="EE"){
						showSignUp("We could not send you a mail a this moment. please make sure the email address is in use and is working.");
					}
                    else if(response.data.status==401){
                        if(response.data.data=="E"){
                           showSignUp("a user with that email address exists.");
                        }
                        if(response.data.data=="U"){
                           showSignUp("a user with that username exists.");
                        }
						if(response.data.data=="P"){
                           showSignUp("a user with that phone number exists.");
                        }
						if(response.data.data=="IE"){
						   showSignUp("Please enter a valid email address to continue.");	
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
              showSignUp("please make sure the passwords you entered match each other and that you have entered a valid phone number.");
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
                          
						  /*var data = {
							 user_id: authService.getUser().id,
							 type: "S"
						  }*/
						  
						  //io.connect("localhost:3000/", { query: data });
						  
                          $state.go("home"); 
                          
						  if(response.data.data===true){
							  $rootScope.isnew = true; 
						  }
						  else{
							  $rootScope.isnew = false;
						  }
						  
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
				  else if(response.data.status=="ACT"){
					 showSignIn("We see you have signed up. A mail was sent to the email you provided us, Please follow the link in the mail.");
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
          if(avar!==false&&avar!=undefined&&avar!=null&&avar!=""){
              return true;
          }
          else{
              return false;
          }
  }
  
}]);

myApp.service('showAbout', [function(){
    this.showAbout = function(){
        
         window.location.href = "https://www.geniusesafrica.com/quickabout.html";
    }
}]);

myApp.controller('newusercontroller', ['$scope', 'service', 'getSchools','setUserRequest', 'responseReview', 'textInterval', 'authService', function($scope, service, getSchools, setUserRequest, responseReview, textInterval, authService){
    $scope.searchparamater = "school";
    $scope.name = '';
    $scope.school = "";
    $scope.content = false;
    
    var network = false;
    
    $scope.count = 0;
    $scope.limit = 50;
    
    $scope.selected_user_ids = [];
    
    $scope.user_name = authService.getUser().firstname;
    
    $scope.data = {
      firstname : undefined,
      lastname : undefined, 
      offset : $scope.count
    }
    $scope.value_entered = null;
    
    $('.timed-text').hide();
    
    if(authService.isLoggedIn()){
        service.setSchools();
        service.send().then(function(response){
            if(responseReview.check(response.data)){
                 var result = response.data.data;
                 $scope.schools = result.sort();
            }
        }, function(error){
            
        })
    }
    
    $scope.setSchool = function(index){
        $scope.value_entered = $scope.schools[index];
    }
    
    $scope.setSearchParameter = function(param){
        $scope.searchparamater = param;
    }
    
    $scope.searchforSchoolorName = function(){
       if($scope.value_entered!=null&&network===false){ 
           
            if($scope.searchparamater=="school"){
                if($scope.value_entered.length>0){
                    $scope.school = $scope.value_entered;
                    doGetSchool();
                }
            }
            if($scope.searchparamater=="name"){
               if($scope.value_entered.length>0){ 
                    var name = $scope.value_entered;
                    name = name.split(" ");
                    if(name.length==2){
                        $scope.data.firstname = name[0];
                        $scope.data.lastname = name[1];
                        doGetName();
                    }

                    if(name.length==1){
                        $scope.data.firstname = name[0];
                        $scope.data.lastname = "";
                        doGetName();
                    }

                    if(name==null||name.length==0){
                        $scope.data.firstname = "";
                        $scope.data.lastname = "";
                    }
               }

            }
       }
    }
    
    
    var doGetSchool = function(){
      service.setSearchSchools($scope.school, $scope.limit)
      service.send().then(function(response){
          if(responseReview.check(response.data)){
            if(response.data.data){
                 $scope.content = true;
                 $scope.users = response.data.data;
                 $scope.limit+=50;
            }
            else{
                $scope.content = false;
            }
          }
                    
      }, function(error){
            
      });
    }
    
    
    var doGetName = function(){
      $scope.data.offset = $scope.count;
        
      if(service.setGetUsers($scope.data.firstname, $scope.data.lastname, $scope.data.offset)){
      service.send().then(function(response){
         
          if(responseReview.check(response.data)){
            if(response.data.data){
                 $scope.content = true;
                 $scope.users = response.data.data;
                 $scope.count+=50;
            }
            else{
                $scope.content = false;
            }
          }
                    
      }, function(error){
            
      });
      }
    }
    
    $scope.sendBatchRequests = function(){
        if(!$.isEmptyObject($scope.selected_user_ids)&&network===false){
			network=true;
            var req_ids = $scope.selected_user_ids;
            service.setBatchRequest(req_ids);
            service.send().then(function(response){
               
                if(response.data.data===true){
                    resetParameters();
                    textInterval.showText();
                }
                
                if(responseReview.check(response.data)){
                    
                }
                network = false;
            },function(error){
                network = false;
            })
        }
    }
    
    $scope.$on('user-request', function(){
        var an_id = setUserRequest.getRequest();
        if(aContainsB($scope.selected_user_ids, an_id)){
            $scope.selected_user_ids = $scope.selected_user_ids.splice(0,$scope.selected_user_ids.indexOf(an_id));
        }
        else{
            $scope.selected_user_ids.push(an_id);
        }
    });
    
    function aContainsB(a, b) {
         return a.indexOf(b) >= 0;
    }
    
    var resetParameters = function(){
        $scope.name = '';
        $scope.school = "";
        $scope.content = false;

        network = false;

        $scope.count = 0;
        $scope.limit = 50;

        $scope.selected_user_ids = [];

        $scope.data = {
          firstname : undefined,
          lastname : undefined, 
          offset : $scope.count
        }
        $scope.value_entered = null;
    }
    
}]);


myApp.service('getSchools',['$q', '$http', function($q, $http){
     this.getSchoolsHttp = function(ur){
        
       data = {
            method: "getSchools"
       }    
       
       var aurl = ur;
           
       var deferred = $q.defer();
       $('.spinner-div').show();
       $http.post(aurl, data).then(
           function successCallback(response){
              deferred.resolve(response);
               $('.spinner-div').fadeOut();
           },
           function errorCallback(){
              deferred.reject(false);
               $('.spinner-div').fadeOut();
           }
       );
      
       return deferred.promise;
    }
}])

myApp.factory('setUserRequest',['$rootScope', function($rootScope){
  var service = {};
  service.request = false;   
    
  service.sendData = function(dat){
      this.request= dat;
      $rootScope.$broadcast('user-request');
  };
  service.getRequest = function(){
    return this.request;
  };
  
  return service;
}]);


myApp.factory('textInterval',['$interval', function($interval){
  var service = {};
 
    service.showText = function(){
        
        $('.timed-text').fadeIn();
        
        $interval(function(){
            $('.timed-text').fadeOut();
            $interval.cancel();
        },4000);
        
    }    
    
  return service;
}]);