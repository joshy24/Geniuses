<?php
require_once '../../includes/HandleUserRequests.php';
require_once '../../includes/Database.php';
require_once '../../includes/Questions.php';

function respond($status, $ipid, $post){
    $response['ipid'] = $ipid;
    $response['status'] = $status;
    $response['post'] = $post;
    
    echo json_encode($response);
}

if($_SERVER['REQUEST_METHOD']=="POST"){
    $data = json_decode(file_get_contents("php://input"));
    
    global $database;
    
    $post_id = $database->escape_value($data->post_id);
    
    if($post_id!=null&&$post_id!='undefined'){
       $post = HandleUserRequests::FetchPostExposed($post_id);
        
       if($post!=false){
           respond("OK", false, $post);
       }    
       else{
           respond(false, true, false);
       }    
    }
    else{
        respond(false, true, false);
    }
}
else{
    
}
?>