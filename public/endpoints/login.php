<?php  
  require_once '../../includes/User.php';
  require_once '../../includes/MyJWT.php';
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

      $namemail = htmlentities($data->namemail);
      $password = htmlentities($data->password);

      try{     
       
       if( empty($namemail) || empty($password) ){
                 respond("EMP", null, null, false, false);
       }
       else{

          $user = User::authenticateMail($namemail, $password);

          if($user!=false){
             
                  if($user->status == 0){
                      //tell user to activate 
					  respond("ACT", false, false, false, false);
                  }
                  if($user->status == 1){
					  
					  $first_time = false;
					  
					  if($user->activation!="good"){
						  
						  $user->activation = "good";
						  
						  $user->update();
						  
						  $first_time = true;
					  }
					  else{
						  $first_time = false;	  
					  }
					  
					  HandleUserRequests::setUserOnline($user->id, "S");
					  
					  $user->password = "";
					  $user->fbid = "";
					  $user->status = "";
					  $user->phone_number = "";
					  
                      $ajwt = MyJWT::getAccessToken($user);
                      $rjwt = MyJWT::getRefreshToken();
					  
					  respond("OK", $ajwt, $rjwt, false, $first_time);
                  }
          }
          else{
              //failed
              $user = User::authenticateUser($namemail, $password);
              
              if($user!=false){  
                  
                  if($user->status == 0){
                      //tell user to activate 
					  respond("ACT", false, false, false, false);
                  }
                  if($user->status == 1){

					  $first_time = false;
					  
					  if($user->activation!="good"){
						  
						  $user->activation = "good";
						  
						  $user->update();
						  
						  $first_time = true;
					  }
					  else{
						  $first_time = false;
					  }

					  HandleUserRequests::setUserOnline($user->id, "S");
					  
					  $user->password = "";
					  $user->fbid = "";
					  $user->status = "";
					  $user->phone_number = "";
					  
                      $ajwt = MyJWT::getAccessToken($user);
                      $rjwt = MyJWT::getRefreshToken();
					  
					  respond("OK", $ajwt, $rjwt, false, $first_time);
					  
                  }
              }
              else{
                   respond("INV", null, null, false, false); 
              }
          }
        }
		  
      }
	  catch(Exception $e){
		   respond("ERR", null, null, false, false); 
	  }      
   }

?>