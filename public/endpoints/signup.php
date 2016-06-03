<?php 
  require_once '../../includes/User.php';
  require_once '../../includes/mail/SendMail.php';
  require_once '../../includes/mail/is_email.php';	

  $data = json_decode(file_get_contents("php://input"));
  
  $username = htmlentities($data->username);
  $password = htmlentities($data->password);
  $fname = htmlentities($data->firstname);
  $lname = htmlentities($data->lastname);
  $email = htmlentities($data->email);
  $skul = htmlentities($data->skul);  
  $klas = htmlentities($data->klas);
  $phone = htmlentities($data->phone);
 
  $api_response_code = array(
        0 => array('HTTP Response' => 400, 'Message' => 'Unknown Error'),
        1 => array('HTTP Response' => 200, 'Message' => 'Success'),
        2 => array('HTTP Response' => 403, 'Message' => 'HTTPS Required'),
        3 => array('HTTP Response' => 401, 'Message' => 'Authentication Required'),
        4 => array('HTTP Response' => 401, 'Message' => 'Authentication Failed'),
        5 => array('HTTP Response' => 404, 'Message' => 'Invalid Request'),
        6 => array('HTTP Response' => 400, 'Message' => 'Invalid Response Format')
  );
  
  $response['code'] = 0;
  $response['status'] = 404;
  $response['data'] = null;

  if(User::userExists($email)){
       $response['code'] = 4;
       $response['status'] = $api_response_code[ $response['code'] ]['HTTP Response'];
       $response['data'] = "E";
       echo json_encode($response); 
  }
  else{
      if(User::usernameExists($username)){
          $response['code'] = 4;
          $response['status'] = $api_response_code[ $response['code'] ]['HTTP Response'];
          $response['data'] = "U";
          echo json_encode($response); 
      }
      else{
          if(User::userPhoneExists($phone)){
			  $response['code'] = 4;
			  $response['status'] = $api_response_code[ $response['code'] ]['HTTP Response'];
			  $response['data'] = "P";
			  echo json_encode($response);
		  }
		  else{
			  if(is_email($email)){ 
				  try{
				  //success
				  $pass_hash = md5($password);
				  $activation=md5($email.time());
				  $user = new User();
				  $base_url = "https://www.geniusesafrica.com/activation/activation.php?code=";

				  $user->initialize(null, $username, $pass_hash,$fname,$lname, null, 0, $email,$klas,$skul, null, null, null, null, null, $activation, $phone);

					  if($user->create()){
						  $to=$email;
						  $subject="Email Verification";
						  $body='Hi, <br/> <br/> Thank you for signing up with us. <br/><br/>We make a promise to provide you with the best blend of education and social interaction. <br/> <br/> But first we need you to verify your registration information by following(clicking) the link below. <br/><br/> <a href="'.$base_url.$activation.'">'.$base_url.$activation.'</a>';
						  $from = "info@geniusesafrica.com";
						  $name = "The Geniuses Team";		  
						  
						  $result = Send_Mail($from,$to,$subject,$body,$name);
						  
						  if($result==true){
							  $response['code'] = 1;
							  $response['status'] = 200;
							  $response['data'] = "OK";
							  echo json_encode($response);
						  }
						  else{
							  $response['code'] = 1;
							  $response['status'] = 200;
							  $response['data'] = "EE";
							  echo json_encode($response);
						  }
					  }
					  else{
						  $response['code'] = 0;
						  $response['status'] = $api_response_code[ $response['code'] ]['HTTP Response'];
						  $response['data'] = null;
						  echo json_encode($response); 
					  }
				  }
				  catch(Exception $e){
					  $response['code'] = 0;
					  $response['status'] = $api_response_code[ $response['code'] ]['HTTP Response'];
					  $response['data'] = $e;
					  echo json_encode($response); 
				  }
		  	  }
			  else{
				   $response['code'] = 4;
				   $response['status'] = $api_response_code[ $response['code'] ]['HTTP Response'];
				   $response['data'] = "IE";
				   echo json_encode($response); 
			  }
		  }
      }
  }

?>