<?php
 require_once '../../includes/User.php';
 require_once '../../includes/MyJWT.php';
 require_once '../../includes/Database.php';
 require_once '../../includes/HandleUserRequests.php';
 
 function respond($status, $new_atoken, $new_rtoken, $itoken, $dat){
    $response['at'] = $new_atoken; 
    $response['rt'] = $new_rtoken; 
    $response['it'] = $itoken;
    $response['status'] = $status;  
    $response['data'] = $dat;  
    
    echo json_encode($response);
  }

 if($_SERVER['REQUEST_METHOD']=="POST"){
     $data = json_decode(file_get_contents("php://input"));
     
     $method = htmlentities($data->method);
     
     switch($method){
         case "checkUserExists":
             
             $fbid = htmlentities($data->id);
             $fname = htmlentities($data->fname);
             $lname = htmlentities($data->lname);
             $age_range = htmlentities($data->age_range);
             $pic_url = htmlentities($data->pic_url);
             $gender = htmlentities($data->gender);
             $email = htmlentities($data->email);
             
             try{
                 if(!empty($fbid)&&$fbid!='undefined'&&$fbid!=null){
                    $user = User::find_by_fbid($fbid);
                    
                    $ajwt = MyJWT::getAccessToken($user);
                    $rjwt = MyJWT::getRefreshToken();      
                     
                    if($user!=false&&$user->fbid == $fbid){//if user with $fbid exists
                       
                        $useraltered = false;
    
                        if($user->firstname==""||$user->firstname==null){
							if($fname!=""&&$fname!=null){
                                $user->firstname = $fname;
                                $useraltered = true;
							}
                        }
                        if($user->lastname==""||$user->lastname==null){
							if($lname!=""&&$lname!=null){
                                $user->lastname = $lname;
                                $useraltered = true;
							}
                        }
                        if($user->age_range==""||$user->age_range==null){
							if($age_range!=""&&$age_range!=null){
                                $user->age_range = $age_range;
                                $useraltered = true;
							}
                        }
                        if($user->picture_url==""||$user->picture_url==null){
							if($pic_url!=""&&$pic_url!=null){
                                $user->picture_url = $pic_url;
                                $useraltered = true;
							}
                        }
                        if($user->gender==""||$user->gender==null){
							if($gender!=""&&$gender!=null){
                                $user->gender = $gender;
                                $useraltered = true;
							}
                        }
                        if($user->email==""||$user->email==null){
							if($email!=""&&$email!=null){
								$user->email = $email;
                                $useraltered = true;	
							}
                        }
						if($user->phone_number==""||$user->phone_number==null||$user->phone_number=="undefined"||$user->phone_number=="null"){
								$user->phone_number = null;
						}
						
                        if($useraltered == true){ 
                            $user->update();
                        }
                        
                        if($user->username!=""&&$user->username!=null){//if user has a user name
                            HandleUserRequests::setUserOnline($user->id, "S");
                            respond("OK", $ajwt, $rjwt, false, false);
                        }
                        else{
                            respond("U", false,false, false, $user->id);  
                        }
                    }
                    else{
                            $activation=md5($fbid.time());
                            
                            $auser = new User();
                            $auser->initialize($fbid, null, null ,$fname,$lname, $gender, $age_range, $email, null, null , null, null, null, null, $pic_url, $activation, null);
							
                            if($auser->create()){
                                respond("U", false, false, false, $auser->id);
                            }
                            else{
                                respond(false, null, null, false, false);
                            }
                    }
                 }  
                 else{
                     respond(false, null, null, false, false);
                 }
             }
             catch(Exception $e){
                 respond(false, null, null, false, false);
             }
             break;
             
             case "UpdateProfileAll":
                 global $database;
                 
                 $un = $database->escape_value($data->username);
                 $uid = $database->escape_value($data->user_id);
                 $sclass= $database->escape_value($data->sclass);
                 $school = $database->escape_value($data->school);
                 $dep = $database->escape_value($data->department);
			 	 $phone = $database->escape_value($data->phone);
             try{
                    $user = User::find_by_id($uid);
                    $nameuser = User::find_by_username($un);
                    
                    if($user!=false){
                        if($nameuser==false){
                            $user->username = $un;
                            $user->sclass = $sclass;
                            $user->school = $school;
                            $user->department = $dep;
							$user->phone_number = $phone;
                            
                            if($user->update()){
                                HandleUserRequests::setUserOnline($user->id, "S");

                                $user->password = null;
                                
                                $ajwt = MyJWT::getAccessToken($user);
                                $rjwt = MyJWT::getRefreshToken(); 

                                respond("OK", $ajwt, $rjwt, false, false);
                            }
                            else{
                                respond(false, null, null, false, false);
                            }
                            
                        }
                        else{
                            respond("U", null, null, false, false);
                        }
                    }
                    else{
                        respond(false, null, null, false, "EX");
                    }
             }
             catch(Exception $e){
                respond(false, null, null, false, false);
             }     
             
             break;
     }
     
 }
 else{
    
 }
 
?>