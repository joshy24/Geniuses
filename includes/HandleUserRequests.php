<?php 
 require_once 'Database.php';
 require_once 'Posts.php';
 require_once 'FetchedPosts.php';
 require_once 'Dates.php';
 require_once 'Friends.php';
 require_once 'LLHPosts.php';
 require_once 'FriendsPost.php';
 require_once 'UserPosts.php';
 require_once 'Subjects.php';
 require_once 'Discussion.php';
 require_once 'Comments.php';
 require_once 'Requests.php';
 require_once 'User.php';
 require_once 'QuestionInteraction.php';
 require_once 'UserHelpful.php';
 require_once 'QuestionAttempt.php';
 

 class HandleUserRequests{
     
     protected static $alluserposts=array();
     protected static $acount=0;
     
     public static function editDiscussion($did=0, $dis="", $id=0){
        global  $database;
         
        $discussion_id = $database->escape_value($did);
        $disc = $database->escape_value($dis);
        $usid = $database->escape_value($id); 
         
        $the_disc = Discussion::find_by_id($discussion_id); 
        
        if($the_disc!=false){
            if($the_disc->user_id == $usid){
                if($the_disc->discussion!=$disc){
                    $the_disc->discussion = $disc;
                    if($the_disc->updateDiscussion()){
                        return true;
                    }
                    else{
                        return false;
                    }
                }
                else{
                    return false;
                }
            }
            else{
                return false;
            }
        }
        else{
            return false;
        } 
     }
     
     public static function editComment($cid=0, $comm="", $user_id=0){
        global  $database;
         
        $comment_id = $database->escape_value($cid);
        $comment = $database->escape_value($comm);
        $usid = $database->escape_value($user_id); 
         
        $the_comment = Comment::find_by_id($comment_id); 
        
        if($the_comment!=false){
            if($the_comment->user_id == $usid){
                if($the_comment->comment!=$comment){
                    $the_comment->comment = $comment;
                    if($the_comment->update()){
                        return true;
                    }
                    else{
                        return false;
                    }
                }
                else{
                    return false;
                }
            }
            else{
                return false;
            }
        }
        else{
            return false;
        } 
         
     }
     
     public static function setUserOffline($id = 0, $type = ""){
         if($type="S"){
             $user = User::find_by_id($id);
             
             if($user!=false){
                  if($user->online!=false){
                     $user->online = false;
                     if($user->update()){
                         return true;
                     }
                     else{
                         return false;
                     }
                  }
                  else{
                      return false;
                  }
             }
             else{
                 return false;
             }
         }
     }
     
     public static function setUserOnline($id = 0, $type = ""){
         if($type="S"){
             $user = User::find_by_id($id);
             
             if($user!=false){
                 if($user->online!=true){
                     $user->online = true;
                     if($user->update()){
                         return true;
                     }
                     else{
                         return false;
                     }
                 }
                 else{
                     return false;
                 }
             }
             else{
                 return false;
             }
         }
     }
     
     public static function getLatestCommentsOnPost($pid=0, $cd="",$uid=0,$typ=""){
         
         global $database;
         $comment_date = $database->escape_value($cd);
         $postid = $database->escape_value($pid);
         $userid = $database->escape_value($uid);
         $type = $database->escape_value($typ);
         
       if($postid>0){
         
       try{     
           
        $anpost = Posts::getPost($postid);      
         
        if($anpost!=false){    
            
            $comments = $anpost->getPostComments(15,$userid,$type);
            $comments_user_info = $anpost->getCommentsInfo($comments);
            $qi = QuestionInteraction::find_by_question_subject($anpost->question_id, $anpost->subject_id);
            
            return [$comments, $comments_user_info, $qi];
        }
        else{
            return false;
        }  
          
       }
       catch(Exception $e){
          return false; 
       }
         
       }
       else{
          return false; 
       }
         
     }
     
     public static function respondToRequest($request_id=0, $action){
         global $database;
         $id = $database->escape_value($request_id);
         
         $req = Request::find_by_id($id);
         
         if($req!=false){
             
             if($action=="A"){
                $res = Friends::isFriend($req->from_id,$req->from_type, $req->to_id, $req->to_type);

                 if($req->accepted=="N"||$req->accepted=="D"){
                    if($res==false){

                        $friend = Friends::make($req->from_id,$req->from_type, $req->to_id, $req->to_type);
                        if($friend!=false){

                            if($friend->create()){
                                $friend = Friends::make($req->to_id, $req->to_type, $req->from_id, $req->from_type);

                                if($friend->create()){
                                    $req->delete();

                                    return true;
                                }
                                else{
                                    return false;
                                }
                            }
                            else{
                                return false;
                            }

                        }
                        else{
                            return false;
                        }
                    }
                    else{
                        return "F";
                    }
                 }
             }
             if($action=="D"){
                if($req->accepted=="N"){
                   
                   if($req->delete()){
                       return 'D';
                   }
                   else{
                       return false;
                   }
                }
                else{
                    return "D";
                }
             }
             if($action!="D" && $action!="A"){return false;}
         }
         else{
             false;
         }
         
     }
     
     public static function makeFriendRequest($fid=0, $ft='', $tid=0, $tt=''){
       
         if(Request::find_request($tid, $tt, $fid, $ft)==false){//userB has sent request to userA
             
           if(Request::find_request($fid, $ft,  $tid, $tt)==false){//userA has sent request to userB

              $result = Friends::isFriend($fid, $ft, $tid, $tt);

              if($result==true){
                 return "F";
              }
              else{

                 $request = Request::make($fid, $ft,  $tid, $tt);

                 if($request!=false){
                     if($request->create()){
                         return "S";
                     }
                     else{
                         return "E";
                     }
                 }
                 else{
                     return false;
                 }
              }
           }
           else{
              return "AB";     
           }
         }
         else{
             return "BA";    
         }
     }
     
     
     public static function incrementCommmentCount($pid=0){ //increment comment count on question by providng post_id
         if($pid>0&&$pid!=false){
             $post = Posts::getPost($pid);
             if($post!=false){
                 $qid = $post->question_id;
                 $subid = $post->subject_id;
                 
                 if($qid!=""&&$subid!=""){
                    $qi = QuestionInteraction::find_by_question_subject($qid,$subid);
                    if($qi!=false){
                        $qi->comment_count = $qi->comment_count+1;
                        return $qi->update();
                    } 
                    else{
                        $new_qi = QuestionInteraction::make($qid,$subid);
                        $new_qi->comment_count+=1;
                        return $new_qi->create();
                    } 
                 }
                 else{
                     return false;
                 }
             }
             else{
                return false; 
             }
         }
         else{
            return false;
         }
     }
     
     public static function incrementViewsCount($pid=0){
         if($pid>0&&$pid!=false){
             $post = Posts::getPost($pid);
             if($post!=false){
                 $qid = $post->question_id;
                 $subid = $post->subject_id;
                
                 if($qid!=""&&$subid!=""){
                    $qi = QuestionInteraction::find_by_question_subject($qid,$subid);
                     
                    if($qi!=false){
                        $qi->views_count = $qi->views_count+1;
                       
                        return $qi->update();
                    } 
                    else{
                        $new_qi = QuestionInteraction::make($qid,$subid);
                        $new_qi->views_count+=1;
                        return $new_qi->create();
                    } 
                 }
                 else{
                     return false;
                 }
             }
             else{
                return false; 
             }
         }
         else{
            return false;
         }
     }
     
     public static function incrementShareCount($pid=0){
         if($pid>0&&$pid!=false){
             $post = Posts::getPost($pid);
             if($post!=false){
                 $qid = $post->question_id;
                 $subid = $post->subject_id;
                 
                 if($qid!=""&&$subid!=""){
                    $qi = QuestionInteraction::find_by_question_subject($qid,$subid);
                    if($qi!=false){
                        $qi->share_count = $qi->share_count+1;
                        return $qi->update();
                    } 
                    else{
                        $new_qi = QuestionInteraction::make($qid,$subid);
                        $new_qi->share_count+=1;
                        return $new_qi->create();
                    } 
                 }
                 else{
                     return false;
                 }
             }
             else{
                return false; 
             }
         }
         else{
            return false;
         }
     }
     
     public static function HelpfulCount($qid, $subid, $operation){
                if($qid!=""&&$subid!=""){
                    $qi = QuestionInteraction::find_by_question_subject($qid,$subid);
                    if($qi!=false){
                        if($operation=="D"){
                            $qi->helpful_count = $qi->helpful_count-1;
                            return $qi->update();
                        }
                        if($operation=="I"){
                            $qi->helpful_count = $qi->helpful_count+1;
                            return $qi->update();
                        }  
                    } 
                    else{
                        $new_qi = QuestionInteraction::make($qid,$subid);
                        switch($operation){
                            case "D":
                                $new_qi->helpful_count-=1;    
                            break;
                            case "I":
                                $new_qi->helpful_count+=1;
                            break;    
                        }
                        return $new_qi->create();
                    } 
                 }             
     }
     
     
     public static function setUserHelpful($pid, $usid, $operation){
         if($pid>0&&$pid!=false){
             $post = Posts::getPost($pid);
             if($post!=false){
                 $qid = $post->question_id;
                 $subid = $post->subject_id;
                 if($qid!=""&&$subid!=""){
                     $uh = UserHelpful::find_user_helpful($qid, $subid, $usid);
                    
                     if($uh!=false){//user has clicked helpful or unhelpful for this question
                         if($operation=="D"){//user is attempting to set question to unhelpful
                             if($uh->status==1||$uh->status==true){//the current status is helpful
                                 $uh->status = 0;//set the current status to unhelpful 
                                 if($uh->update()){//update helpful/unhelpful status of the question for the current user
                                     self::HelpfulCount($qid, $subid, "D");//reduce the general helpful count of the question by 1. 
                                     return true;
                                 }
                                 else{
                                     return false;
                                 }
                             }
                             else{
                                return false;
                             }
                         }
                         if($operation=="I"){
                             if($uh->status==0||$uh->status==false){
                                 $uh->status = 1;
                                 if($uh->update()){
                                     self::HelpfulCount($qid, $subid, "I");
                                     
                                     return true;
                                 }  
                                 else{
                                     return false;
                                 }
                             }
                             else{
                                return false;
                             }
                         }
                     }
                     else{//user has never clicked the helpful or unhelpful button for this question
                         
                         $uh = UserHelpful::make($qid, $subid, $usid);
                         switch($operation){
                             case "D":
                                 $uh->status = 0;
                             break;
                             case "I":
                                 $uh->status = 1;
                             break;     
                         }
                         
                         if($uh->create()){ //create userhelpful of question for user
                             switch($uh->status){
                                 case 0:
                                     self::HelpfulCount($qid, $subid, "D");
                                     
                                     return true;
                                 break;
                                 case 1:
                                     self::HelpfulCount($qid, $subid, "I");
                                     
                                     return true;
                                 break;     
                             }
                         }
                         else{
                             return false;
                         }
                     }
                 }
                 else{
                    return false;
                 }
             }
             else{
                return false;
             }
         }
         else{
            return false;
         }
     }
     
     public static function makeCommentOnPost($usid, $postid, $ownerid, $owner_user_type, $user_type, $comment){
         
         $result = Friends::isFriend($usid, $user_type, $ownerid, $owner_user_type);
         $friend_tag_post = FriendsPost::find_friend_tag_post($usid, $postid, $user_type);     
         
         
         if($usid==$ownerid){//its the users post
                 
             $new_comment = Comment::make($usid, $postid, $comment, $user_type);
              if($new_comment->create()){
               self::incrementCommmentCount($postid);
                  
               $auser_post = UserPosts::setUserPost($postid, $usid, $user_type);
                 
                 if($auser_post!=false){
                     $auser_post->last_viewed = Dates::getCurrentDateTime();
                     $auser_post->updateUserPost();
                     FriendsPost::updateUserFriendsTag($usid, $user_type, $postid);
                     return $new_comment;
                 }
                 else{
                     $auser_post = UserPosts::make($postid, $user_type, $usid);
                     
                     if($auser_post->createUserPost()){
                         FriendsPost::updateUserFriendsTag($usid, $user_type, $postid);
                         return $new_comment;
                     }
                 }
             }
         }
         else if($result!=false){
             $new_comment = Comment::make($usid, $postid, $comment, $user_type);
             
              if($new_comment->create()){
                 self::incrementCommmentCount($postid);
                 $user_post = UserPosts::setUserPost($postid, $ownerid, $owner_user_type);
                  
                 if($user_post!=false){
                     $user_post->last_viewed = Dates::getCurrentDateTime();
                     if($user_post->updateUserPost()){//update the last viewed date for the owner of the post
                         FriendsPost::updateUserFriendsTag($ownerid, $owner_user_type, $postid);
                         return $new_comment;
                     }
                 }  
                  
                  return $new_comment;
                  
             }
             else{
                 return false;
             }
             
         }
         /*else if($friend_tag_post!=false){
             $new_comment = Comment::make($usid, $postid, $comment, $user_type);
             
             if($new_comment->create()){
               self::incrementCommmentCount($postid);
               $friend_tag_post->last_viewed = Dates::getCurrentDateTime();
               if($friend_tag_post->update()){
                   return $new_comment;
               }
               else{
                   return false;
               }
             }
             else{
                return false;
             }
         }*/
         else if($ownerid==1){//its an LLH Post
             $new_comment = Comment::make($usid, $postid, $comment, $user_type);
             if($new_comment->create()){
                self::incrementCommmentCount($postid);
                //FriendsPost::updateUserFriendsTag($usid, $user_type, $postid);
                return $new_comment;
             }
             else{
                 return false;
             }
         }
         else{
             return false;
         }
         
     }
     
     public static function makeQuestionPost($subd=0, $qid=0, $uid=0, $ut=""){
         global $database;
         $quid = $database->escape_value($qid);
         $usid = $database->escape_value($uid);
         $ust = $database->escape_value($ut);
         $subid = $database->escape_value($subd);
         
         if($subid!==0 && $quid!==0 && $usid!==0){
           $post_owner = Posts::getQuestionPostOwner($subid, $quid, $usid, $ust);//confirms if its user post
           $llh_post_owner = LLHPost::isLLHPost($subid, $quid); //confirms if its an LLH post
           $friend_post_owner = Friends::isFriendQuestionPost($subid, $quid, $usid, $ust); //confirms if its a friends post  
             
             if($post_owner!=false){// its the user's post
                 
               $auser_post = UserPosts::setUserPost($post_owner->post_id, $usid, $ust);
                 
                if($auser_post!=false){
                   $auser_post->last_viewed = Dates::getCurrentDateTime();
                    if($auser_post->updateUserPost()){
                        
                        if(FriendsPost::updateUserFriendsTag($usid, $auser_post->post_id)){
                            //updating all friends posts went well
                            return "U";
                        }
                        else{
                            return false;
                        }
                    }
                    else{
                        
                    }
                    
                    
                }
                else{
                    return false;
                }
             }
             else if($llh_post_owner!=false){ //its an LLH post
                
                 $auser_post = UserPosts::setUserPost($llh_post_owner->post_id,$usid,$ust);
                 
                if($auser_post!=false){
                     //update date tag
                     $auser_post->last_viewed = Dates::getCurrentDateTime();
                     if($auser_post->updateUserPost()){
                         //tell friends
                         if(FriendsPost::updateUserFriendsTag($usid, $ust, $auser_post->post_id)){
                             return true;
                         }
                         else{
                             return false;
                         }
                     }
                     else{
                         return false;
                     }
                }
                else{
                     //tag me
                     $new_user_post = UserPosts::make($llh_post_owner->post_id, $ust, $usid);
                    
                     if($auser_post->createUserPost()){
                         //tell friends
                         if(FriendsPost::updateUserFriendsTag($usid, $ust, $auser_post->post_id)){
                             return true;
                         }
                         else{
                             return false;
                         }
                     }
                     else{
                         
                     }
                 }
             }
             else if($friend_post_owner!=false){//its a friends post
            
                 UserPosts::updateFriendsUserPost($friend_post_owner->user_id, $friend_post_owner->user_type, $friend_post_owner->post_id);
                 FriendsPost::updateUserFriendsTag($friend_post_owner->user_id, $friend_post_owner->user_type, $friend_post_owner->post_id);
                 
                 return "F";
             }
             else{ //post against user_id
                return self::createNewUserPost($subid, $quid, $usid, $ust,"Q");
             }//end of make new post
         }
     }
     
     public static function makeDiscussionPost($did=0, $uid, $ut=""){
         global $database;
         $duid = $database->escape_value($did);
         $usid = $database->escape_value($uid);
         $ust = $database->escape_value($ut);
         
         if(Discussion::find_by_id($did)!=false){
            
             if($duid!==0 && $usid!==0){
                $post_owner = Posts::getDiscussionPostOwner($duid, $usid, $ust);//confirms if its user post
                 
                $friend_post_owner = Friends::isFriendDiscussionPost($duid, $usid, $ust); //confirms if its a friends post
                
                 if($post_owner!=false){// its the user's post
                     
                   $auser_post = UserPosts::setUserPost($post_owner->post_id, $usid, $ust);
                        
                    if($auser_post!=false){
                       $auser_post->last_viewed = Dates::getCurrentDateTime();
                        if($auser_post->updateUserPost()){

                            if(FriendsPost::updateUserFriendsTag($usid, $auser_post->user_type, $auser_post->post_id)){
                                //updating all friends posts went well
                                return true;
                            }
                            else{
                                return false;
                            }
                        }
                        else{

                        }


                    }
                    else{
                        return false;
                    }
                 }
                 else if($friend_post_owner!=false){//its a friends post

                     UserPosts::updateFriendsUserPost($friend_post_owner->user_id, $friend_post_owner->user_type, $friend_post_owner->post_id);
                     FriendsPost::updateUserFriendsTag($friend_post_owner->user_id, $friend_post_owner->user_type, $friend_post_owner->post_id);
                 }
                 else{ //post against user_id
                     return self::createNewUserPost(0, $duid, $usid, $ust,"D");
                 }//end of make new post
             }
         }
         else{
           return false;
         }
     }
    
     private static function createNewUserPost($subid, $id, $usid, $usertype, $post_type){
         $new_post;
         
         switch($post_type){
             case "D":
                 $new_post = Posts::make(0, 0, $usid, $usertype, $id, 'D');
                 break;
             case "Q": 
                 $new_post = Posts::make($subid, $id, $usid, $usertype, 0, 'Q');
                 break;
                 
         }
         
         if($new_post->createPost()){
             
             if($post_type=="Q"){//create interaction object for the question if it does not already exist
                 $qi_exists = QuestionInteraction::find_by_question_subject($id, $subid);
                 
                 if($qi_exists==false){
                 
                     $qi = QuestionInteraction::make($id, $subid);

                     if($qi){
                         $qi->create();
                     }
                 }
             }
             
             $new_userpost = UserPosts::make($new_post->post_id, $usertype, $usid);

             if($new_userpost->createUserPost()){
                  
                        //tell friends if user has friends
                       if(FriendsPost::updateUserFriendsTag($usid, $usertype, $new_userpost->post_id)){
                           return $new_userpost->post_id;
                       }
                       else{
                           return $new_userpost->post_id;
                       }
                   
             }
             else{
                 return false;
             }      
          }
          else{
              return false;
          }          
     }
     
     //pulling user posts from userpost, friendpost and llh tables
     public static function getAllUserPosts($id=0, $type, $department, $num){
        $userpoststable = "userpost";
        $friendspoststable = "friendpost";
        $llhpoststable = "llhuserpost"; 
        
        if($id>0){  
           self::getPosts($id, $userpoststable, $type);
           
           self::getPosts($id, $friendspoststable, $type);
            
           self::getLLHPosts($id, $department, $type);  
           
        }
        
        if(!empty(self::$alluserposts)){
            
             //self::$alluserposts = self::array_sort_created(self::$alluserposts);
            self::$alluserposts = self::array_sort_lastviewed(self::$alluserposts);
           
            $all_fetched_posts = array();
            
            $all_fetched_posts = self::removeDuplicates(self::$alluserposts);

            if(!empty($all_fetched_posts)){
                $posts_to_send = array();
                
                $start = 0;
                $finish = 0;
                
                $fetch_count = count($all_fetched_posts);
                
                if($num<=250){
                    
                    if($fetch_count>$num){
                        $start = $num;
                        if(($fetch_count-$num)>15){
                            $finish = $num+15;
                        }
                        else{
                            $finish = $fetch_count;
                        }
                        
                        for($i=$start;$i<$finish;$i++){
                            $posts_to_send[] = $all_fetched_posts[$i];
                        }

                        return $posts_to_send;
                    }
                    else{
                        return false;
                    }
                }
                else{
                    return false;
                }
                
            }
            else{
                return false;
            }
            
        }
        else{
           return false;
        }
     }
     
     public static function getPosts($id=0, $tn="", $ut=""){
         global $database;
         $userid = $database->escape_value($id);
         $tablename = $database->escape_value($tn);
         $type = $database->escape_value($ut);
         
         $posts_array=null;
         
         switch($tablename){
             case "friendpost":
               
                $posts_array = FriendsPost::find_by_id($userid, $type);
              
                break;
             case "userpost":
                
                $posts_array = UserPosts::find_by_id($userid, $type);
                
                break;
         }
         
         $apost = NULL;
         
         if(!empty($posts_array)){
             foreach($posts_array as $value){
              try{    
                 $fetched_post = new FetchedPosts();
                 
                 $postid =  $value->post_id;
                 
                 $apost = Posts::getPost($postid);
                  
                 if($apost!=false){

                   if($apost->getPostType()=='Q'){
                     $fetched_post->question = $apost->getPostQuestion();
                     $fetched_post->discussion = "";
                     
                     $fetched_post->question_interaction = QuestionInteraction::find_by_question_subject($apost->question_id, $apost->subject_id);   
                     /*if($fetched_post->question_interaction==false){
                         $qi = QuestionInteraction::make($apost->question_id, $apost->subject_id);
                         $qi->create();
                         $fetched_post->question_interaction = $qi;
                     }*/
                     
                     $fetched_post->user_question_help = UserHelpful::find_user_helpful($apost->question_id, $apost->subject_id, $userid);   
                     if($fetched_post->user_question_help==false){
                         $uh = new UserHelpful();
                         $uh->question_id = $apost->question_id;
                         $uh->subject_id = $apost->subject_id;     
                         $uh->user_id = $userid;    
                         $uh->status = 0;
                         
                         $fetched_post->user_question_help = $uh;
                     }   
                     
					 $fetched_post->user_attempt = QuestionAttempt::find_by_userid($userid, $apost->question_id, $apost->subject_id);  
					   
					 $fetched_post->friends_attempt = QuestionAttempt::find_friends_attempts($userid, $apost->question_id, $apost->subject_id);  
					   
                     $subject = Subject::find_by_name($fetched_post->question->subject);
                     $fetched_post->subject = $subject;
                   }
                   else if($apost->getPostType()=='D'){
                     $fetched_post->discussion = $apost->getPostDiscussion();
                     $fetched_post->question = "";
                     $fetched_post->subject = "";
                     $fetched_post->question_interaction = "";
                     $fetched_post->user_question_help = "";
                   }

                          
                     $fetched_post->comments = $apost->getPostComments(20,$userid,$type);
                      
                     $fetched_post->comments_user_info = $apost->getCommentsUserInfo($fetched_post->comments);
                      
                     $fetched_post->postid = $postid;
                      
                     $fetched_post->owner = $apost->getOwner();
                      
                     $fetched_post->lastviewed = $value->last_viewed; 
                      
                     $fetched_post->datecreated = $apost->getPostDate();
                     
                     self::$alluserposts[self::$acount] = $fetched_post; 

                     //echo json_encode($this->alluserposts[$this->acount]);
                    
                     self::$acount++;
                 }          
              }
              catch(Exception $e){
                  return false;
              }
                  
           }     
         }
     }
     
     public static function FetchPost($postid=0, $id=0, $typ=""){
         global $database;
         $userid = $database->escape_value($id);
         $type = $database->escape_value($typ);
         
         $apost = Posts::getPost($postid);
         
         $fetched_post = new FetchedPosts();
                  
          if($apost!=false){

                          if($apost->getPostType()=='Q'){
                              $fetched_post->question = $apost->getPostQuestion();
                              $fetched_post->discussion = "";
                              
                              $fetched_post->question_interaction = QuestionInteraction::find_by_question_subject($apost->question_id, $apost->subject_id);
                              
                              /*if($fetched_post->question_interaction==false){
                                 $qi = QuestionInteraction::make($apost->question_id, $apost->subject_id);
                                 $qi->create();
                                 $fetched_post->question_interaction = $qi;
                              }*/
                              
                              $fetched_post->user_question_help = UserHelpful::find_user_helpful($apost->question_id, $apost->subject_id, $userid);      
                              
                              if($fetched_post->user_question_help==false){
                                 $uh = new UserHelpful();
                                 $uh->question_id = $apost->question_id;
                                 $uh->subject_id = $apost->subject_id;     
                                 $uh->user_id = $userid;    
                                 $uh->status = 0;

                                 $fetched_post->user_question_help = $uh;
                              }   
                              
							  $fetched_post->user_attempt = QuestionAttempt::find_by_userid($userid, $apost->question_id, $apost->subject_id);  
					   
					 $fetched_post->friends_attempt = QuestionAttempt::find_friends_attempts($userid, $apost->question_id, $apost->subject_id);
							  
                              $subject = Subject::find_by_name($fetched_post->question->subject);
                              $fetched_post->subject = $subject;
                          }
                          else if($apost->getPostType()=='D'){
                              $fetched_post->discussion = $apost->getPostDiscussion();
                              $fetched_post->question = "";
                              $fetched_post->subject = "";
                              $fetched_post->question_interaction = "";
                              $fetched_post->user_question_help = "";
                          }

                          $fetched_post->comments = $apost->getPostComments(20,$userid,$type);
                          $fetched_post->comments_user_info = $apost->getCommentsUserInfo($fetched_post->comments);
                          $fetched_post->postid = $postid;
                          $fetched_post->owner = $apost->getOwner();
                          $fetched_post->lastviewed = $apost->post_date; 
                          $fetched_post->datecreated = $apost->getPostDate();


                          return  $fetched_post;
                          //echo json_encode($this->alluserposts[$this->acount]);            
          }
          else{
              return false;
          }
     }        
     
     public static function FetchPostExposed($postid=0){
         global $database;
         $pid = $database->escape_value($postid);
         $apost = Posts::getPost($pid);
         
         $fetched_post = new FetchedPosts();
                  
          if($apost!=false){

                          if($apost->getPostType()=='Q'){
                              $fetched_post->question = $apost->getPostQuestion();
                              $fetched_post->discussion = "";
                              
                              $fetched_post->question_interaction = QuestionInteraction::find_by_question_subject($apost->question_id, $apost->subject_id);
                              
                              $fetched_post->user_question_help = "";
                              
                              $subject = Subject::find_by_name($fetched_post->question->subject);
                              $fetched_post->subject = $subject;
                          }
                          else if($apost->getPostType()=='D'){
                              $fetched_post->discussion = $apost->getPostDiscussion();
                              $fetched_post->question = "";
                              $fetched_post->subject = "";
                              $fetched_post->question_interaction = "";
                              $fetched_post->user_question_help = "";
                          }

                          $fetched_post->comments = "";
                          $fetched_post->comments_user_info = "";
                          $fetched_post->postid = $pid;
                          $fetched_post->owner = $apost->getOwner();
                          $fetched_post->lastviewed = $apost->post_date; 
                          $fetched_post->datecreated = $apost->getPostDate();


                          return  $fetched_post;
                          //echo json_encode($this->alluserposts[$this->acount]);            
          }
          else{
              return false;
          }
     }
     
     public static function getLLHPosts($id=0,$dt="",$typ=""){
         global $database;
         $userid = $database->escape_value($id);
         $department = $database->escape_value($dt);
         $type = $database->escape_value($typ);
         
         $posts = array();
         
         $count = 0;
         
         $posts_array = LLHPost::getPosts("All");
         
         $apost = NULL;
         
         if(!empty($posts_array)){
             foreach($posts_array as $value){
                  
                 $fetched_post = new FetchedPosts();
                 
                 $postid =  $value->post_id;
                 
                 $apost = Posts::getPost($postid);
                  
                 if($apost!=false){

                   if($apost->getPostType()=='Q'){
                     $fetched_post->question = $apost->getPostQuestion();
                     $fetched_post->discussion = "";
                              
                     $fetched_post->question_interaction = QuestionInteraction::find_by_question_subject($apost->question_id, $apost->subject_id);   
                        
                     /*if($fetched_post->question_interaction==false){
                         $qi = QuestionInteraction::make($apost->question_id, $apost->subject_id);
                         $qi->create();
                         $fetched_post->question_interaction = $qi;
                     }  */
                       
                     $fetched_post->user_question_help = UserHelpful::find_user_helpful($apost->question_id, $apost->subject_id, $userid);            
                    if($fetched_post->user_question_help==false){
                            $uh = new UserHelpful();
                            $uh->question_id = $apost->question_id;
                            $uh->subject_id = $apost->subject_id;     
                            $uh->user_id = $userid;    
                            $uh->status = 0;

                            $fetched_post->user_question_help = $uh;
                     }   
                       
					 $fetched_post->user_attempt = QuestionAttempt::find_by_userid($userid, $apost->question_id, $apost->subject_id);  
					   
					 $fetched_post->friends_attempt = QuestionAttempt::find_friends_attempts($userid, $apost->question_id, $apost->subject_id);  
					   
                     $subject = Subject::find_by_name($fetched_post->question->subject);
                     $fetched_post->subject = $subject;
                   }
                   else if($apost->getPostType()=='D'){
                     $fetched_post->discussion = $apost->getPostDiscussion();
                     $fetched_post->question = "";
                     $fetched_post->subject = "";
                     $fetched_post->question_interaction = "";
                     $fetched_post->user_question_help = "";
                   }

                     $fetched_post->comments = $apost->getPostComments(20,$userid,$type);
                     if(!empty($fetched_post->comments)){
                        $fetched_post->comments_user_info = $apost->getCommentsUserInfo($fetched_post->comments);
                     }
                     $fetched_post->postid = $postid;
                     $fetched_post->owner = 1;
                     $fetched_post->lastviewed = $value->view_date; 
                     $fetched_post->datecreated = $apost->getPostDate();

                     self::$alluserposts[self::$acount] = $fetched_post; 

                     //echo json_encode($this->alluserposts[$this->acount]);
                     self::$acount++;
                 }          
                  
           }     
         }
     }
    
     public static function removeDuplicates($array){ 
        
          $result = array_map("unserialize", array_unique(array_map("serialize", $array)));

          foreach ($result as $key => $value)
          {
            if ( is_array($value) )
            {
              $result[$key] = removeDuplicates($value);
            }
          }
         
          return $result;
     }
    
     public static function array_sort_lastviewed($array){

         $temp = null;
         
        for($i=0;$i<count($array);$i++){
            
           for($j=0;$j<count($array);$j++){
               
               if($array[$i]->lastviewed>$array[$j]->lastviewed){
                  $temp = $array[$j];
                  //swap the two between each other
                  $array[$j] = $array[$i];
                  $array[$i]=$temp;
               }
           }
        }

        return $array;
         
    }
     
     public static function array_sort_created($array){

         $temp = null;
         
        for($i=0;$i<count($array);$i++){
            
           for($j=0;$j<count($array);$j++){
               
               if($array[$i]->datecreated>$array[$j]->lastviewed){
                  $temp = $array[$j];
                  //swap the two between each other
                  $array[$j] = $array[$i];
                  $array[$i]=$temp;
               }
           }
        }

        return $array;
         
     }
     
}

?>