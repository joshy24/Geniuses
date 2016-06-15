<?php
include '../../includes/Database.php';
include '../../includes/User.php';
include '../../includes/mail/SendMail.php';

$msg='';

if(!empty($_GET['code']) && isset($_GET['code'])){
   
    $code=$database->escape_value($_GET['code']);
	
    $user=User::find_by_code($code);
	
    if($user!=false){
        if($user->status==0){
            $user->status = 1;
            if($user->update()){
                $msg = 'Your Account has been successfully activated <br/><br/> <a href="https://www.geniusesafrica.com">Login Now!</a>';
            }
            else{
                $msg = "An Error occurred activating your account. please follow the link that was sent to your email address";
            }
        }
        else{
            $msg = 'Your account is already active.<br/><br/> <a href="https://www.geniusesafrica.com">Login Now!</a>';
        }
    }
    else{
        $msg ="Wrong activation code.";
    }

}
else{
   $msg = "An Error occurred activating your account. please follow the link that was sent to your email address";
}
?>

<!doctype html>
<html ng-app="geniuses">
  <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=650">
      <link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Roboto:300,400,500,700" type="text/css">
     
      <title>Geniuses</title>
      
      <link rel="stylesheet" href="../vendor/bootstrap.min.css">
      <link rel="stylesheet" href="../vendor/bootstrap-theme.min.css">
      
      <style>
          #geniuses-text{
              margin-top: 10px;
              color: dodgerblue;
          }
          #geniuses-logo-img{
              margin-top: 12px;
          }
          .top-div{
              background-color: black;
              height: 55px;
          }
      </style>
      
  </head>
  <body>
      
      <div class="top-div" ng-controller="TopAppController">      
        <nav class="navbar" role="navigation">
          <div class="container-fluid">
            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header">
              <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
              </button>
            </div>

            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
              <ul class="nav navbar-nav">
                 <li class="pull-left"><h2 id="geniuses-text"><b>GENIUSES</b></h2></li>
                 <li class="pull-left"><img id="geniuses-logo-img" src="../img/logo new.png"></li>
              </ul>
            </div><!-- /.navbar-collapse -->
          </div><!-- /.container-fluid -->
        </nav>
        </div> 
      
      
      <div class="activation-div">
          <div class="row">
              <h2 class="text-center">Geniuses Activation</h2>
              <br/>  
              <h4 class="text-center"><?php echo $msg; ?></h4>
          </div>
          
      </div>
        
      
      
  </body>      
</html>
