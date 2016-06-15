<?php
   require_once '../../includes/LLHPosts.php';
   require_once '../../includes/Subjects.php';
   require_once '../../includes/Dates.php';   
   require_once '../../includes/Posts.php';
   require_once '../../includes/Questions.php';   
   require_once '../../includes/QuestionInteraction.php';

   if(isset($_POST['submit'])){
     $subject = trim($_POST['subject']);
     $question_number  = trim($_POST['question']);
     $department  = trim($_POST['department']);
     
     $sub = Subject::find_by_name($subject);   
     
     if($sub!=false){   
         echo  "subject found";
         $subject_id = $sub->id;
         $user_id = 1;
         $user_type = "L";
         $discussion_id = 0;
         $post_type = "Q";
         
         $question = Questions::find_by_id($question_number,$subject);
         
         if($question!=false){
             echo  "question found";
             $post = Posts::make($subject_id, $question_number, $user_id, $user_type, $discussion_id, $post_type); 
             
             if($post!=false){
                if($post->createPost()){ 
                     echo "post created";
                     $llhpost = new LLHPost();

                          $llhpost->post_id = $post->post_id;
                          $llhpost->department = $department;
                          $llhpost->view_date = Dates::getCurrentDateTime();

                     if($llhpost->create()!=false){
                         
                          $qi_exists = QuestionInteraction::find_by_question_subject($question_number, $subject_id);
                 
                          if($qi_exists==false){

                             $qi = QuestionInteraction::make($question_number, $subject_id);

                             if($qi){
                                 $qi->create();
                             }
                          }
                         
                         echo "llh created";
                     }
                     else{
                         echo  "err5";
                     }
                }
                else{
                    echo  "err4";
                }
             }
             else{
                echo  "err3";
             }
         }
         else{
             echo  "err2";
         }
        
     }
     else{
             echo  "err1";
         }
       
     echo $subject;
   }
   else{
       $subject = "";
       $department = "";
       $question_number = 0;
   }

   if(isset($_POST['clear'])){
       $subject = "";
       $department = "";
       $question_number = 0;
   }

?>

<!doctype html>
<html ng-app="geniuses">
  <head>
      <link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Roboto:300,400,500,700" type="text/css">
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
          .post-info-div{
              margin-left: 100px;
          }
          .post-info-div div{
              margin-bottom: 20px;
          }
          .abtn{
            display: block;
            margin-left: auto;
            margin-right: auto;
            background-color: rgb(0,0,0);
            background-color: rgb(0,0,0);
            border: 0px solid white;
            margin-bottom: 10px;
            color: white;
          }
          
          .geniusesbar{
            padding-top: 9px;
            height: 60px;
            background-color: black;
            color: white;
            margin-bottom: 0px;
        }
        
         #geniuses-text{
             color: dodgerblue;
             padding-top: 30px;
             display:inline;
          }
          
        .geniuses{
            height: 100%;
            padding-top: 5px;
        }
        
          #geniuses-logo-img{
              margin-top: 0px;
              padding-top: 0px;
              display:inline;
              margin-bottom: 12px;
          }
          
           .dropdown{
                display: block;
          }

          .icon-bar{
              background-color:white;
          }
          
           
            .butn {
          -webkit-border-radius: 80;
          -moz-border-radius: 80;
          border-radius: 80px;
          font-family: Arial;
          width: 34px;
          color: #ffffff;
          font-size: 15px;
          padding: 7px;
          background: #8f0000;
          text-decoration: none;
          border: 0px solid white;
          text-align: center;
          margin-right: 20px;
          margin-left: auto;
          margin-top: 4px;
        }

        .butn:hover {
          background: #cc0202;
          text-decoration: none;
        }
          
          #img-button{
             margin-top: 0px;
             display: inline;
             padding-top: 0px;
             background-color: rgb(255,255,255);
             background-color: rgba(0,0,0,0);
             border: 0px solid white;  
             align-content: center;  
          }
          
          #profileimage{
              display: inline;
              margin-top: 0px;
          }
          
          #top-nav-user-name{
              display: inline;
              padding-left: 5px;
              padding-top: 5px;
          }
          
          .caret{
              margin-left: 3px;
          }
      </style>
  </head>
  <body>
      
      
<div class="geniusesbar top-navi-bar" role="navigation">
  <div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    
      
    <!-- Collect the nav links, forms, and other content for toggling -->
     <div class="pull-left geniuses">
            <h2 id="geniuses-text"><b>GENIUSES</b></h2>
            <img id="geniuses-logo-img" src="logo new.png">
     </div>      
      
     <div class="pull-right"> 
         
        <div class="dropdown pull-right">
            <h4>Admin</h4>
        </div>    
     </div> 
  </div><!-- /.container-fluid -->
</div>  
      
      
      
      <h2 class="text-center">Post as Team LLH</h2>
    
      <form action="PostQuestion.php" method="post">
          <div class="row post-info-div">
            <div class="col-md-12 pull-left">
                <h4>Subject</h4>
                <input type="text" name="subject" value="<?php echo $subject; ?>"/>
            </div> 
            <div class="col-md-12 pull-left">
                <h4>Department</h4>
                <input type="text" name="department" value="<?php echo $department; ?>"/>
            </div>   
            <div class="col-md-12 pull-left">
                <h4>Question Number</h4>
                <input type="number" name="question" value="<?php echo $question_number; ?>"/>
            </div>  
            <div class="col-md-12 pull-left">
                <button class="abtn" type="submit" name="submit" value="post">post to Geniuses</button>
                <button class="abtn" type="submit" name="clear" value="post">clear</button>
            </div> 
            
          </div>      
      </form>
  </body>
</html>

