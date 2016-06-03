<?php

function Send_Mail($from,$to,$subject,$body,$name){
		require 'PHPMailer/class.phpmailer.php';
		require 'PHPMailer/class.smtp.php';
	
		$mail = new PHPMailer();
		//Enable SMTP debugging. 
		//$mail->SMTPDebug = 3;                               
		//Set PHPMailer to use SMTP.
		$mail->isSMTP();            
		//Set SMTP host name                          
		$mail->Host = "smtp-relay.gmail.com";
		//Set this to true if SMTP host requires authentication to send email
		$mail->SMTPAuth = true;                          
		//Provide username and password     
		$mail->Username = "info@geniusesafrica.com";                 
		$mail->Password = "Margaret_9";                           
		//If SMTP requires TLS encryption then set it
		$mail->SMTPSecure = "tls";                           
		//Set TCP port to connect to 
		$mail->Port = 587;                                   

		$mail->From = "info@geniusesafrica.com";
		$mail->FromName = $name;

		$mail->addAddress($to, $name);

		$mail->isHTML(true);

		$mail->Subject = $subject;
		$mail->Body = $body;
		$mail->AltBody = "This is the plain text version of the email content";

		if(!$mail->send()) 
		{
			//echo "Mailer Error: " . $mail->ErrorInfo;
			return false;
		} 
		else 
		{
			return true;
		}
		
}
?>