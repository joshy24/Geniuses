<?php 
require "../../includes/mail/is_email.php";

	$subject = "";

	if(isset($_POST['submit'])){
		
			$mail = $_POST['mail'];

			if(is_email($mail)){
				$subject = "valid mail";
			}
			else{
				$subject = "rubish mail";
			}
	 }
	 else{
		 
	 }
?>

<!doctype html>
<html>
	<head>
		<title>Test Email</title>
		
		<link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Roboto:300,400,500,700" type="text/css">
        <link rel="stylesheet" href="../vendor/bootstrap.min.css">
        <link rel="stylesheet" href="../vendor/bootstrap-theme.min.css">
	</head>
	<body>
		<div class="test-div">
			<div class="container">
				<form method="post" action="#">
					<h4 class="text-center">Enter an email address</h4>
					<input type="text" name="mail"/>
					<?php echo $subject; ?>
					<button class="abtn" type="submit" name="submit" value="post">test email</button>
				</form>
			</div>
		</div>
	</body>
</html>