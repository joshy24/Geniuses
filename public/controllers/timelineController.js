myApp.controller('TimelineController', ['$rootScope','$scope', '$interval', '$window','$state','storageService','postChange', 'responseReview', 'service', 'authService', function($rootScope, $scope, $interval, $window, $state, storageService, postChange, responseReview, service, authService){
    
    if(authService.isLoggedIn()==false){
          $state.go("login");
    }
    else{

	var is_checking = false;	
		
    try{    
        
    $scope.singlepost = [];
    $scope.current_post_index = 0;   
    
    $('.imgpanel').show();  
        
    $('#back-to-top-btn').hide();    
        
    $('.spinner-div').hide();  
        
    $('#online-holder-div').show();
        
     $('#singlePostModal').on('hide.bs.modal', function () {
         $scope.single_post_show = false;
         var pfs = storageService.getStorageValue("posts");
         if(pfs!=false){
            postChange.sendData(pfs[$scope.current_post_index], $scope.current_post_index, "All");
         }
     });    
        
    $scope.closeSinglePost = function(){
        $('#singlePostModal').modal('hide');
    }    
        
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
        
    
    $scope.showShare = function(pid, subject, question){
        $('#singlePostModal').modal('hide');
        $scope.subject = subject;
        
        $scope.is_image_question = false;
        $scope.image_question = "";
        
        if(aContainsB(question,".png")){
            $scope.is_image_question = true;
            $scope.image_question = "images/SSCE/"+subject+"/QuestionImages"+question;
        }
        
        if(question.length>50){
            $scope.is_image_question = false;
            $scope.question = question.substring(0, 49)+"...";
        }
        else{
            $scope.question = question;
        }
        
        $scope.post_link = "https://www.geniusesafrica.com/#/post/"+pid;
        //$scope.post_link = "http://localhost/Geniuses/public/#/post/"+pid;
        
        
        $('#ShareModal').modal('show');
    }    
    
    $scope.gotoPost = function(){
        $('#ShareModal').modal('hide');
    }
    
    $scope.showSinglePost = function(id){
        //$scope.singlepost = null;
        //$scope.singlepost = post;
        $scope.current_post_index = id;
        
        var shown_post = $scope.posts[id];
        
        $scope.isdiscussion = true;
        $scope.single_post_show = true;
        if(isAlive(shown_post.question)){
           $scope.isdiscussion=false;    
           $scope.subject = shown_post.question.subject.toUpperCase();
           $scope.topic = shown_post.question.topic.toUpperCase();
           $scope.exam_type = shown_post.question.exam_type.toUpperCase();
           $scope.aclass = shown_post.question.class.toUpperCase();
           $scope.icon_url = shown_post.subject.icon_url;         
        }
        
        $('#singlePostModal').modal('show');
    }    
        
    var posts_from_storage = storageService.getStorageValue("posts");
        
        if(posts_from_storage!=false){
             $scope.posts = posts_from_storage;
            
        }
        else{
            if($scope.posts==undefined){
				is_checking = true;
              if(service.setPosts(0)){

                    service.send().then(function(response){
                    	is_checking = false;
                        if(responseReview.check(response.data)==true){
                            console.log(response.data);
                             if(response.data.data!=false){
                                 $scope.posts = response.data.data; 
                                 storageService.setStorageValue("posts", response.data.data);
                             }
                             else{

                             }
                             
                             if($rootScope.isnew){   
                                 $('#newUserModal').modal('show'); 
                                 $rootScope.isnew = false;
                             }
                            
                        }
                        else{
                             
                        }
                        
                    }, function(error){
						is_checking = false;
                         if(posts_from_storage!=false){
                                $scope.posts = posts_from_storage;
                         }
                         else{
                             
                         }
                    });
              }
				is_checking = false;
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
            $('html, body').animate({ scrollTop: 0 }, 'slow');
        });
    
      
        angular.element($window).bind("scroll", function() {
            if($state.current.name=="home"){
            var windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
            var body = document.body, html = document.documentElement;
            var docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
            var windowBottom = windowHeight + window.pageYOffset;
            
            if(is_checking == false){
            
            
            if (windowBottom >= docHeight-100) {
                is_checking = true;
                if(isAlive($scope.posts)){
                      
                    var current_number = $scope.posts.length;
                  
                    if(current_number<=100){
                       
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
      
      /*$interval(function(){
           checkForNewPosts();
      },10000);
		
	  function checkForNewPosts(){
		  if($scope.single_post_show==false||$scope.single_post_show==null||$scope.single_post_show==undefined){
			  if(service.setPosts(0)&&is_checking == false){
				  is_checking = true;
					service.send().then(function(response){
					 is_checking = false;
					   if(responseReview.check(response.data)){

							if(response.data.data!=false){
								$scope.posts = response.data.data; 
								storageService.setStorageValue("posts", response.data.data);
							}
							else{

							}
					   }
					}, function(error){
						is_checking = false;
					});
			  }
		  }
	  }*/
	  
      $scope.refreshFeed = function(){
          if(service.setPosts(0)&&is_checking==false){
			  is_checking = true;
                    service.send().then(function(response){
                       		  is_checking = false;
                       if(responseReview.check(response.data)){
                           
                            if(response.data.data!=false){
                                $scope.posts = response.data.data; 
                                storageService.setStorageValue("posts", response.data.data);
                            }
                            else{

                            }
                       }
                    }, function(error){
                        is_checking = false; 
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
      
      function aContainsB(a, b) {
         return a.indexOf(b) >= 0;
      }   
        
    }
    catch(e){
        console.log(e);
    }
        
    }
      
}]);