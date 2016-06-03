<?php 
 require_once 'Database.php';
 require_once 'Posts.php';
 require_once 'FetchedPosts.php';
 require_once 'Dates.php';
 require_once 'Friends.php';

 Class UserPosts{
     
     protected static $table_name = "userpost";    
     
     public $id;
     public $post_id;
     public $user_type;
     public $user_id;
     public $last_viewed;
    
     public static function make($pid, $ut, $uid){
         $userpost = new UserPosts();
         $userpost->post_id = $pid;
         $userpost->user_type = $ut;
         $userpost->user_id = $uid;
         $userpost->last_viewed = Dates::getCurrentDateTime();
         return $userpost;
     } 
     
     public static function setUserPost($pid=0, $uid=0, $ut){
            $result_array = self::find_by_sql("SELECT * FROM " .self::$table_name. " WHERE post_id = {$pid} AND user_id = {$uid} AND user_type='{$ut}' LIMIT 1");
        
           return !empty($result_array) ? array_shift($result_array) : false;  
     } 
    
     //start of utility functions    
     public static function find_by_id($id=0, $type) {
            $result_array = self::find_by_sql("SELECT * FROM " .self::$table_name. " WHERE user_id={$id} AND user_type='{$type}' ORDER BY last_viewed DESC LIMIT 50");
        
            return !empty($result_array) ? $result_array : false;
     }
     
     public static function find_by_sql($sql="") {
            global $database;
            $result_set = $database->query($sql);
            $object_array = array();
            while ($row = $database->fetch_array($result_set)) {
              $object_array[] = self::instantiate($row);
            }
            return $object_array;
       }
     
     private static function instantiate($record) {
		// Could check that $record exists and is an array
    $object = new self;
		
	// More dynamic, short-form approach:
	foreach($record as $attribute=>$value){
         if($object->has_attribute($attribute)) {
	    $object->$attribute = $value;
           }
	}

        return $object;
  }
	
     private function has_attribute($attribute){
	  // get_object_vars returns an associative array with all attributes 
	  // (incl. private ones!) as the keys and their current values as the value
	  $object_vars = get_object_vars($this);
	  // We don't care about the value, we just want to know if the key exists
	  // Will return true or false
	  return array_key_exists($attribute, $object_vars);
  }

     protected function attributes(){
        return get_object_vars($this);
     }

     protected function escaped_attributes(){
        global $database;

        $clean_attributes = array();

        foreach($this->attributes() as $key => $value){
          echo $key;    
          $clean_attributes[$key] = $database->escape_value($value);
        }

        return $clean_attributes;
      }
     
     //CRUD functions
     public function createUserPost(){
           global $database;
     $sql= "INSERT INTO " .self::$table_name. " (post_id, user_type, user_id, last_viewed) VALUES ('" .$database->escape_value($this->post_id)."','".$database->escape_value($this->user_type)."','".$database->escape_value($this->user_id)."','".$database->escape_value($this->last_viewed)."')";

        global $database;

        if($database->query($sql)){
          return true;
        }
        else{
          return false;
        } 
     }
      
     public function deleteUserPost(){
           
     }
      
     public function updateUserPost(){
          global $database;
         
         
         $sql = "UPDATE " .self::$table_name. " SET " ;
         $sql .= "post_id = '".$this->post_id."',";
         $sql .= "user_type = '".$this->user_type."',";
         $sql .= "user_id = '".$this->user_id."',";
         $sql .= "last_viewed = '".$this->last_viewed."' ";
         $sql .= "WHERE post_id = {$this->post_id} AND user_id = {$this->user_id}";
         
        
         $database->query($sql);

         return($database->affected_rows()==1) ? true : false;
     }  
    
     public static function updateFriendsUserPost($id=0, $ut="", $pid=0){
              $postid = $pid;
              $usertype = $ut;
              $userid = $id;
              $lastviewed = Dates::getCurrentDateTime();
              
              $attributes = array('post_id'=>$postid, 'user_type'=>$usertype, 'user_id'=>$userid, 'last_viewed'=>$lastviewed);     
         
              $attribute_pairs= array();
         
              foreach($attributes as $key => $value){
                  $attribute_pairs[] = "{$key}='{$value}'";
              }
              
              $sql= "UPDATE " .self::$table_name. " SET " .join(",", $attribute_pairs)." WHERE post_id = {$postid} AND user_id = {$userid}";

              global $database;
              $database->query($sql); 
         
              return($database->affected_rows()==1) ? true : false;
     }
     
     
     
 }

?>