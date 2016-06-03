<?php 

 
 
 require_once 'Comments.php';
 require_once 'User.php';
 require_once 'FriendsPost.php';
 require_once 'mail/SendMail.php';
 require_once 'Questions.php';
 require_once 'QuestionInteraction.php';
 require_once 'School.php';
 require_once 'QuestionAttempt.php';


$result = QuestionAttempt::find_friends_attempts(27, 10, 5); 

echo json_encode($result); 
//echo json_encode($result[0]->password); 
/*$r = Questions::find_exam("physics", 10, "SS1", ["Measurement of Physical Quantities","Motion","Projectiles", "Forces", "Mass, Weight and Density", "Equilibrium of forces", "Work, Energy and Power"], "SSCE");

$result['q'] = $r;*/

//echo json_encode($result);

/*$array = array(
'Measurement of Physical Quantities',
'Motion',  
'Projectiles',
'Forces',      
'Mass, Weight and Density',
'Equilibrium of forces',
'Linear momentum',
'Work, Energy and Power',
'Properties of Matter',
'Elastic Properties of Solids',
'Simple Harmonic Motion',
'Pressure',
'Fluids at Rest and in Motion',
'Measurement of Temperature',
'Thermal Expansion of Solids and Liquids',
'The Gas Laws',
'Heat capacity',
'Change of State',
'Transfer of Thermal Energy',
'General Wave Properties',
'Light',
'Application of Light Waves',
'Sound',
'Gravitational Field',
'Electrostatics',
'Electric Field',
'Current Electricity',
'Magnetism',
'Electromagnetic Effects',
'Simple A.C. Circuits',
'Introductory Electronics',
'Radioactivity and The Nuclear Atom',
'Energy Quantisation',
'Wave-Particle Duality',
'Physics & the real World');


foreach($array as $value){
    $valueb = "[".$value."]";
    $sql = "UPDATE physics SET topic = '{$value}' WHERE topic = '{$valueb}'";
    $result = $database->query($sql);
    echo $result;
} 
     //$post = Posts::make(0, 31, "S", 121);
     //echo json_encode($post->createPost()); 
     //echo  json_encode(User::find_all(10));*/

/*  if (isset($_SERVER['HTTPS']) )
    {
        echo "SECURE: This page is being accessed through a secure connection.<br><br>";
    }
    else
    {
        echo "UNSECURE: This page is being access through an unsecure connection.<br><br>";
    } */

  //$rstring = getRandomString($length = 64);sdc50

 // $secret_key = base64_decode(getenv('HTTP_POST_KEY'));

  //$data = array("joshua", "majebi");

 // $jwt = JWT::encode($data, $secret_key, 'HS512');

 // echo $jwt;
  
  //echo $rstring;

  //echo "<br> <br>";
 
  //echo base64_decode('WENTTXNVZTRJVEpQR0pYRHppYldlUlI4OUlEdXA0ZTgzcmI0S2EzOXZMU3l2dVRScmdBU2RkZFVqaGVaeEpUVQ==');

    function getRandomString($length = 64) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $string = '';

        for ($i = 0; $i < $length; $i++) {
            $string .= $characters[mt_rand(0, strlen($characters) - 1)];
        }

        return $string;
    }
 
?>