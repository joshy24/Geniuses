<?php
require_once '../../includes/Database.php';
require_once '../../includes/School.php';

function server_respond($status, $schools){
    $response['status'] = $status;
    $response['schools'] = $schools;
    
    echo json_encode($response);
}

if($_SERVER['REQUEST_METHOD']=="POST"){
    $data = json_decode(file_get_contents("php://input"));
    
    global $database;
    
    $method = $database->escape_value($data->method);
    
    if($method=="getSchools"){
         try{
             $schools = School::find_all();
             
             if($schools!=false){
                 server_respond("OK", $schools);
             }    
             else{
                 server_respond(false, false);
             }  
         }
         catch(Exception $e){
             server_respond(false, false);
         }  
    }
    else{
        server_respond(false, false);
    }
}
else{
    
}
?>