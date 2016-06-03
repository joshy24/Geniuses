<?php

  require_once 'Database.php'; 
  require_once 'Friends.php';

  class QuestionAttempt{
	  public $id;
	  public $user_id;
	  public $attempt;
	  public $comment_id;
	  public $question_id;
	  public $subject_id;
	  
	  protected static $table_name = "question_attempt";
  	   
  public static function initialize($uid=0, $att="", $cid=0, $qid=0, $sid=0){
	  $qa = new QuestionAttempt();
	  
	  $qa->user_id = $uid;
	  $qa->attempt = $att;
	  $qa->comment_id = $cid;
	  $qa->question_id = $qid;
	  $qa->subject_id = $sid;
	  
	  return $qa;
  }	  
  	  
  public static function find_all(){
      $sql  = "SELECT * FROM " .self::$table_name;
      $result_array = self::find_by_sql($sql);
      
      return !empty($result_array) ? $result_array : false;
  }  
	    
  public static function find_friends_attempts($user_id=0, $qid=0, $sub_id=0){
	  global $database;
	  
	  $uid = $database->escape_value($user_id);
	  $quid = $database->escape_value($qid);
	  $subid = $database->escape_value($sub_id);
	  
	  $friends_ids = Friends::getAllFriendsById($uid,"S");
	  $friends_ids_array = [];
	  
	  if($friends_ids!=false){
		  global $database;
      	  
		  foreach($friends_ids as $key => $friend) {
			  $friends_ids_array[$key] = $friend->friend_id;
		  }
		  
		  $new_friends_ids = join("','", $friends_ids_array);
		  
		  $friends_attempts = self::find_by_sql("SELECT * FROM " .self::$table_name. " WHERE user_id in ('$new_friends_ids') AND question_id = {$quid} AND subject_id = {$subid}");
		  
		  $friends_first_time = self::find_by_sql("SELECT * FROM " .self::$table_name. " WHERE user_id in ('$new_friends_ids') AND question_id = {$quid} AND subject_id = {$subid} AND attempt = 1");
		  
		  $friends_second_time = self::find_by_sql("SELECT * FROM " .self::$table_name. " WHERE user_id in ('$new_friends_ids') AND question_id = {$quid} AND subject_id = {$subid} AND attempt = 2");
		  
		  $friends_missed = self::find_by_sql("SELECT * FROM " .self::$table_name. " WHERE user_id in ('$new_friends_ids') AND question_id = {$quid} AND subject_id = {$subid} AND attempt = 'M' ");
		  
		  
		  $result_array = ["attempted" => $friends_attempts, "first_time" => $friends_first_time, "second_time" => $friends_second_time, "missed" => $friends_missed];
		  
		  return !empty($result_array) ? $result_array : false; 
	  }
	  else{
		  return false;
	  }
  }	  
      
  public static function find_by_userid($uid="", $qid=0, $sub_id=0){
          global $database;
	  
          $usid = $database->escape_value($uid);
		  $quid = $database->escape_value($qid);
	  	  $subid = $database->escape_value($sub_id);	  
          
          $result_array = self::find_by_sql("SELECT * FROM " .self::$table_name. " WHERE user_id = {$usid} AND question_id = {$quid} AND subject_id = {$subid}");
           
          return !empty($result_array) ? array_shift($result_array) : false;
  }      
       
  public static function find_by_id($id){
          if(!empty($id)){
              global $database;
          $sid = $database->escape_value($id);
          
           $sql  = "SELECT * FROM " .self::$table_name;
           $sql .= " WHERE id = '{$sid}' ";
           $sql .= "LIMIT 1";
           $result_array = self::find_by_sql($sql);
           
           return !empty($result_array) ? array_shift($result_array) : false;
         }
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
	
  private function has_attribute($attribute) {
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

    foreach($this.attributes() as $key => $value){
      $clean_attributes[$key] = $database->escape_value($value);
    }

    return $clean_attributes;
  }
      
  public function create(){
     global $database;
     $sql= "INSERT INTO " .self::$table_name. "(user_id, attempt, comment_id, question_id, subject_id) VALUES ('".$database->escape_value($this->user_id)."','".$database->escape_value($this->attempt)."','".$database->escape_value($this->comment_id)."','".$database->escape_value($this->question_id)."','".$database->escape_value($this->subject_id)."')";
	
     if($database->query($sql)){
       $this->id = $database->insert_id();
       return true;
     }
     else{
       return false;
     } 
  }	  
	  
  } 

?>