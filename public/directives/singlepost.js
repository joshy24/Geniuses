myApp.directive('singlePost', ['$compile', '$sce', '$state', 'service', 'postChange', 'responseReview','storageService', 'authService', function($compile, $sce, $state, service, postChange, responseReview, storageService, authService){
    
    var formatDate = function(datestring){
        datestring = datestring.trim();
        
        var d = datestring.split(' ')[0];
        var t = datestring.split(' ')[1];
        
        var post_day = d.split('-')[2];
        var post_month = d.split('-')[1];
        var post_year = d.split('-')[0];
        
        var date = new Date();
        var currentDate = date.getDate();     // Get current date
        var month       = date.getMonth() + 1; // current month
        var year        = date.getFullYear();
        
        
        if(post_year==year){
            if(post_month==month){
                if(post_day==currentDate){
                    post_hour = t.split(':')[0];
                    post_min = t.split(':')[1];
                    post_sec = t.split(':')[2];
                    
                    var currentTime = new Date();
                    hour = currentTime.getHours();
                    min  = currentTime.getMinutes();
                    sec  = currentTime.getSeconds();
                   
                    if(hour==post_hour){
                        if(min==post_min){
                           if(sec==post_sec){
                              return "just now";     
                           }
                           else{
                               if(sec-post_sec<=30){
                                   return "just now";
                               }
                               else{
                                   sc = sec-post_sec;
                                   return sc+" seconds ago";
                               }    
                           }
                        }
                        else{
                            if(min-post_min==1){
                                return "1 minute ago";
                            }
                            else{
                                mn = min-post_min;
                                return mn+" minutes ago";
                            }  
                        }
                    }
                    else{
                        if(hour-post_hour==1){
                            return "1 hour ago";
                        }
                        else{
                            hr = hour-post_hour;
                            return hr+" hours ago";
                        }  
                    }
                    
                }
                else{
                   if(currentDate-post_day==1){
                       return "1 day ago";
                   }
                   else{
                       dy = currentDate-post_day;
                       return dy+" days ago";
                   }  
                }
            }
            else{
               if(month-post_month==1){
                   return "1 month ago";
               }
               else{
                   mn = month-post_month;
                   return mn+" months ago";
               } 
            }
        }
        else{
            if(year-post_year==1){
                return "1 year ago";
            }
            else{
                yr = year-post_year;
                return yr+" years ago";
            }
            
        }
        
    }
    
    function mergeJSON(source1,source2){
    /*
     * Properties from the Souce1 object will be copied to Source2 Object.
     * Note: This method will return a new merged object, Source1 and Source2 original values will not be replaced.
     * */
    var mergedJSON = Object.create(source2);// Copying Source2 to a new Object

    for (var attrname in source1) {
        if(mergedJSON.hasOwnProperty(attrname)) {
          if ( source1[attrname]!=null && source1[attrname].constructor==Object ) {
              /*
               * Recursive call if the property is an object,
               * Iterate the object and set all properties of the inner object.
              */
              mergedJSON[attrname] = mergeJSON(source1[attrname], mergedJSON[attrname]);
          } 

        } else {//else copy the property from source1
            mergedJSON[attrname] = source1[attrname];

        }
      }

      return mergedJSON;
     }

    var question_text, image, explanation, picture_url, user, owner_image,comments;

    var question_template_with_image = '<div class="col-xs-12 col-md-12"><h5 ng-hide="is_image_question" class="post-info-text" ng-bind-html="getHtml(question)" id="question-text"></h5><img ng-show="is_image_question" class="timeline-image-question" ng-src="{{image_question}}"></div><div class="col-xs-12 col-md-12"><img class="pull-right" ng-src="images/SSCE/{{subject_name}}/Images/{{question_image}}" id="question-image"></div>';

    var question_template_without_image = '<div class="col-xs-12 col-md-12"> <h5 ng-hide="is_image_question" class="post-info-text" ng-bind-html="getHtml(question)" id="question-text"></h5><img ng-show="is_image_question" class="timeline-image-question" ng-src="{{image_question}}"></div>';
    
    var question_template = "";
    
    var setComments = function(){
     comments =  '<div class="allcomments"><div ng-show="isLoggedIn" class="col-xs-12 col-sm-12 col-md-12"><button ng-click="refreshComments()" id="refresh-comments-btn"><img src="img/reload.png" height="30" width="30"> refresh comments</button></div><div ng-repeat="comment in comments"><div class="container-fluid"><div class="row comment-info-div col-md-12"><a ng-click="showProfile(comment.user_id)"><img class="pull-left img-circle" ng-src="{{comment.picture_url}}" id="owner-image" height="40" width="40"></a><div class="row"><a ng-click="showProfile(comment.user_id)"><h5 class="capitalize post-info-text pull-left" id="owner-name"><b>{{comment.firstname}}  {{comment.lastname}}</b></h5></a><h5 class="post-info-text" id="post-date">{{comment.created}}</h5></div> </div><div class="row"><div ng-hide="isEdittedClicked && comment.user_id==user_id && current_editted_id==$index" class="col-xs-12 col-md-12"><h5 class="post-info-text" id="comment-text"><b>{{comment.comment}}</b></h5> </div> <div ng-show="isLoggedIn && isEdittedClicked && comment.user_id==user_id && current_editted_id==$index" class="col-xs-11 col-md-11"><textarea class="post-info-text" id="edit-text" ng-model="edited_comment">{{edited_comment}}</textarea></div><div ng-show="!isEdittedClicked && comment.user_id==user_id &&isLoggedIn" class="col-xs-12 col-md-12"><button ng-click="setEdittedClicked(true, comment.comment, $index)" class="abtn"><img src="img/edit.png" height="30" width="30"> edit</button></div><div ng-show="isEdittedClicked && comment.user_id==user_id && current_editted_id==$index && isLoggedIn" class="col-xs-12 col-md-12"><div id="edit-buttons-div"><button ng-click="submitEditted(edited_comment, comment.comment_id)" class="abtn"><img src="img/post.png" height="30px" width="30px"> submit</button> <button class="abtn" ng-click="unsetEdittedClicked()"><img src="img/close.png" height="30px" width="30px"> cancel</button></div></div></div></div></div></div>';   
        
    }
    
    var getTemplate = function(question, discussion){
        var template = '';
        
        var close_btn_html = '<button style="display: block; margin-left: auto; margin-right: auto; background-color: rgba(0,0,0,0); border: 0px solid white;" class="modal-title" href="" id="find-button" ng-click="closePost()"><img src="img/close.png" height="35" width="35"></button>';
        
        if(question!=null&&question!=0){
         template = '<div class="post-single"><div class="container-fluid"><div class="row post-owner-info-div"><h5 class="text-center">posted by <img ng-src="{{owner_image}}" height="40" width="40" class="img-circle"> <b>{{owner_name}}</b> on {{created}}</h5></div></div><div class="row">' +question_template +'</div><div class="row options-info-div"><div class="col-xs-6 col-md-6"><h5 ng-bind-html="getHtml(optionA)" class="question-option"></h5></div><div class="col-xs-6 col-md-6"><h5 ng-bind-html="getHtml(optionB)" class="question-option"></h5></div><div class="col-xs-6 col-md-6"><h5 ng-bind-html="getHtml(optionC)" class="question-option"></h5></div><div class="col-xs-6 col-md-6"><h5 ng-bind-html="getHtml(optionD)" class="question-option"></h5></div></div> <div class="row explanation-info-div col-md-12"> <img class="pull-left img-circle" ng-src="{{llh_img}}" id="llh-image" height="40" width="40"> <div class="row">  <h5 class="post-info-text" id="llh-name"><b>Explanation by Team Geniuses</b></h5> </div>   </div> <div class="row"> <div class="col-xs-12 col-md-12 question-answer-div"><b><h5 ng-bind-html="getHtml(answer_text)" class="pull-left question-answer"></h5></b></div> <div class="col-xs-11 col-md-11 explanation-content-div"><h5 class="post-info-text" id="explanation-text-sinlge" ng-bind-html="getHtml(explanation)"></h5><img id="question-explanation-img" ng-src="{{explanation_image}}"></div>  </div> <div class="row"> <div class="question-interaction-div col-md-12 col-xs-12"><div class="single-interaction"><button data-toggle="tooltip" title="click if explanation was helpful" ng-click="incrementHelpful()" class="text-center"><img src="{{helpful_img}}" height="25" width="25"> like</button><h6 class="text-center">{{helpful_count}}</h6></div><div class="single-interaction"><button data-toggle="tooltip" title="click to share this post" ng-click="incrementShare()" class="text-center"><img src="img/share-two.png" height="25" width="25"> share</button><h6 ng-model="share_count" class="text-center">{{share_count}}</h6></div><div class="single-interaction"><h5 class="text-center" data-toggle="tooltip" title="number of times this post has been viewed"><img src="img/views.png" height="25" width="25"> views</h5><h6 class="text-center">{{views_count}}</h6></div><div class="single-interaction"><h5 data-toggle="tooltip" title="total number of comments on this post" class="text-center"><img src="img/comment.png" height="25" width="25"> comments</h5><h6 class="text-center">{{comment_count}}</h6></div></div></div> </div>  <div class="user-comment-div"><div class="container-fluid"><div class="row user-info-div col-md-12"><a ng-click="showProfile(user_id)"><img class="pull-left img-circle" ng-src="{{user_img}}" id="user-image" height="40" width="40"></a><div class="row"><h5 class="capitalize post-info-text" id="user-name"><b>{{user_name}}</b></h5></div> </div><div class="row"><div class="col-xs-10 col-md-11 post-comment-div"><textarea class="post-info-text" placeholder="comment on this post" id="user-comment-text" ng-model="acomment">{{acomment}}</textarea></div> <div class="col-md-12 col-xs-12"><button ng-click="makeComment()" id="post-btn"><img src="img/post.png" height="25" width="25"> post</button></div> </div>  </div></div>' +comments;    
        }
        else if(discussion!=null&&discussion!=0){
            template = '<div class="discussion-post-div"><div class="container-fluid"><div class="row post-owner-info-div"><h5 class="text-center">posted by <img ng-src="{{owner_image}}" height="40" width="40" class="img-circle"> <b>{{owner_name}}</b> on {{created}}</h5></div><div class="row"><div class="col-xs-10 col-md-11"><h5 class="post-info-text" id="discussion-comment-text"><b>{{discussion}}</b></h5></div> </div> </div></div> <div class="user-comment-div"><div class="container-fluid"><div class="row user-info-div col-md-12"><a ng-click="showProfile(user_id)"><img class="pull-left img-circle" ng-src="{{user_img}}" id="user-image" height="40" width="40"></a><div class="row"><h5 class="capitalize post-info-text" id="user-name"><b>{{user_name}}</b></h5></div> </div><div class="row"><div class="col-xs-10 col-md-11 post-comment-div"><textarea class="post-info-text" placeholder="comment on this post" id="user-comment-text" ng-model="acomment">{{acomment}}</textarea></div> <div class="col-md-12 col-xs-12"><button ng-click="makeComment()" id="post-btn"><img src="img/post.png" height="25" width="25"> post</button></div> </div>  </div></div>' +comments;
        }

        return template;
    }

    
    var setExplanation = function(){
        if(explanation_text){
            explanation = '<div class="row">    <div class="col-md-1"><img class="llhlogo" src="img/LLLHLogo.png"></div><div class="col-md-11"><h4>Team LLH</h4>' +explanation_text +'</div></div>';
        }
        else{
            explanation = "";
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
   
    return{
        restrict: "EAC",
        scope: {
            index: '=',
            showshare: '&'
        },
        controller: ['$scope','$element', function($scope, $element){
            
            $('#spinner-div').hide();
        
		var network = false;	
			
        if(authService.isLoggedIn()){    
            var auser = authService.getUser();
        }
        
        var incrementStorageShare = function(){
            var current_posts = storageService.getStorageValue("posts");
                               
            current_posts[$scope.index].question_interaction.share_count = parseInt(current_posts[$scope.index].question_interaction.share_count)+1;
                               
            storageService.setStorageValue("posts", []);
            storageService.setStorageValue("posts", current_posts);
        }    
            
        var incrementStorageHelpful = function(){
            var current_posts = storageService.getStorageValue("posts");
                               
            current_posts[$scope.index].question_interaction.helpful_count = parseInt(current_posts[$scope.index].question_interaction.helpful_count)+1;
            
            current_posts[$scope.index].user_question_help.status = 1;
                               
            storageService.setStorageValue("posts", []);
            storageService.setStorageValue("posts", current_posts);
        } 
        
        $scope.incrementHelpful = function(){
                var status = $scope.content.user_question_help.status;
                    if(status==1||status==true){
                        //tell the user operation is not possible
                    }
                    else{
                        $scope.helpful_count +=1;
                        $scope.content.question_interaction.helpful_count = parseInt($scope.content.question_interaction.helpful_count)+1;
                        $scope.content.user_question_help.status = 1;
                        $scope.helpful_img = "img/helpful.png";
                        
                        service.setHelpful($scope.content.postid, "I");
                        service.send().then(function(response){
                            if(responseReview.check(response.data)){
                                if(response.data.data==false){
                                    $scope.helpful_count -=1;
                                    $scope.content.question_interaction.helpful_count = parseInt($scope.content.question_interaction.helpful_count)-1;
                                    $scope.content.user_question_help.status = 0;
                                    $scope.helpful_img = "img/upvote.png";
                                }
                                else if(response.data.data==true){
                                     incrementStorageHelpful();
                                }
                            }
                        }, function(error){
                             $scope.helpful_count -=1;
                             $scope.content.question_interaction.helpful_count = parseInt($scope.content.question_interaction.helpful_count)-1;
                             $scope.content.user_question_help.status = 0;
                             $scope.helpful_img = "img/upvote.png";
                        });
                        
                    }
        }
        
        $scope.incrementShare = function(){
            $scope.share_count +=1 ;     
            $scope.content.question_interaction.share_count = parseInt($scope.content.question_interaction.share_count)+1;
            
            service.setShareCount($scope.content.postid);
            service.send().then(function(response){
                if(responseReview.check(response.data)){
                    if(response.data.data==false){
                        $scope.share_count -=1 ;     
                        $scope.content.question_interaction.share_count = parseInt($scope.content.question_interaction.share_count)-1;  
                    }
                    if(response.data.data==true){
                        incrementStorageShare();
                    }
                    
  $scope.showshare({pid:$scope.content.postid,subject:$scope.content.question.subject,question:$scope.content.question.question});  
                }          
             }, function(error){
                   $scope.share_count -=1 ;     
                   $scope.content.question_interaction.share_count = parseInt($scope.content.question_interaction.share_count)-1;   
             });
        }
        
        $scope.acomment;
        
        $scope.current_editted_id = -1;
        
        $scope.isEdittedClicked = false;
        $scope.edited_comment = "";
        
        $scope.setEdittedClicked = function(bool, comm, index){
            if(authService.isLoggedIn()){
                $scope.current_editted_id = index;
                $scope.edited_comment = comm;
                $scope.isEdittedClicked = bool;
            }
            else{
                $('#signinModal').modal('show');
            }
        }
        
        $scope.unsetEdittedClicked = function(){
            if(authService.isLoggedIn()){
                $scope.current_editted_id = -1;
                $scope.edited_comment = "";
                $scope.isEdittedClicked = false;
            }
            else{
                $('#signinModal').modal('show');
            }
        }
        
        $scope.submitEditted = function(comm, id){
            if(authService.isLoggedIn()){
                if(comm!=$scope.content.comments[$scope.current_editted_id].comment){
                    if(service.setEditComment(id, comm)){
                        service.send().then(function(response){
                            if(responseReview.check(response.data)==true){
                                //add to comments view
                                if(response.data.data==true){
                                    $scope.content.comments[$scope.current_editted_id].comment = comm;
                                    setContent();
                                }
                                else{

                                }
                            }
                        }, function(error){

                        }).finally(function(){
                            $scope.current_editted_id = -1;
                            $scope.edited_comment = "";
                            $scope.isEdittedClicked = false;
                        });
                    }
                }
            }
            else{
                $('#signinModal').modal('show');
            }
        }
        
        $scope.closePost = function(){
            $('#singlePostModal').modal('hide');
            $scope.content = null;
        }
        
        $scope.showProfile = function(uid){
            if(authService.isLoggedIn()){
                $scope.closePost();
                $state.go('user', {id: uid});
            }
            else{
                $('#signinModal').modal('show');
            }
        }

        $scope.getHtml = function(html){
                return $sce.trustAsHtml(html);
        }
        
        $scope.refreshComments = function(){
            if(authService.isLoggedIn()){
                var adate="";
                var post_id = $scope.content.postid;

                if(isAlive($scope.content.comments)){
                    adate = $scope.content.comments[0].created;
                }

                if(service.setLatestComments(adate, post_id)==true){
                        $('#spinner-div').attr('class', 'show');
                        service.send().then(function(response){
                            
                            if(responseReview.check(response.data)==true&&isAlive(response.data.data)){
                                
                                $scope.content.comments = [];
                                $scope.content.comments_user_info = [];

                                $scope.content.comments = response.data.data[0];
                                $scope.content.comments_user_info = response.data.data[1];
                               
                                if(response.data.data[2]!=false){
                                    $scope.content.question_interaction = response.data.data[2]; 
                                    
                                    $scope.helpful_count = parseInt($scope.content.question_interaction.helpful_count);
                                    $scope.share_count = parseInt($scope.content.question_interaction.share_count);
                                    $scope.views_count = parseInt($scope.content.question_interaction.views_count);
                                    $scope.comment_count = parseInt($scope.content.question_interaction.comment_count);
                                }
                                
                                var current_posts = storageService.getStorageValue("posts");

                                current_posts[$scope.index].comments = $scope.content.comments;
                                current_posts[$scope.index].comments_user_info = $scope.content.comments_user_info;
                                current_posts[$scope.index].question_interaction = $scope.content.question_interaction;
                                
                                storageService.setStorageValue("posts", []);
                                storageService.setStorageValue("posts", current_posts);
                                   /*if($scope.content.comments){
                                       for(var j=response.data.latest[0].length-1;j>=0;j--){
                                          $scope.content.comments.splice(0,0, response.data.latest[0][j]);
                                       }
                                   }
                                   else{
                                       $scope.content.comments = response.data[0].latest;

                                   }

                                   if($scope.content.comments_user_info!=null){
                                       for(var j=response.data.latest[1].length-1;j>=0;j--){
                                          $scope.content.comments_user_info.splice(0,0,response.data.latest[1][j]); 
                                       }
                                   }
                                   else{
                                       $scope.content.comments_user_info = new Array();
                                       $scope.content.comments_user_info = response.data.latest[1];  
                                   }*/

                                   //com = response.data;
                                   //com_info = {firstname: auser.firstname, lastname : auser.lastname, picture_url : auser.picture_url};

                                   //$scope.add({comment:com, comment_info:com_info});

                                   setContent();
                            }
                            else{
                                //do nothing
                            }
                        }, function(error){
                            console.log(error.data);
                        });
                }
                else{

                }
            }
            else{
                $('#signinModal').modal('show');
            }
        } //end of getLatest comments
        
        $scope.makeComment = function(){
                var post_id = $scope.content.postid;
                var owner_id = null;
                var owner_type = "";

                if($scope.content.owner==1){
                    owner_id = 1;
                    owner_type = "L";
                }
                else{
                    owner_id = $scope.content.owner.id;
                    owner_type = "S";
                }    
            
                var user_type  = "S"; //to be changed in future
                var acomment = $scope.acomment;
               
                if(authService.isLoggedIn()==true){
                   
                   if(acomment&&network===false){ 
                       $scope.comment_count +=1;
                       $scope.content.question_interaction.comment_count = parseInt($scope.content.question_interaction.comment_count)+1; 
                      if(service.setmakeComment(post_id, owner_id, owner_type, user_type, acomment)){
                          
                          service.send().then(function(response){
                             
                               if(response.data.data&&responseReview.check(response.data)==true){
                                   
                                   var com, com_info;

                                   if($scope.content.comments){
                                       $scope.content.comments.splice(0,0, response.data.data);
                                   }
                                   else{
                                       $scope.content.comments[0] = response.data.data;

                                   }

                                   if($scope.content.comments_user_info!=null){
                                       $scope.content.comments_user_info.splice(0,0,{firstname: auser.firstname, lastname : auser.lastname, picture_url : auser.picture_url}); 
                                   }
                                   else{
                                       $scope.content.comments_user_info = new Array();
                                       $scope.content.comments_user_info[0] = {firstname: auser.firstname, lastname : auser.lastname, picture_url : auser.picture_url};  
                                   }
                                   
                                   var current_posts = storageService.getStorageValue("posts");
                                   
                                   current_posts[$scope.index].comments = [];
                                   current_posts[$scope.index].comments_user_info = [];

                                   current_posts[$scope.index].comments = $scope.content.comments;
                                   current_posts[$scope.index].comments_user_info = $scope.content.comments_user_info;

                                   current_posts[$scope.index].question_interaction.comment_count = $scope.content.question_interaction.comment_count;
                                   storageService.setStorageValue("posts", []);
                                   storageService.setStorageValue("posts", current_posts);
                                   //com = response.data;
                                   //com_info = {firstname: auser.firstname, lastname : auser.lastname, picture_url : auser.picture_url};                
                                   //$scope.add({comment:com, comment_info:com_info});
                                   
                                   setContent();
                                   $scope.acomment = "";
                               }
                               else{
                                  $scope.comment_count -=1;
                                  $scope.content.question_interaction.comment_count = parseInt($scope.content.question_interaction.comment_count)-1;   
                               }
							  
							  network = false;

                           }, function(err){
                                  $scope.comment_count -=1;
                                  $scope.content.question_interaction.comment_count = parseInt(scope.content.question_interaction.comment_count)-1; 
							  
							  	  network = false;
                           });
                       }
                   }
                   else{
                       // do nothing
                   }

                }
                else{
                    $state.go("login");
                }
             $scope.acomment="";
        } //end of makeComment()

        function setContent(){
            if($scope.content){
            
               $('#explanation-text-single').hide();

               $('#question-explanation-img').hide();
                
               $scope.explanation_image = "";   
                
               $scope.explanation = "";    
  if($.isEmptyObject($scope.content.comments)==false&&$scope.content.comments!=false&&$scope.content.comments!=""&&$scope.content.comments!=undefined){
                //merging comments and comments info array#############################################3333333
                $scope.comments = [];

                for(var i=0;i<$scope.content.comments.length;i++){
                    
                   if(isAlive($scope.content.comments_user_info[i].picture_url)==false){
                       $scope.content.comments_user_info[i].picture_url = "img/default.png";
                   }
                   else if(authService.isLoggedIn()){
                       if($scope.content.comments[i].user_id == auser.id){
                           $scope.content.comments_user_info[i].picture_url = auser.picture_url;
                       }
                   }
                   
                   var merged = $.extend($scope.content.comments[i], $scope.content.comments_user_info[i]);
               
                   $scope.comments.push(merged); 
                }
                 
                 setComments();
                //end of merge ****************************************
            }
            else{
                comments="";
            }    

                
            if($scope.content.question!=null&&$scope.content.question!=""){
                        if($scope.content.user_question_help.status==1){
                            $scope.helpful_img = "img/helpful.png";
                        }
                        else{
                            $scope.helpful_img = "img/upvote.png";
                        }
                
                        if($scope.content.question_interaction!=null&&$scope.content.question_interaction!=""){
                            $scope.helpful_count = parseInt($scope.content.question_interaction.helpful_count);
                            $scope.share_count = parseInt($scope.content.question_interaction.share_count);
                            $scope.views_count = parseInt($scope.content.question_interaction.views_count);
                            $scope.comment_count = parseInt($scope.content.question_interaction.comment_count);
                        }
                        else{
                            $scope.helpful_count = 0;
                            $scope.share_count = 0;
                            $scope.views_count = 0;
                            $scope.comment_count = 0;
                        }
                
                if($scope.content.subject.icon_url!=null&&$scope.content.subject.icon_url!=""){
                    $scope.subject_img = $scope.content.subject.icon_url;
                }
                if($scope.content.subject.name!=null&&$scope.content.subject.name!=""){
                    $scope.subject_name = $scope.content.subject.name;
                }
                if($scope.content.question.question){
                    if(aContainsB($scope.content.question.question,".png")){
                        $scope.image_question = "images/SSCE/"+$scope.subject_name+"/QuestionImages"+$scope.content.question.question;
                        $scope.is_image_question = true;
                    }
                    else{
                        $scope.is_image_question = false;
                            if(aContainsB($scope.content.question.question,"?")){
                                $scope.question = "<b>" +$scope.content.question.question +" </b>";
                            }
                            else{
                                $scope.question = "<b>" +$scope.content.question.question +"? </b>";
                            }
                    }
                }
                if($scope.content.question.optionA!=null&&$scope.content.question.optionA!=""){
                    $scope.optionA = "<b>A.</b> " +$scope.content.question.optionA;
                }
                if($scope.content.question.optionB!=null&&$scope.content.question.optionB!=""){
                    $scope.optionB = "<b>B.</b> " +$scope.content.question.optionB;
                }
                if($scope.content.question.optionC!=null&&$scope.content.question.optionC!=""){
                    $scope.optionC = "<b>C.</b> " +$scope.content.question.optionC;
                }
                if($scope.content.question.optionD!=null&&$scope.content.question.optionD!=""){
                    $scope.optionD = "<b>D.</b> " +$scope.content.question.optionD;
                }
                if(isAlive($scope.content.question.exam_type)){
                    $scope.exam_type = $scope.content.question.exam_type;
                    $scope.resource_path = "images/"+$scope.exam_type+"/"+$scope.subject_name;
                }
                if($scope.content.question.explanation!=null&&$scope.content.question.explanation!=""){
                    if(aContainsB($scope.content.question.explanation,".png")){
                       $scope.explanation_image = $scope.resource_path+"/Explanations"+$scope.content.question.explanation;
                       
                       $scope.explanation = "";    
                        
                       $('#question-explanation-img').show();
                       $('#explanation-text-single').hide();
                    }
                    else{
                       $scope.explanation = $scope.content.question.explanation;
                       
                       $scope.explanation_image = "";    
                       
                       $('#question-explanation-img').hide();
                       $('#explanation-text-single').show();
                    }
                }
                if(isAlive($scope.content.question.answer)){
                     $scope.answer_text = "<b>The answer is "+$scope.content.question.answer+".  ";
                    
                     var ans = "";
                    
                     switch($scope.content.question.answer){
                        case "A":
                            ans = $scope.content.question.optionA;
                            break;
                        case "B":
                            ans = $scope.content.question.optionB;
                            break;
                        case "C":
                            ans = $scope.content.question.optionC;
                            break;
                        case "D": 
                            ans = $scope.content.question.optionD;
                            break;
                     }
                    
                     ans+="</b>";
                    
                     if(ans.match(/\d+(-)\d+(-)\D/g)){
                        $scope.answer_text+="</b>";
                     }
                     else{
                        $scope.answer_text+=ans;
                     }
                }

                $scope.subject_color =  "rgb(" +$scope.content.subject.color+")";
  
                $scope.llh_img = "img/GeniusesLogo.png";
            }
            
             
            if($scope.content.question.image!=null&&$scope.content.question.image!=""){
                question_template = question_template_with_image;
                $scope.question_image = $scope.content.question.image;
            }    
            else{
                question_template = question_template_without_image;
            }
                
            if($scope.content.discussion!=""&&$scope.content.discussion!=null){
                $scope.discussion = $scope.content.discussion.discussion;
            }        

            if(authService.isLoggedIn()){
                $scope.isLoggedIn=true;
                
                //get and set current logged in user info and set user image
                user = authService.getUser();

                if(user.picture_url){
                   $scope.user_img = user.picture_url;
                }
                else{
                   $scope.user_img = "img/default.png";
                }
                //end of set user image

                $scope.user_name = user.firstname +" " +user.lastname;

                $scope.user_id = user.id;

                $scope.user_comment = "";
             }else{ $scope.isLoggedIn=false; }
            //setImage($scope.content.question.image);            
               
            //set post owner image
            if($scope.content.owner!=undefined){
                        if($scope.content.owner==1){
                            $scope.owner_image = $scope.llh_img;
                            $scope.owner_name = "Team Geniuses";
                        }
                        else{
                            if($scope.content.owner.picture_url){
                                if($scope.content.owner.id == user.id){
                                    $scope.owner_image = $scope.user_img;
                                }
                                else{
                                    $scope.owner_image = $scope.content.owner.picture_url;
                                }
                            }
                            else{
                                $scope.owner_image = "img/default.png";
                            }

                            $scope.owner_name = $scope.content.owner.firstname +" " +$scope.content.owner.lastname;
                        }
                        $scope.created = $scope.content.datecreated;
            }
            //end of set post owner image
            
            //end of set other post parameters*********************************************
            $element.html(getTemplate($scope.content.question, $scope.content.discussion));  
            $compile($element.contents())($scope);
            }
        }
        
            
        $scope.$on('postchange', function(){
            //$scope.$watch('content', function(){
           
            if(postChange.getTo()=="Single"){
                $scope.content = postChange.getPost();
             
        try{    
            $('#explanation-text-single').hide();

               $('#question-explanation-img').hide();
                
               $scope.explanation_image = "";    
                
               $scope.explanation = "";     
                
                if(isAlive($scope.content.comments)){
                //merging comments and comments info array#############################################3333333
                $scope.comments = [];

                for(var i=0;i<$scope.content.comments.length;i++){
                   
                   if(isAlive($scope.content.comments_user_info[i].picture_url)==false){
                       $scope.content.comments_user_info[i].picture_url = "img/default.png";
                   }    
                   else if(authService.isLoggedIn()){
                       if($scope.content.comments[i].user_id == auser.id){
                           $scope.content.comments_user_info[i].picture_url = auser.picture_url;
                       }
                   }    
                   
                   var merged = $.extend($scope.content.comments[i], $scope.content.comments_user_info[i]);
                   
                   $scope.comments.push(merged); 
                }
                 
                 setComments();
                //end of merge ****************************************
            }
            else{
                comments="";
            }    

                
            if($scope.content.question!=null&&$scope.content.question!=""){
                        if($scope.content.user_question_help.status==1){
                            $scope.helpful_img = "img/helpful.png";
                        }
                        else{
                            $scope.helpful_img = "img/upvote.png";
                        }
                        
                        if($scope.content.question_interaction!=null&&$scope.content.question_interaction!=""){
                            $scope.helpful_count = parseInt($scope.content.question_interaction.helpful_count);
                            $scope.share_count = parseInt($scope.content.question_interaction.share_count);
                            $scope.views_count = parseInt($scope.content.question_interaction.views_count);
                            $scope.comment_count = parseInt($scope.content.question_interaction.comment_count);
                        }
                        else{
                            $scope.helpful_count = 0;
                            $scope.share_count = 0;
                            $scope.views_count = 0;
                            $scope.comment_count = 0;
                        }
                
                if($scope.content.subject.icon_url!=null&&$scope.content.subject.icon_url!=""){
                    $scope.subject_img = $scope.content.subject.icon_url;
                }
                if($scope.content.subject.name!=null&&$scope.content.subject.name!=""){
                    $scope.subject_name = $scope.content.subject.name;
                }
                if($scope.content.question.question){
                    if(aContainsB($scope.content.question.question,".png")){
                        $scope.image_question = "images/SSCE/"+$scope.subject_name+"/QuestionImages"+$scope.content.question.question;
                        $scope.is_image_question = true;
                    }
                    else{
                        $scope.is_image_question = false;
                            if(aContainsB($scope.content.question.question,"?")){
                                $scope.question = "<b>" +$scope.content.question.question +" </b>";
                            }
                            else{
                                $scope.question = "<b>" +$scope.content.question.question +"? </b>";
                            }
                    }
                }
                if($scope.content.question.optionA!=null&&$scope.content.question.optionA!=""){
                    $scope.optionA = "<b>A.</b> " +$scope.content.question.optionA;
                }
                if($scope.content.question.optionB!=null&&$scope.content.question.optionB!=""){
                    $scope.optionB = "<b>B.</b> " +$scope.content.question.optionB;
                }
                if($scope.content.question.optionC!=null&&$scope.content.question.optionC!=""){
                    $scope.optionC = "<b>C.</b> " +$scope.content.question.optionC;
                }
                if($scope.content.question.optionD!=null&&$scope.content.question.optionD!=""){
                    $scope.optionD = "<b>D.</b> " +$scope.content.question.optionD;
                }
                if(isAlive($scope.content.question.exam_type)){
                    $scope.exam_type = $scope.content.question.exam_type;
                    $scope.resource_path = "images/"+$scope.exam_type+"/"+$scope.subject_name;
                }
                if($scope.content.question.explanation!=null&&$scope.content.question.explanation!=""){
                   
                    if(aContainsB($scope.content.question.explanation,".png")){
                       $scope.explanation_image = $scope.resource_path+"/Explanations"+$scope.content.question.explanation;
                       
                       $('#question-explanation-img').show();
                       $('#explanation-text-single').hide();
                    }
                    else{
                       $scope.explanation = $scope.content.question.explanation;
                       $('#question-explanation-img').hide();
                       $('#explanation-text-single').show();
                    }
                }
                if(isAlive($scope.content.question.answer)){
                     $scope.answer_text = "<b>The answer is "+$scope.content.question.answer+".  ";
                    
                     var ans = "";
                    
                     switch($scope.content.question.answer){
                        case "A":
                            ans = $scope.content.question.optionA;
                            break;
                        case "B":
                            ans = $scope.content.question.optionB;
                            break;
                        case "C":
                            ans = $scope.content.question.optionC;
                            break;
                        case "D": 
                            ans = $scope.content.question.optionD;
                            break;
                     }
                    
                     ans+="</b>";
                    
                     if(ans.match(/\d+(-)\d+(-)\D/g)){
                        $scope.answer_text+="</b>";
                     }
                     else{
                        $scope.answer_text+=ans;
                     }
                }

                $scope.subject_color =  "rgb(" +$scope.content.subject.color+")";
  
                $scope.llh_img = "img/GeniusesLogo.png";
            }
            
             
            if($scope.content.question.image!=null&&$scope.content.question.image!=""){
                question_template = question_template_with_image;
                $scope.question_image = $scope.content.question.image;
            }    
            else{
                question_template = question_template_without_image;
            }

            if($scope.content.discussion!=""&&$scope.content.discussion!=null){
                $scope.discussion = $scope.content.discussion.discussion;
            }     
             
            
            if(authService.isLoggedIn()){
                $scope.isLoggedIn = true;
                //get and set current logged in user info and set user image
                user = authService.getUser();

                if(user.picture_url){
                   $scope.user_img = user.picture_url;
                }
                else{
                   $scope.user_img = "img/default.png";
                }
                //end of set user image

                $scope.user_name = user.firstname +" " +user.lastname;

                $scope.user_id = user.id;

                $scope.user_comment = "";
            }else{ $scope.isLoggedIn = false; }
            //setImage($scope.content.question.image);            
            
            //set post owner image
            if($scope.content.owner!=undefined){
                        if($scope.content.owner==1){
                            $scope.owner_image = $scope.llh_img;
                            $scope.owner_name = "Team Geniuses";
                        }
                        else{
                            if($scope.content.owner.picture_url){
                                if($scope.content.owner.id == user.id){
                                    $scope.owner_image = $scope.user_img;
                                }
                                else{
                                    $scope.owner_image = $scope.content.owner.picture_url;
                                }
                            }
                            else{
                                $scope.owner_image = "img/default.png";
                            }

                            $scope.owner_name = $scope.content.owner.firstname +" " +$scope.content.owner.lastname;
                        }
                $scope.created = $scope.content.datecreated;
            }   
            //end of set post owner image
            
            //end of set other post parameters********************************************
            
            $element.html(getTemplate($scope.content.question, $scope.content.discussion));  
            $compile($element.contents())($scope);
          }
          catch(e){
              
          }
                 }
            });    
            
        }]
    }
}]);