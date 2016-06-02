angular.module('geniuses', ['ui.router','timer'])

.controller('TimelineController', ['$rootScope','$scope','$window','$state','storageService','responseReview', 'service', 'authService', function($rootScope, $scope, $window, $state, storageService, responseReview, service, authService){
    
    if(authService.isLoggedIn()==false){
          $state.go("login");
    }
    else{

    try{    
        
    $scope.singlepost = "";
    $scope.current_post_index = 0;    

    $('.imgpanel').show();  
        
    $('#back-to-top-btn').hide();    
        
    $('.spinner-div').hide();  
        
    $('#online-holder-div').show();
        
    $scope.addComment = function(comment, comment_info){
        
          if(isAlive($scope.posts[$scope.current_post_index].comments)){
              var arr1 = [comment];
              
              var arr3 = arr1.concat($scope.posts[$scope.current_post_index].comments);
              $scope.posts[$scope.current_post_index].comments = arr3;
              
              var arr2 = [comment_info];
              
              var arr4 = arr2.concat($scope.posts[$scope.current_post_index].comments_user_info);
              $scope.posts[$scope.current_post_index].comments_user_info = arr4;
          }
          else{
              $scope.posts[$scope.current_post_index].comments = comment;
              $scope.posts[$scope.current_post_index].comments_user_info = comment_info;
          }
        
          storageService.setStorageValue("posts", $scope.posts);
    }    
        
    $scope.showSinglePost = function(post, id){
        $scope.singlepost = post;
        $scope.current_post_index = id;
        $('#singlePostModal').modal('show');
    }    
        
    var posts_from_storage = storageService.getStorageValue("posts");
        if(posts_from_storage!=false){
             $scope.posts = posts_from_storage;
            
        }
        else{
            if($scope.posts==undefined){

              if(service.setPosts(15)){

                    service.send().then(function(response){
                      
                        if(responseReview.check(response.data)==true){
                             if(response.data.data!=false){
                                 $scope.posts = response.data.data; 
                                 storageService.setStorageValue("posts", response.data.data);
                             }
                             else{

                             }
                        }
                        else{
                             
                        }
                        
                    }, function(error){
                         if(posts_from_storage!=false){
                                $scope.posts = posts_from_storage;
                         }
                         else{
                             console.log(error);
                         }
                    });
              }
            }//end of if scope undefined
        }
          
        //show scroll to top btn
        $(window).scroll(function () {
            if ($(this).scrollTop() > 100) {
                $('#back-to-top-btn').fadeIn();
            } else {
                $('#back-to-top-btn').fadeOut();
            }
        });
        
        //do scroll to top on button click
        $('#back-to-top-btn').click(function(){
            $('html, body').animate({ scrollTop: 0 }, 'fast');
        });
    
        
        var is_checking = false;
        
        angular.element($window).bind("scroll", function() {
            var windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
            var body = document.body, html = document.documentElement;
            var docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
            var windowBottom = windowHeight + window.pageYOffset;
            
            if(is_checking == false){
            
            
            if (windowBottom >= docHeight-100) {
                is_checking = true;
                if(isAlive($scope.posts) && $scope.posts.length>1){
                      
                    var current_number = $scope.posts.length;
                   
                    if(current_number<=100&&current_number>1){
                        current_number = current_number+15;
                        
                        if(service.setPosts(current_number)){
                                
                                service.send().then(function(response){
                                    
                                    if(responseReview.check(response.data)==true){
                                        is_checking=false;
                                    
                                        if(response.data.itoken){
                                            authService.logOut();
                                        }

                                        if(response.data.data!=false){

                                            var new_posts = response.data.data;

                                            var current_posts = $scope.posts;

                                            var concatenated = current_posts.concat(new_posts);

                                            $scope.posts = concatenated;

                                            storageService.setStorageValue("posts", $scope.posts);
                                            $(".loader").fadeOut("slow");

                                        }
                                        else{

                                        }
                                    }
                                    else{

                                    }
                                
                                }, function(error){
                                    is_checking=false;
                                });

                       }//end of make post
                    }
                    else{
                        is_checking=false;
                    }
                }
                else{
                    is_checking=false;
                }
            }
                   
          }
        });
    
    
      $scope.Discussion = {
             discussion : undefined,
      }
        
      $scope.makeDiscussionPost = function(){

          if(service.setDiscussion($scope.Discussion.discussion)){
              service.send().then(function(response){
                  if(responseReview.check(response.data)){
                      if(response.data.data){
                            if($scope.posts!=undefined){
                                $scope.posts.splice(0,0,response.data.data);

                            }
                            else{
                              $scope.posts = response.data.data;

                            }
                            $scope.Discussion.discussion = "";
                      }
                  }
              }, function(error){
                  
              });
          }

      }
      
      $scope.refreshFeed = function(){
          if(service.setPosts(15)){
                    service.send().then(function(response){
                        
                       if(responseReview.check(response.data)){
                            if(response.data.data!=false){
                                $scope.posts = response.data.data; 
                                storageService.setStorageValue("posts", response.data.data);
                                $(".loader").fadeOut("slow");
                            }
                            else{

                            }
                       }
                    }, function(error){
                         
                    });
          }
      }
      
      
      var isAlive = function(avar){
          if(avar!=false&&avar!=undefined&&avar!=null&&avar!=""){
              return true;
          }
          else{
              return false;
          }
      
      }
    }
    catch(e){
        console.log(e);
    }
        
    }
      
}])

.controller('OnlineController', ['$scope','$interval','service', 'responseReview', 'authService', function($scope, $interval, service, responseReview, authService){
    
    var is_checking = false;
    
    $scope.isLoggedIn = false;
    
    if(authService.isLoggedIn()){
        $scope.isLoggedIn = true;
             check_online();
    }
    else{

    }
    
    $scope.$on('logout', function(){
        $scope.isLoggedIn = false;
        $scope.online = [];
    });
    
    $scope.$on('current_user',function(){
        if(authService.isLoggedIn()){
             $scope.isLoggedIn = true;
             check_online();
        }
        else{

        }
    });
    
    
    function check_online(){
       if(authService.isLoggedIn()){ 
            if(service.setfriendsOnline()){
                is_checking = true;
                service.send().then(function(response){
                    if(responseReview.check(response.data)){
                        $scope.online = response.data.data;
                    }
                },function(error){

                }).finally(function(){
                    is_checking = false;
                });
            }
       }
    }
    
    $interval(function(){
        if(is_checking==false){
           check_online(); 
        }
    },900000);
    
}])

.controller('mailController', ['$scope', '$state', 'service', 'responseReview', 'authService', function($scope, $state, service, responseReview, authService){
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
            service.setEmail($scope.message, $scope.subject);
            service.send().then(function(response){
                if(responseReview.check(response.data)){
                    if(response.data.data==true){
                        $scope.is_error = false;
                        $scope.success_message = "Thank you for your message we will reply shortly.";
                    }
                    else{
                        $scope.is_error = true;
                        $scope.error_message = "your message could not be sent at this moment...please try again later.";
                    }
                }
            }, function(error){
                
            });
        }
        else{
            $scope.is_error = true;
            $scope.error_message = "please enter a subject and message.";
        }
    }
}]);