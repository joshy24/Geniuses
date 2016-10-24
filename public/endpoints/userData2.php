<?php
   require_once '../../includes/HandleUserRequests.php';
   require_once '../../includes/jwt_helper.php';
   require_once '../../includes/Discussion.php';
   require_once '../../includes/Database.php';
   require_once '../../includes/User.php';
   require_once '../../includes/Friends.php';
   require_once '../../includes/Subjects.php';
   require_once '../../includes/Questions.php';
   require_once '../../includes/MyJWT.php';
   require_once '../../includes/mail/SendMail.php';
   require_once '../../includes/School.php';
   require_once '../../includes/QuestionAttempt.php';


function respond($data, $nt, $at, $it){
    $response['data'] = $data;
    $response['at'] = $at; 
    $response['nt'] = $nt; 
    $response['it'] = $it;
    
    echo json_encode($response);
}

function respond_extra($data1, $data2, $nt, $at, $it){
    $response['data'] = $data1;
    $response['data1'] = $data2;
    $response['at'] = $at; 
    $response['nt'] = $nt; 
    $response['it'] = $it;
    
    echo json_encode($response);
}


if($_SERVER['REQUEST_METHOD']=="POST"){

   $data = json_decode(file_get_contents("php://input"));

   global $database;       
    
   $method = $database->escape_value($data->method);
   
   $ajwt = $database->escape_value($data->at);
   $rjwt = $database->escape_value($data->rt);  
    
   $user_id = 0; 
   $role = "";     
           
   if(!empty($ajwt)&&!empty($rjwt)&&!empty($method)){
       
    $ajwt_valid=null;   
    $rjwt_valid=null;   
       
    $valid = false;   
       
       try{
        $secret_key = base64_decode(getenv('HTTP_POST_KEY'));   
       
        $ajwt_valid = JWT::decode($ajwt, $secret_key, false);     
        $rjwt_valid = JWT::decode($rjwt, $secret_key, false);
       }
       catch(Exception $e){
           
       }
       
       if(!empty($ajwt_valid)&&$ajwt_valid!=null&&!empty($rjwt_valid)&&$rjwt_valid!=null){
           $user_id = $ajwt_valid->user->id;   
           
           $role = $ajwt_valid->role;  
           
           $aexp = $ajwt_valid->exp;
           $rexp = $rjwt_valid->exp;
           
           $is_atnew = null;  // true|false|null
           $new_atoken = null;  //token|null|false
           
           if($role=="student" && $user_id>0){
               if($rexp>time()){//checks if refresh token has expired
                   if($aexp>time()){
                       //access token has not expired so nothing needs to be done
                       $is_atnew = false;
                       $new_atoken = false;    
                   }
                   else{//access token has expired and needs to be replaced. 
                       $user = User::find_by_id($user_id);
                       $user->password = "";
                       
                       $is_atnew = true;
                       $new_atoken = MyJWT::getAccessToken($user);
                   }
                   
                     switch($method){

                         //get Userposts   **********************************************************    
                        case "getAllPosts":

                               $number = $database->escape_value($data->post_count);

                               $data =  HandleUserRequests::getAllUserPosts($user_id, "S", "Science", $number);
                             
                               $response = false;
                             
                               if($data!=false){     
                                  $response = $data; 
                               }

                               respond($response, $is_atnew, $new_atoken, false);
                           break;      

                         //post question     
                        case "postQuestion":

                        try{     
                           $name = htmlentities($data->subject_name);             
                           $qid = htmlentities($data->question_id);    

                           $subject = Subject::find_by_name($name);     

                           $subject_id = $subject->id;       

                           $result = HandleUserRequests::makeQuestionPost($subject_id, $qid, $user_id, "S"); 

                           $response = false;    

                           if(is_int($result)){

                                if($result>0){   
                                   $qpost = HandleUserRequests::FetchPost($result,$user_id,"S");

                                   if($qpost!=false){
                                      $response = $qpost;  
                                   }

                                }
                                else{

                                }   

                           }     
                           else if($result=="U"){
                               $response = "U"; 
                           }   
                           else if($result=="F"){
                               $response = "F"; 
                           }   
                           else{
                              $response = false;  
                           }        

                           respond($response, $is_atnew, $new_atoken, false);  

                        }catch(Exception $e){
                           respond(false, $is_atnew, $new_atoken, false);
                        }

                           break;     

                         //post discussion ***************************************************************         
                        case "postDiscussion":
                           $discussion = $data->discussion;

                               $discuss = Discussion::make($user_id,"S",$discussion);
                               if($discuss!=false){
                                if($discuss->createDiscussion()){

                                  $new_post_id = HandleUserRequests::makeDiscussionPost($discuss->discussion_id, $user_id, "S");
                                     if($new_post_id!=false){
                                         $discussionpost = HandleUserRequests::FetchPost($new_post_id, $user_id,"S");

                                         if($discussionpost!=false&&$discussionpost!=null){
                                             respond($discussionpost, $is_atnew, $new_atoken, false);
                                         }
                                         else{
                                             respond(false, $is_atnew, $new_atoken, false);
                                         }

                                     }
                                     else{
                                         respond(false, $is_atnew, $new_atoken, false);
                                     }
                                   }
                                   else{
                                       respond(false, $is_atnew, $new_atoken, false);
                                   }
                               }
                               else{
                                   respond(false, $is_atnew, $new_atoken, false);
                               } 
                           break;  

                        //update profile ***************************************************************************
                        case "updateProfile":
						  global $database;

						  $uid = $database->escape_value($user_id);
						  $user = User::find_by_id($uid);

						  if($user!=false){
							   $un = $database->escape_value($data->username);
							   $user->username = !empty($un) ? $un : $user->username;

							   $fn = $database->escape_value($data->firstname);
							   $user->firstname = !empty($fn) ? $fn : $user->firstname;

							   $ln = $database->escape_value($data->lastname);
							   $user->lastname = !empty($ln) ? $ln : $user->lastname;

							   $em = $database->escape_value($data->email);
							   $user->email = !empty($em) ? $em : $user->email;

							   $cls = $database->escape_value($data->aclass);
							   $user->sclass = !empty($cls) ? $cls : $user->sclass;

							   $dep = $database->escape_value($data->department);
							   $user->department = !empty($dep) ? $dep : $user->department;

							   $fav = $database->escape_value($data->fav_subject);
							   $user->fav_subject = !empty($fav) ? $fav : $user->fav_subject;

							   $abt = $database->escape_value($data->about);
							   $user->about = !empty($abt) ? $abt : $user->about;

							   $pn = $database->escape_value($data->phone_number);
							   $user->phone_number = !empty($pn) ? $pn : $user->phone_number;

							   if($user->update()){
								   $user->password = "";

								   $is_atnew = true;
								   $new_atoken = MyJWT::getAccessToken($user);   

								   respond(false, $is_atnew, $new_atoken, false);
							   }
							   else{
								   respond(false, $is_atnew, $new_atoken, false);
							   }
						  }
						  else{
							  respond(false, false, false, false);
						  }
                          break;

                        //make a comment **************************************************************************     
                       case "postComment":
                             $comment = $data->comment;
                             $post_id = $data->post_id;
                             $owner_id = $data->owner_id;
                             $owner_type = $data->owner_type;
                             $user_type = $data->user_type;

                             try{
                                 $comment = HandleUserRequests::makeCommentOnPost($user_id,$post_id,$owner_id, $owner_type, $user_type,$comment);
                                 if(!empty($comment)&&$comment!=false){
                                     respond($comment, $is_atnew, $new_atoken, false);
                                 }     
                                 else{
                                     respond(false, $is_atnew, $new_atoken, false);
                                 }
                             }
                             catch(Exception $e){
                                     respond(false, $is_atnew, $new_atoken, false);
                             }
                             break;

                         case "getUsersByName" :
                            $fname = $data->firstname;
                            $lname = $data->lastname;
                            $offset = $data->offset;

                            $result = null; 

                            if(!empty($fname)&&!empty($lname)){
                              $result = User::find_by_FLname($user_id, $fname,$lname,$offset);
                            }
                            else if(!empty($fname)&&empty($lname)){
                              $result = User::find_by_name($user_id, $fname, $offset);
                            } 
                            else if(!empty($lname)&&empty($fname)){
                              $result = User::find_by_name($user_id, $lname, $offset);
                            }
                            else{
                                echo false;
                            }

                            if($result!=null&&$result!=false&&!empty($result)){
                               $result[0]->password = "";
                               respond($result, $is_atnew, $new_atoken, false);
                            }
                            else{
                               respond(false, $is_atnew, $new_atoken, false);
                            }
                             
                            break;
                         case "sendFriendRequest" :
                             $fid = $user_id;
                             $ft = $data->from_type;
                             $tid = $data->to_id;
                             $tt = $data->to_type;

                             $response = HandleUserRequests::makeFriendRequest($fid, $ft,  $tid, $tt);

                             $value = false;
                             
                             if($response!=false){
                                $value = $response;
                             }
                                 
                             respond($value, $is_atnew, $new_atoken, false);

                             break;
                         case "sendBatchRequests" :
                             
                             $fid = $user_id;
                             $ft = $data->from_type;
                             $to_ids = $data->request_ids;
                             
                             $req_count = count($to_ids);
                             
                             $successcount = 0;
                             
                             if($req_count>0){
                                 for($y=0;$y<$req_count;$y++){
                                     $tid = $to_ids[$y];
                                     $tt = "S";
                                     
                                     try{
                                         HandleUserRequests::makeFriendRequest($fid, $ft,  $tid, $tt);
                                         $successcount+=1;
                                     }
                                     catch(Exception $e){
                                         $successcount = $successcount==0? 0: $successcount-1;
                                     }
                                 }
                             }
                             
                             $value = null;
                             
                             if($successcount==$req_count){
                                 $value = true;
                             }
                             else{
                                 $value = false;
                             }
                             
                             respond($value, $is_atnew, $new_atoken, false);
                             
                             break;
                         case "getFriendRequests" :   

                             $sent = Request::findSentRequests($user_id);
                             $received = Request::findReceivedRequests($user_id);

                             $asent = null;
                             $areceived= null;

                             if($sent!=false){
                                 $asent = $sent;
                             }
                             if($received!=false){
                                 $areceived = $received;
                             }

                             respond_extra($asent, $areceived, $is_atnew, $new_atoken, false);
                             
                             break;
                         case "userRequestResponse":
                             $action = $data->action;
                             $request_id = $data->request_id;

                             $response = null;

                             $result = HandleUserRequests::respondToRequest($request_id, $action);

                             if($result!=false){
                                 $response = $result;
                             }

                             respond($response, $is_atnew, $new_atoken, false);

                             break;
                         case "getFriends":
                             $type = $data->user_type;
                             $offset = $data->offset;

                             $friends = Friends::getAllFriendsData($user_id, $type, $offset);

                             $response = null;

                             if($friends!=false){
                                 $response = $friends;
                             }

                             respond($response, $is_atnew, $new_atoken, false);
                             
                             break;

                         case "getUser":
                             $friend_id = $data->find_id;
                             $friend_type = $data->find_type;
                             $user_type = $data->user_type;

                             $user = User::find_by_id($friend_id);
                             $friend = Friends::isFriend($user_id,$user_type, $friend_id, $friend_type);

                             $auser = null;
                             $afriend = null;

                             if($user!=false){
                                 $user->password = "";
                                 $auser = $user;
                             }

                             if($friend!=false){
                                 $afriend = $friend;
                             }

                             respond_extra($auser, $afriend, $is_atnew, $new_atoken, false);
    						 
                             break;
                         case "getSubjects":
                             $st = Subject::find_subjects_and_topics();

                             $response = false;

                             if($st!=false){
                                 $response = $st;
                             }

                             respond($response, $is_atnew, $new_atoken, false);
                             
                             break;
                         case "getQuestions":

                             if($data->exam_option=="custom"){
                                 $subject = $data->subject;
                                 $aclass = $data->aclass;
                                 $number = $data->number;
                                 $exam_type = $data->exam_type;
                                 $topics = $data->topics;


                                 $result = Questions::find_exam($subject, $number, $aclass, $topics, $exam_type);

                                 $response = false;

                                 if($result!=false){
                                    $response = $result;
                                 }

                                 respond($response, $is_atnew, $new_atoken, false);
                             }
                             if($data->exam_option=="year"){
                                 $subject = $data->subject;
                                 $exam_type = $data->exam_type;
                                 $year = $data->year;

                                 $result = Questions::find_exam_year($subject, $exam_type, $year);

                                 $response = false;

                                 if($result!=false){
                                    $response = $result;
                                 }

                                  respond($response, $is_atnew, $new_atoken, false);
                             }

                             break;
                         case "getLatestCommentsOnPost":

                             $cd = $data->comment_date;
                             $pid = $data->post_id;
                             $result = HandleUserRequests::getLatestCommentsOnPost($pid,$cd,$user_id,"S");

                             $response= $result;

                             respond($response, $is_atnew, $new_atoken, false);

                             break;
                         case "getOnlineUsers":
                             $result = Friends::getFriendsOnline($user_id, "S", 30);

                             $response = $result;

                             respond($response, $is_atnew, $new_atoken, false);

                             break;
                         case "LogUserOut":
                             HandleUserRequests::setUserOffline($user_id, "S");
                              //at this point we make the current token invalid;
                             $response = $result;

                             respond($response, null, null, false);
                             
                             break;
                         case "sendMail":
							 $user_name = $data->name;
							 
							 $from = "info@geniusesafrica.com";
							 $to = "info@geniusesng.com";
							 $name = $user_name;
                             $subject=$data->subject;
                             $body=$data->msg;
							 
                             $result = Send_Mail($from,$to,$subject,$body,$name);

                             respond($result, $is_atnew, $new_atoken, false);
                             
                             break;
                             
                         case "uploadImage":
                           
                             define('UPLOAD_DIR', '../upload/');
                             
                             $img = $data->image;

                             if(stristr($img,"/png")){
                                $img = str_replace('data:image/png;base64,', '', $img);
                                $img = str_replace(' ', '+', $img);
                                $data = base64_decode($img);
                                $time_now = time(); 
                                $file = UPLOAD_DIR . $user_id .$time_now.'S.png';
                                $success = file_put_contents($file, $data);

                                if($success){
                                    $user = User::find_by_id($user_id);
                                    
                                    $pic_url = 'upload/'.$user_id.$time_now.'S.png';
                                    
                                    if($user->picture_url!=$pic_url){
                                        $user->picture_url = $pic_url;
                                    
                                        if($user->update()){
                                            $user->password = "";

                                            $is_atnew = true;
                                            $new_atoken = MyJWT::getAccessToken($user);   

                                            respond($pic_url, $is_atnew, $new_atoken, false);
                                        }
                                        else{
                                            respond(false, $is_atnew, $new_atoken, false);
                                        }
                                    }
                                    else{
                                        respond($pic_url, $is_atnew, $new_atoken, false);
                                    }
                                    
                                }
                                else{
                                    respond(false, $is_atnew, $new_atoken, false);
                                }
                             }
                             if(stristr($img,"/jpeg")){
                                $img = str_replace('data:image/jpeg;base64,', '', $img);
                                $img = str_replace(' ', '+', $img);
                                $data = base64_decode($img);
                                $time_now = time(); 
                                $file = UPLOAD_DIR . $user_id .$time_now.'S.jpg';
                                $success = file_put_contents($file, $data);

                                if($success){
                                    $user = User::find_by_id($user_id);
                                    
                                    $pic_url = 'upload/'.$user_id.$time_now.'S.jpg';
                                    
                                    if($user->picture_url!=$pic_url){
                                        $user->picture_url = $pic_url;

                                        if($user->update()){
                                            $user->password = "";

                                            $is_atnew = true;
                                            $new_atoken = MyJWT::getAccessToken($user);   

                                            respond($pic_url, $is_atnew, $new_atoken, false);
                                        }
                                        else{
                                           respond(false, $is_atnew, $new_atoken, false);
                                        }    
                                    }
                                    else{
                                        respond($pic_url, $is_atnew, $new_atoken, false);
                                    }
                                    
                                }
                                else{
                                    respond(false, $is_atnew, $new_atoken, false);
                                }
                             }
                             
                             
                             break;
                         case "editComment":
                              $comm = $data->comment;
                              $comm_id = $data->comment_id;
                             
                              $result = HandleUserRequests::editComment($comm_id,$comm,$user_id);
                             
                              respond($result, $is_atnew, $new_atoken, false);
                             
                              break;
                         case "editDiscussion":
                              $dis = $data->discussion;
                              $did = $data->discussion_id;
                              
                              $result = HandleUserrequests::editDiscussion($did, $dis, $user_id);
                              
                              respond($result, $is_atnew, $new_atoken, false);
                              
                              break;
                         case "getPost":
                              $post_id = $database->escape_value($data->post_id);

                              if($post_id!=null&&$post_id!='undefined'){
                                 $post = HandleUserRequests::FetchPost($post_id, $user_id,"S");

                                 if($post!=false){
                                     respond($post, $is_atnew, $new_atoken, false);
                                 }    
                                 else{
                                    respond(false, $is_atnew, $new_atoken, false);
                                 }    
                              }
                              else{
                                  respond(false, $is_atnew, $new_atoken, false);
                              }
                              
                              break;
                         case "setHelpful":
                              $pid = $data->post_id;
                              $op = $data->operation;
                              $result = HandleUserRequests::setUserHelpful($pid,$user_id,$op);
                              
                              respond($result, $is_atnew, $new_atoken, false);
                              break;
                         case "incrementViewCount":
                              $pid = $data->post_id;
                              $result = HandleUserRequests::incrementViewsCount($pid);
                             
                              respond($result, $is_atnew, $new_atoken, false);
                              break;
                         case "incrementShareCount":
                              $pid = $data->post_id;
                              $result = HandleUserRequests::incrementShareCount($pid);
                             
                              respond($result, $is_atnew, $new_atoken, false);
                              break;
                         case "getSchools":
                              $schools = School::find_all();
                              
                              respond($schools, $is_atnew, $new_atoken, false);
                              break;
                         case "getSearchSchools":
                              $skul = $data->school;
                              $lim = $data->limit;
                              
                              $result = User::find_User_by_School($skul,$lim, $user_id);
                              
                              respond($result, $is_atnew, $new_atoken, false);
                             
                              break;
						 case "deleteUser":
							  $user  = User::find_by_id($user_id);
							  $result = $user->deleteUser();
							 
							  respond($result, $is_atnew, $new_atoken, false);
							  break;
						 case "AttemptQuestion":
							  $comment = $data->comment;
							  $quid = $data->question_id;
							  $subid = $data->subject_id;
							  $attempt = $data->attempt; 
							  $post_id = $data->post_id;
                              $owner_id = $data->owner_id;
                              $owner_type = $data->owner_type;
                           	  
                              try{
                                 $comment = HandleUserRequests::makeCommentOnPost($user_id,$post_id,$owner_id, $owner_type, "S", $comment);
                                 if(!empty($comment)&&$comment!=false){
									 
									 $qa = QuestionAttempt::initialize($user_id, $comment->comment_id, $attempt, $quid, $subid);
									 
									 if($qa->create()){
										 respond($qa, $is_atnew, $new_atoken, false);	
									 }
									 else{
										 respond($comment, $is_atnew, $new_atoken, false);	
									 }
                                 }     
                                 else{
                                     respond(false, $is_atnew, $new_atoken, false);
                                 }
                              }
                              catch(Exception $e){
                                     respond(false, $is_atnew, $new_atoken, false);
                              }
							  
							  break;
                     }//end of switch #########################################################
                     
               }
               else{
                    //both tokens need replacement. which will occur when the user logs in again.
                    respond(false, null, null, false);
               }
           }
           else{
              respond(false, null, null, true);
           }
       }
       else{
         respond(false, null, null, true);
       }
       
   }
   else{
        respond(false, null, null, true);
   }
    
}
else{ 
   
}

?>