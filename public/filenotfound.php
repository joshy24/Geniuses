<?php

?>

<!doctype html>
<html>
  <head>
      <link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Roboto:300,400,500,700" type="text/css">
      <link href="main.css" rel="stylesheet"> 
      <title>Geniuses</title>
      
      <link rel="stylesheet" href="vendor/bootstrap.min.css">
      <!--<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">-->
      
      <link rel="stylesheet" href="vendor/bootstrap-theme.min.css">
      <!--<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap-theme.min.css">-->
      
      <style>
      
          #goto{
              background-color: rgba(0,0,0,0);
              border: 0px solid white;
          }
          
          #goto:hover{
              color:dodgerblue;
          }
      
      </style>
      
  </head>     
    <h5 class="text-center">The url you are looking for does not exist</h5>
      
    <button style="display:block; margin-left:auto; margin-right:auto;" id="goto">Go to SIGN UP/SIGN IN page</button>
    
   <h5>      
      
   <script src="vendor/jquery-2.1.4.js"></script>
     
   <script>
     $('#goto').click(function(){
         window.location.assign("index.html");    
     });
   </script>          
       
    <!--   <script src="http://code.jquery.com/jquery-2.1.4.min.js"></script>
      
    Latest compiled and minified JavaScript -->
    <script src="vendor/bootstrap.min.js"></script>
    <!--<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script> -->
  </body>      
</html>       