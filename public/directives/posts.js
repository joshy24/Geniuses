myApp.directive('postItem', ['$compile', '$state', '$sce', 'service', 'responseReview', 'singlePost', 'postChange', 'storageService', 'authService', function($compile, $state, $sce, service, responseReview, singlePost, postChange, storageService, authService){
    
    var explanation_text = "";
    var explanation = "";
    var comments = "";
    
    var user = "";
    
    var question_template_with_image = '<div class="col-xs-12 col-md-12"><h5 ng-hide="is_image_question" class="post-info-text" ng-bind-html="getHtml(question)" id="question-text"></h5><img ng-show="is_image_question" class="timeline-image-question" ng-src="{{image_question}}"></div><div class="col-xs-12 col-md-12"><img class="pull-right" ng-src="images/SSCE/{{subject_name}}/Images/{{question_image}}" id="question-image"></div>';

    var question_template_without_image = '<div class="col-xs-12 col-md-12"> <h5 ng-hide="is_image_question" class="post-info-text" ng-bind-html="getHtml(question)" id="question-text"></h5><img ng-show="is_image_question" class="timeline-image-question" ng-src="{{image_question}}"></div>';

    var question_template = "";
    
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
        
        var post_hour = t.split(':')[0];
        var post_min = t.split(':')[1];
        var post_sec = t.split(':')[2];
                    
        var currentTime = new Date();
        var hour = currentTime.getHours();
        var min  = currentTime.getMinutes();
        var sec  = currentTime.getSeconds();
        
        if(post_year==year){
            if(post_month==month){
                if(post_day==currentDate){
                   
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
    
    var setComments = function(){
        comments = '<div class="allcomments"><div ng-repeat="comment in comments track by $index"><div class="container-fluid"><div class="row comment-info-div col-xs-12 col-md-12"><a ng-click="showProfile(comment.user_id)"><img class="pull-left img-circle" ng-src="{{comment.picture_url}}" id="owner-image" height="40" width="40"></a><div class="row"><a ng-click="showProfile(comment.user_id)"><h5 class="capitalize post-info-text pull-left" id="owner-name"><b>{{comment.firstname}}  {{comment.lastname}}</b></h5></a><h5 class="capitalize post-info-text" id="post-date">{{comment.created}}</h5></div> </div><div class="row"><div ng-hide="isEdittedClicked && comment.user_id==user_id && current_editted_id==$index" class="col-xs-12 col-md-12"><h5 class="post-info-text" id="comment-text"><b>{{comment.comment}}</b></h5> </div> <div ng-show="isEdittedClicked && comment.user_id==user_id && current_editted_id==$index" class="col-xs-11 col-md-11"><textarea class="post-info-text edit-text" ng-model="edited_comment">{{edited_comment}}</textarea></div><div ng-show="!isEdittedClicked && comment.user_id==user_id" class="col-xs-12 col-md-12"><button ng-click="setEdittedClicked(true, comment.comment, $index)" class="abtn"><img src="img/edit.png" height="30" width="30"> edit</button></div><div ng-show="isEdittedClicked && comment.user_id==user_id &&  current_editted_id==$index" class="col-xs-12 col-md-12"><div id="edit-buttons-div"><button ng-click="submitEditted(edited_comment, comment.comment_id)" class="abtn"><img src="img/post.png" height="30px" width="30px"> submit</button> <button class="abtn" ng-click="unsetEdittedClicked()"><img src="img/close.png" height="30px" width="30px"> cancel</button></div></div></div></div></div><div class="col-md-12 col-xs-12 col-sm-12 show-all-comments-btn-div"><button ng-click="showThisPost()" id="show-all-comments-btn"><img src="img/expand.png" height="30" width="30"> view all comments</button></div></div>';
    }
    
    var getTemplate = function(question, discussion){
        var template = '';
    
        if(question!=null&&question!=0){
            template = '<div class="post"><div class="container-fluid"><div class="row post-owner-info-div"><h5 class="text-center">posted by <img ng-src="{{owner_image}}" height="40" width="40" class="img-circle"> <b>{{owner_name}}</b> on {{created}}</h5></div><div class="row subject-info-div"><img class="pull-left" ng-src="{{subject_img}}" id="subject-image" height="40" width="40"><div class="row"><h3 style="color:{{subject_color}};" class="post-info-text" id="subject-name"><b>{{subject_name}}</b></h3></div> </div><div class="row">' +question_template +'</div><div class="row options-info-div"><div class="col-xs-6 col-md-6"><h5 ng-bind-html="getHtml(optionA)" class="question-option"></h5></div><div class="col-xs-6 col-md-6"><h5 ng-bind-html="getHtml(optionB)" class="question-option"></h5></div><div class="col-xs-6 col-md-6"><h5 ng-bind-html="getHtml(optionC)" class="question-option"></h5></div><div class="col-xs-6 col-md-6"><h5 ng-bind-html="getHtml(optionD)" class="question-option"></h5></div></div> <div class="row explanation-info-div col-md-12"> <img class="pull-left img-circle" ng-src="{{llh_img}}" id="llh-image" height="35" width="35"> <div class="row">  <h5 class="post-info-text" id="llh-name"><b>Explanation by Team Geniuses</b></h5> </div>   </div> <div class="row"> <div class="col-xs-11 col-md-12 explanation-content-div">' +explanation_text  +'</div>  </div> <div class="row"> <div class="question-interaction-div col-md-12 col-xs-12"><div class="single-interaction"><button data-toggle="tooltip" title="click if explanation was helpful" ng-click="incrementHelpful()" class="text-center"><img src="{{helpful_img}}" height="25" width="25"> like</button><h6 class="text-center">{{helpful_count}}</h6></div><div class="single-interaction"><button data-toggle="tooltip" title="click to share this post" ng-click="incrementShare()" class="text-center"><img src="img/share-two.png" height="25" width="25"> share</button><h6 class="text-center">{{share_count}}</h6></div><div class="single-interaction"><h5 class="text-center" data-toggle="tooltip" title="number of times this post has been viewed"><img src="img/views.png" height="25" width="25"> views</h5><h6 class="text-center">{{views_count}}</h6></div><div class="single-interaction"><h5 data-toggle="tooltip" title="total number of comments on this post" class="text-center"><img src="img/comment.png" height="25" width="25"> comments</h5><h6 class="text-center">{{comment_count}}</h6></div></div></div> </div> </div><div class="user-comment-div"><div class="container-fluid"><div class="row user-info-div col-md-12"><a ng-click="showProfile(user_id)"><img class="pull-left img-circle" ng-src="{{user_img}}" id="user-image" height="40" width="40"></a><div class="row"><h5 class="capitalize post-info-text" id="user-name"><b>{{user_name}}</b></h5></div> </div><div class="row"><div class="col-xs-10 col-md-11 post-comment-div"><textarea class="post-info-text" placeholder="comment on this post" id="user-comment-text" ng-model="acomment">{{acomment}}</textarea></div> <div class="col-md-12 col-xs-12"><button ng-click="makeComment()" id="post-btn"><img src="img/post.png" height="30" width="30"> post</button></div> </div>  </div></div>' +comments;
        }
        else if(discussion!=null&&discussion!=0){
            template = '<div class="discussion-post-div"><div class="container-fluid"><div class="row post-owner-info-div"><h5 class="text-center">posted by <img ng-src="{{owner_image}}" height="40" width="40" class="img-circle"> <b>{{owner_name}}</b> on {{created}}</h5></div><div class="row"><div ng-show="!isEditClicked" class="col-xs-12 col-md-11"><h5 class="post-info-text" id="discussion-comment-text"><b>{{discussion}}</b></h5></div> <div ng-show="isEditClicked" class="col-xs-11 col-md-11"><textarea class="post-info-text edit-text" ng-model="editted_discussion">{{discussion}}</textarea>        </div><div ng-show="!isEditClicked && discussion_user_id == user_id" class="col-xs-12 col-md-12"><button ng-click="setEditClicked(discussion)" class="abtn"><img src="img/edit.png" height="30" width="30"> edit</button></div><div ng-show="isEditClicked" class="col-xs-12 col-md-12"><div id="edit-buttons-div"><button ng-click="submitEdit(editted_discussion, discussion_id)" class="abtn"><img src="img/post.png" height="30px" width="30px"> submit</button> <button class="abtn" ng-click="unsetEditClicked()"><img src="img/close.png" height="30px" width="30px"> cancel</button></div></div> </div> </div></div> <div class="user-comment-div"><div class="container-fluid"><div class="row user-info-div col-md-12"><a ng-click="showProfile(user_id)"><img class="pull-left img-circle" ng-src="{{user_img}}" id="user-image" height="40" width="40"></a><div class="row"><h5 class="capitalize post-info-text" id="user-name"><b>{{user_name}}</b></h5></div> </div><div class="row"><div class="col-xs-10 col-md-11 post-comment-div"><textarea class="post-info-text" placeholder="comment on this post" id="user-comment-text" ng-model="acomment">{{acomment}}</textarea></div> <div class="col-md-12 col-xs-12"><button ng-click="makeComment()" id="post-btn"><img src="img/post.png" height="30" width="30"> post</button></div></div></div></div>' +comments;
        }

        return template;
    }
    
    function aContainsB(a, b) {
        return a.indexOf(b) >= 0;
    }
    
    var setExplanation = function(){
            explanation_text = explanation +'<button class="learn-more-btn" ng-click="showThisPost()">learn more</button>';
    }
    
    var isAlive = function(avar){
          if(avar!==false&&avar!==undefined&&avar!==null&&avar!==""){
              return true;
          }
          else{
              return false;
          }
    }
    
    var linker = function(scope, element, attrs, $index) {
        scope.acomment = "";
       
        scope.helpful_count = 0;
        scope.share_count = 0;
        
        var auser = authService.getUser();
		
		var network = false;
        
        scope.llh_img = "img/GeniusesLogo.png";
		
        scope.showProfile = function(uid){
            $state.go('user', {id: uid});
        }
        
		
        var incrementStorageShare = function(){
            var current_posts = storageService.getStorageValue("posts");
                               
            current_posts[scope.index].question_interaction.share_count = parseInt(current_posts[scope.index].question_interaction.share_count)+1;
                               
            storageService.setStorageValue("posts", []);
            storageService.setStorageValue("posts", current_posts);
        }
        
        var incrementStorageViews = function(){
            var current_posts = storageService.getStorageValue("posts");
                               
            current_posts[scope.index].question_interaction.views_count = parseInt(current_posts[scope.index].question_interaction.views_count)+1;
                               
            storageService.setStorageValue("posts", []);
            storageService.setStorageValue("posts", current_posts);
        } 
        
        //increment views
        var incrementViews = function(){
            service.setViewCount(scope.content.postid);
            service.send().then(function(response){
                if(responseReview.check(response.data)){
                    if(response.data.data===false){
                         scope.views_count-=1;
                         scope.content.question_interaction.views_count = parseInt(scope.content.question_interaction.views_count)-1;
                    }
                    else if(response.data.data===true){
                         incrementStorageViews();
                    }
                }
            }, function(error){
                scope.views_count-=1;
                scope.content.question_interaction.views_count = parseInt(scope.content.question_interaction.views_count)-1;
            });
        }
        
         var incrementStorageHelpful = function(){
            var current_posts = storageService.getStorageValue("posts");
                               
            current_posts[scope.index].question_interaction.helpful_count = parseInt(current_posts[scope.index].question_interaction.helpful_count)+1;
            
            current_posts[scope.index].user_question_help.status = 1;
             
            storageService.setStorageValue("posts", []);
            storageService.setStorageValue("posts", current_posts);
        } 
        
        scope.incrementHelpful = function(){
                    var status = scope.content.user_question_help.status;
                
                    if(status==1||status===true){
                        //tell the user operation is not possible
                    }
                    else{
                        scope.helpful_count +=1;
                        scope.content.question_interaction.helpful_count = parseInt(scope.content.question_interaction.helpful_count)+1;
                        scope.content.user_question_help.status = 1;
                        scope.helpful_img = "img/helpful.png";
                        
                        service.setHelpful(scope.content.postid, "I");
                        service.send().then(function(response){
                            if(responseReview.check(response.data)){
                                if(response.data.data===false){
                                    scope.helpful_count -=1;
                                    scope.content.question_interaction.helpful_count = parseInt(scope.content.question_interaction.helpful_count)-1;
                                    scope.content.user_question_help.status = 0;
                                    scope.helpful_img = "img/upvote.png";
                                }
                                if(response.data.data===true){
                                     incrementStorageHelpful();
                                }
                            }
                        }, function(error){
                             scope.helpful_count -=1;
                             scope.content.question_interaction.helpful_count = parseInt(scope.content.question_interaction.helpful_count)-1;
                             scope.content.user_question_help.status = 0;
                             scope.helpful_img = "img/upvote.png";
                        });
                    }
        }
        
        scope.incrementShare = function(){
            scope.share_count +=1 ;     
           
            scope.content.question_interaction.share_count = parseInt(scope.content.question_interaction.share_count)+1;                          scope.showshare({pid:scope.content.postid,subject:scope.content.question.subject,question:scope.content.question.question});
            
            service.setShareCount(scope.content.postid);
            service.send().then(function(response){
                
                if(responseReview.check(response.data)){
                    if(response.data.data===false){
                        scope.share_count -=1 ;     
                        scope.content.question_interaction.share_count = parseInt(scope.content.question_interaction.share_count)-1;   
                    }
                    if(response.data.data===true){
                        incrementStorageShare();
                    }
                }          
             }, function(error){
                   scope.share_count -=1 ;     
                   scope.content.question_interaction.share_count = parseInt(scope.content.question_interaction.share_count)-1;   
             });
        }
        
        //for comments
        scope.current_editted_id = -1;
        
        scope.isEdittedClicked = false;
        scope.edited_comment = "";
        
        scope.setEdittedClicked = function(bool, comm, index){
            scope.current_editted_id = index;
            scope.edited_comment = comm;
            scope.isEdittedClicked = bool;
        }
        
        scope.unsetEdittedClicked = function(){
            scope.current_editted_id = -1;
            scope.edited_comment = "";
            scope.isEdittedClicked = false;
        }
        
        scope.submitEditted = function(comm, id){
            if(comm!=scope.content.comments[scope.current_editted_id].comment){
                if(service.setEditComment(id, comm)){
                    service.send().then(function(response){
                        if(responseReview.check(response.data)===true){
                            //add to comments view
                            if(response.data.data===true){
                                scope.content.comments[scope.current_editted_id].comment = comm;
                                setContent();
                            }
                            else{
                                
                            }
                        }
                    }, function(error){

                    }).finally(function(){
                        scope.current_editted_id = -1;
                        scope.edited_comment = "";
                        scope.isEdittedClicked = false;
                    });
                }
            }
        }
        
        
        
        //for discussion
        scope.isEditClicked = false;
        scope.editted_discussion = "";
        
        scope.setEditClicked = function(dis){
            scope.isEditClicked  = true;
            scope.editted_discussion = dis;
        }
        
        scope.unsetEditClicked = function(){
            scope.isEditClicked  = false;
            scope.editted_discussion = "";
        }
        
        scope.submitEdit = function(dis, id){
            if(dis!=scope.content.discussion.discussion){
                if(service.setEditDiscussion(id, dis)){
                    service.send().then(function(response){
                        if(responseReview.check(response.data)===true){
                            //add to discussion view
                            if(response.data.data===true){
                                scope.content.discussion.discussion = dis;
                                setContent();
                            }
                            else{
                                
                            }
                        }
                    }, function(error){

                    }).finally(function(){
                         scope.isEditClicked = false;
                         scope.editted_discussion = "";
                    });
                }
            }
        }
        
        
        
        scope.makeComment = function(){
            var post_id = scope.content.postid;
            var owner_id = null;
            var owner_type = "";
            
            if(scope.content.owner==1){
                owner_id = 1;
                owner_type = "L";
            }
            else{
                owner_id = scope.content.owner.id;
                owner_type = "S";
            }
            
             //to be changed in future when tutors are availabale
            var user_type  = "S"; //to be changed in future
            var acomment = scope.acomment;
            
            if(authService.isLoggedIn()===true){
                
               if(scope.acomment&&network === false){    
                  scope.comment_count +=1;
                  scope.content.question_interaction.comment_count = parseInt(scope.content.question_interaction.comment_count)+1;
                   
                   if(service.setmakeComment(post_id, owner_id, owner_type, user_type, acomment)){
					   network = true;
                      service.send().then(function(response){
                          
                           if(response.data.data&&responseReview.check(response.data)===true){
                               
                               if(scope.content.comments){
                                   scope.content.comments.splice(0,0, response.data.data);
                               }
                               else{
                                   scope.content.comments[0] = response.data.data;
                                   
                               }
                               
                               if(scope.content.comments_user_info!=null){
                                   scope.content.comments_user_info.splice(0,0,{firstname: auser.firstname, lastname : auser.lastname, picture_url : auser.picture_url}); 
                               }
                               else{
                                   scope.content.comments_user_info = new Array();
                                   scope.content.comments_user_info[0] = {firstname: auser.firstname, lastname : auser.lastname, picture_url : auser.picture_url};  
                               }
                               
                               var current_posts = storageService.getStorageValue("posts");
                               
                               current_posts[scope.index].comments = [];
                               current_posts[scope.index].comments_user_info = [];
                               
                               current_posts[scope.index].comments = scope.content.comments;
                               current_posts[scope.index].comments_user_info = scope.content.comments_user_info;
                               
                               storageService.setStorageValue("posts", []);
                               storageService.setStorageValue("posts", current_posts);
                               
                               setContent();
                               scope.acomment = "";
                           }
                           else{
                               scope.comment_count -=1;
                               scope.content.question_interaction.comment_count = parseInt(scope.content.question_interaction.comment_count)-1;
                           }
						  
						   network = false;
                           
                       }, function(err){
                            scope.comment_count -=1;
                            scope.content.question_interaction.comment_count = parseInt(scope.content.question_interaction.comment_count)-1;
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
            
        }  //end of makeComment()
            
                scope.showThisPost = function(){
                   scope.views_count+=1;
                   scope.content.question_interaction.views_count = parseInt(scope.content.question_interaction.views_count)+1; 
                      
                   postChange.sendData(scope.content, scope.index, "Single");
                   scope.showpost({id: scope.index});
                   incrementViews();
                }

                scope.getHtml = function(html){
                        return $sce.trustAsHtml(html);
                }

                
                function setContent(){
                    if(scope.content){
               
                    if($.isEmptyObject(scope.content.comments)===false){
                        //merging comments and comments info array#############################################3333333
                        scope.comments = [];

                        var count = 0; 

                        if(scope.content.comments.length===1){
                            count=1;
                        }
                        if(scope.content.comments.length>=2){
                            count=2;
                        }

                        for(var i=0;i<count;i++){
                           
                           if(isAlive(scope.content.comments_user_info[i].picture_url)===false){
                               scope.content.comments_user_info[i].picture_url = "img/default.png";
                           }        
                           else{
                               if(scope.content.comments[i].user_id === auser.id){
                                   scope.content.comments_user_info[i].picture_url = auser.picture_url;
                               }
                           }    
                            
                           var merged = $.extend(scope.content.comments[i], scope.content.comments_user_info[i]);

                           scope.comments.push(merged); 
                        }

                         setComments();
                        //end of merge ****************************************
                    }
                    else{
                        comments="";
                    }        

                    if(scope.content.question!=null&&scope.content.question!==""){
                        if(scope.content.user_question_help.status==1){
                            scope.helpful_img = "img/helpful.png";
                        }
                        else{
                            scope.helpful_img = "img/upvote.png";
                        }
                        
                        if(scope.content.question_interaction!==null&&scope.content.question_interaction!==""){
                            scope.helpful_count = parseInt(scope.content.question_interaction.helpful_count);
                            scope.share_count = parseInt(scope.content.question_interaction.share_count);
                            scope.views_count = parseInt(scope.content.question_interaction.views_count);
                            scope.comment_count = parseInt(scope.content.question_interaction.comment_count);
                        }
                        else{
                            scope.helpful_count = 0;
                            scope.share_count = 0;
                            scope.views_count = 0;
                            scope.comment_count = 0;
                        }
                        
                        
                        if(scope.content.subject.icon_url!==null&&scope.content.subject.icon_url!==""){
                            scope.subject_img = scope.content.subject.icon_url;
                        }
                        if(scope.content.subject.name!==null&&scope.content.subject.name!==""){
                            scope.subject_name = scope.content.subject.name;
                        }
                        if(scope.content.question.question){
                            if(aContainsB(scope.content.question.question,".png")){
                                scope.image_question = "images/SSCE/"+scope.subject_name+"/QuestionImages"+scope.content.question.question;
                                scope.is_image_question = true;
                            }
                            else{
                                scope.is_image_question = false;
                                if(aContainsB(scope.content.question.question,"?")){
                                    scope.question = "<b>" +scope.content.question.question +" </b>";
                                }
                                else{
                                    scope.question = "<b>" +scope.content.question.question +"? </b>";
                                }
                            }
                        }
                        if(scope.content.question.optionA!==null&&scope.content.question.optionA!==""){
                            scope.optionA = "<b>A.</b> " +scope.content.question.optionA;
                        }
                        if(scope.content.question.optionB!==null&&scope.content.question.optionB!==""){
                            scope.optionB = "<b>B.</b> " +scope.content.question.optionB;
                        }
                        if(scope.content.question.optionC!==null&&scope.content.question.optionC!==""){
                            scope.optionC = "<b>C.</b> " +scope.content.question.optionC;
                        }
                        if(scope.content.question.optionD!==null&&scope.content.question.optionD!==""){
                            scope.optionD = "<b>D.</b> " +scope.content.question.optionD;
                        }
                        if(scope.content.question.explanation!==null&&scope.content.question.explanation!==""){
                            
                          if(aContainsB(scope.content.question.explanation, ".png")){
                             explanation = "";
                              
                             setExplanation();  
                          }
                          else{
                            if(scope.content.question.explanation.length>60){
                                scope.explanation = "<b>" +scope.content.question.explanation.substring(0, 55) +"....";
                            }
                            else{
                                scope.explanation = scope.content.question.explanation +'</b>';
                            }

                            explanation = '<h5 class="post-info-text" ng-bind-html="getHtml(explanation)" id="explanation-text"></h5>';

                            setExplanation();
                          }
                        }

                        scope.subject_color =  "rgb(" +scope.content.subject.color+")";

                    }


                    if(scope.content.question.image!==null&&scope.content.question.image!==""){
                        question_template = question_template_with_image;
                        scope.question_image = scope.content.question.image;
                    }    
                    else{
                        question_template = question_template_without_image;
                    }

                        
                    if(scope.content.discussion!==""&&scope.content.discussion!=null){
                         scope.discussion = scope.content.discussion.discussion;
                         scope.discussion_id = scope.content.discussion.discussion_id;
                         scope.discussion_user_id = scope.content.discussion.user_id;
                    }    
                        
                    //get and set current logged in user info and set user image
                    user = authService.getUser();

                    if(user.picture_url){
                       scope.user_img = user.picture_url;
                    }
                    else{
                       scope.user_img = "img/default.png";
                    }
                    //end of set user image

                    scope.user_name = user.firstname +" " +user.lastname;

                    scope.user_id = user.id;

                    scope.user_comment = "";

                    //setImage(scope.content.question.image);            

                    //set post owner image
                    if(scope.content.owner!==undefined){
                        if(scope.content.owner===1){
                            scope.owner_image = scope.llh_img;
                            scope.owner_name = "Team Geniuses";
                        }
                        else{
                            if(scope.content.owner.picture_url){
                                if(scope.content.owner.id === user.id){
                                    scope.owner_image = scope.user_img;
                                }
                                else{
                                    scope.owner_image = scope.content.owner.picture_url;
                                }
                            }
                            else{
                                scope.owner_image = "img/default.png";
                            }

                            scope.owner_name = scope.content.owner.firstname +" " +scope.content.owner.lastname;
                        }
                        scope.created = scope.content.datecreated;
                    }
                        
                    element.html(getTemplate(scope.content.question, scope.content.discussion));  
                    $compile(element.contents())(scope);    
                  }
                }
        

        scope.$watch('content', function(){
            if(scope.content){
                    var auser = authService.getUser();
               
                    if($.isEmptyObject(scope.content.comments)===false){
                        //merging comments and comments info array#############################################3333333
                        scope.comments = [];
                        
                        var count = 0; 

                        if(scope.content.comments.length==1){
                            count=1;
                        }
                        if(scope.content.comments.length>=2){
                            count=2;
                        }

                        for(var i=0;i<count;i++){
                        
                           if(isAlive(scope.content.comments_user_info[i].picture_url)===false){
                               scope.content.comments_user_info[i].picture_url = "img/default.png";
                           }  
                           else{
                               if(scope.content.comments[i].user_id === auser.id){
                                   scope.content.comments_user_info[i].picture_url = auser.picture_url;
                               }
                           }     
                            
                           var merged = $.extend(scope.content.comments[i], scope.content.comments_user_info[i]);
                          
                           scope.comments.push(merged); 
                        }

                         setComments();
                        //end of merge ****************************************
                    }
                    else{
                        comments="";
                    } 
                
                    if(scope.content.question!=null&&scope.content.question!=""){
                       
                        if(scope.content.user_question_help.status==1){
                            scope.helpful_img = "img/helpful.png";
                        }
                        else{
                            scope.helpful_img = "img/upvote.png";
                        }
                        
                        if(scope.content.question_interaction!=null&&scope.content.question_interaction!=""){
                            scope.helpful_count = parseInt(scope.content.question_interaction.helpful_count);
                            scope.share_count = parseInt(scope.content.question_interaction.share_count);
                            scope.views_count = parseInt(scope.content.question_interaction.views_count);
                            scope.comment_count = parseInt(scope.content.question_interaction.comment_count);
                        }
                        else{
                            scope.helpful_count = 0;
                            scope.share_count = 0;
                            scope.views_count = 0;
                            scope.comment_count = 0;
                        }
                        
                        if(scope.content.subject.icon_url!=null&&scope.content.subject.icon_url!=""){
                            scope.subject_img = scope.content.subject.icon_url;
                        }
                        if(scope.content.subject.name!=null&&scope.content.subject.name!=""){
                            scope.subject_name = scope.content.subject.name;
                        }
                        if(scope.content.question.question){
                            if(aContainsB(scope.content.question.question,".png")){
                                scope.image_question = "images/SSCE/"+scope.subject_name+"/QuestionImages"+scope.content.question.question;
                                scope.is_image_question = true;
                            }
                            else{
                                scope.is_image_question = false;
                                if(aContainsB(scope.content.question.question,"?")){
                                    scope.question = "<b>" +scope.content.question.question +" </b>";
                                }
                                else{
                                    scope.question = "<b>" +scope.content.question.question +"? </b>";
                                }
                            }
                        }
                        if(scope.content.question.optionA!=null&&scope.content.question.optionA!=""){
                            scope.optionA = "<b>A.</b> " +scope.content.question.optionA;
                        }
                        if(scope.content.question.optionB!=null&&scope.content.question.optionB!=""){
                            scope.optionB = "<b>B.</b> " +scope.content.question.optionB;
                        }
                        if(scope.content.question.optionC!=null&&scope.content.question.optionC!=""){
                            scope.optionC = "<b>C.</b> " +scope.content.question.optionC;
                        }
                        if(scope.content.question.optionD!=null&&scope.content.question.optionD!=""){
                            scope.optionD = "<b>D.</b> " +scope.content.question.optionD;
                        }
                        if(scope.content.question.explanation!=null&&scope.content.question.explanation!=""){
                            if(aContainsB(scope.content.question.explanation, ".png")){
                               explanation = "";
                                
                               setExplanation();
                            }
                            else{
                                if(scope.content.question.explanation.length>60){
                                    scope.explanation = "<b>" +scope.content.question.explanation.substring(0, 55) +"....";
                                }
                                else{
                                    scope.explanation = scope.content.question.explanation +'</b>';
                                }

                                explanation = '<h5 class="post-info-text" ng-bind-html="getHtml(explanation)" id="explanation-text"></h5>';

                                setExplanation();
                            }
                        }

                        scope.subject_color =  "rgb(" +scope.content.subject.color+")";

                    }


                    if(isAlive(scope.content.question.image)){
                        question_template = question_template_with_image;
                        scope.question_image = scope.content.question.image;
                    }    
                    else{
                        question_template = question_template_without_image;
                    }

                    if(scope.content.discussion!=""&&scope.content.discussion!=null){
                        scope.discussion = scope.content.discussion.discussion;
                        scope.discussion_id = scope.content.discussion.discussion_id;
                        scope.discussion_user_id = scope.content.discussion.user_id;
                    }   
                
                    //get and set current logged in user info and set user image
                    user = authService.getUser();

                    if(user.picture_url){
                       scope.user_img = user.picture_url;
                    }
                    else{
                       scope.user_img = "img/default.png";
                    }
                    //end of set user image

                    scope.user_name = user.firstname +" " +user.lastname;

                    scope.user_id = user.id;

                    scope.user_comment = "";

                    //setImage(scope.content.question.image);            
                   
                    //set post owner image
                    if(scope.content.owner!=undefined){
                        if(scope.content.owner==1){
                            scope.owner_image = scope.llh_img;
                            scope.owner_name = "Team Geniuses";
                        }
                        else{
                            if(scope.content.owner.picture_url){
                                if(scope.content.owner.id == user.id){
                                    scope.owner_image = scope.user_img;
                                }
                                else{
                                    scope.owner_image = scope.content.owner.picture_url;
                                }
                                
                            }
                            else{
                                scope.owner_image = "img/default.png";
                            }
                            scope.owner_name = scope.content.owner.firstname +" " +scope.content.owner.lastname;
                        }
                        scope.created = scope.content.datecreated;
                    }
                        
                    var template = getTemplate(scope.content.question, scope.content.discussion);
                
                    element.html(template);  
                    $compile(element.contents())(scope);    
                  }
        });    
    }

    return {
        restrict: "EAC",
        link: linker,
        scope: {
            content:'=',
            showpost: '&',
            index: '@',
            showshare: '&'
        }, 
        controller: ['$scope', '$element', function($scope, $element){
            
            $scope.$on('postchange', function(){
                if($scope.index == postChange.getId() && postChange.getTo()=="All"){
                    //$scope.content = postChange.getPost();
                    
                    var current_posts = storageService.getStorageValue("posts");
                    $scope.content = current_posts[$scope.index];
                    
                    var auser = authService.getUser();
               
                    if($.isEmptyObject($scope.content.comments)===false){
                        //merging comments and comments info array#############################################3333333
                        $scope.comments = [];

                        var count = 0; 

                        if($scope.content.comments.length==1){
                            count=1;
                        }
                        if($scope.content.comments.length>=2){
                            count=2;
                        }

                        for(var i=0;i<count;i++){
                        
                           if(isAlive($scope.content.comments_user_info[i].picture_url)===false){
                               $scope.content.comments_user_info[i].picture_url = "img/default.png";
                           }  
                           else{
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
                        if($scope.content.question.explanation!=null&&$scope.content.question.explanation!=""){
                            if(aContainsB($scope.content.question.explanation, ".png")){
                               explanation = "";
                                
                               setExplanation();
                            }
                            else{
                                if($scope.content.question.explanation.length>60){
                                    $scope.explanation = "<b>" +$scope.content.question.explanation.substring(0, 55) +"....";
                                }
                                else{
                                    $scope.explanation = $scope.content.question.explanation +'</b>';
                                }

                                explanation = '<h5 class="post-info-text" ng-bind-html="getHtml(explanation)" id="explanation-text"></h5>';

                                setExplanation();
                            }
                        }

                        $scope.subject_color =  "rgb(" +$scope.content.subject.color+")";

                    }


                    if(isAlive($scope.content.question.image)){
                        question_template = question_template_with_image;
                        $scope.question_image = $scope.content.question.image;
                    }    
                    else{
                        question_template = question_template_without_image;
                    }

                    if($scope.content.discussion!=""&&$scope.content.discussion!=null){
                        $scope.discussion = $scope.content.discussion.discussion;
                        $scope.discussion_id = $scope.content.discussion.discussion_id;
                        $scope.discussion_user_id = $scope.content.discussion.user_id;
                    }   
                
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

                    //setImage($scope.content.question.image);            
                    
                    //set post owner image
                    if($scope.content.owner!=undefined){
                        if($scope.content.owner==1){
                            $scope.owner_image = $scope.llh_img;
                            $scope.owner_name = "Team LLH";
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
                        
                    var template = getTemplate($scope.content.question, $scope.content.discussion);
                
                    $element.html(template);  
                    $compile($element.contents())($scope);    
                }
            });
        }]
    };
}]);    