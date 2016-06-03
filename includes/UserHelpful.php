<?php
 require_once 'Database.php';

 class UserHelpful{
  
 protected static $table_name = "user_helpful";  
 public $id;     
 public $question_id;
 public $subject_id;     
 public $user_id;    
 public $status=0;     
    
 public static function make($qid=0,$subid=0, $usid=0){
     global $database;
     
     $uh = new UserHelpful();
     $uh->question_id = $qid;
     $uh->subject_id = $subid;
     $uh->user_id = $usid;
     return $uh;
 }         
 
 public static function find_all($quid=0, $suid=0) {
        global $database;
        $qid = $database->escape_value($quid);
        $sid = $database->escape_value($suid);
		$result_array = self::find_by_sql("SELECT * FROM " .self::$table_name. "  WHERE subject_id = {$sid} AND question_id = {$qid}");
     
        return !empty($result_array) ? array_shift($result_array) : false;
  }
    
 public static function find_by_id($id=0) {
      global $database;
      $userid = $database->escape_value($id);
      
      $result_array = self::find_by_sql("SELECT * FROM " .self::$table_name. " WHERE id={$userid} LIMIT 1");
      return !empty($result_array) ? array_shift($result_array) : false;
  }
     
 public static function find_user_helpful($quid=0, $suid=0,$usid){
     global $database;
     $qid = $database->escape_value($quid);
     $sid = $database->escape_value($suid);
     $uid = $database->escape_value($usid);
     
     $result_array = self::find_by_sql("SELECT * FROM " .self::$table_name. " WHERE subject_id = {$sid} AND question_id = {$qid} AND user_id = {$uid} LIMIT 1");
      
     return !empty($result_array) ? array_shift($result_array) : false;
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
    
 public function has_attribute($attribute) {
	  // get_object_vars returns an associative array with all attributes 
	  // (incl. private ones!) as the keys and their current values as the value
	  $object_vars = get_object_vars($this);
	  // We don't care about the value, we just want to know if the key exists
	  // Will return true or false
	  return array_key_exists($attribute, $object_vars);
  }
    
 public function attributes(){
      
    /*$attributes = array();
      
    foreach(self::$db_fields as $field){
        if(property_exists($this, $field)){
            $attributes[$field] = $this->$field;
        }
    }  
      
    return $attributes;*/
      return get_object_vars($this);
  }
    
 protected function escaped_attributes(){
    global $database;

    $clean_attributes = array();

    foreach($this->attributes() as $key => $value){
      $clean_attributes[$key] = $database->escape_value($value);
    }

    return $clean_attributes;
  }
    
 public function create(){
     global $database;
     $sql= "INSERT INTO " .self::$table_name. " (question_id,subject_id,user_id,status) VALUES ('".$database->escape_value($this->question_id)."','" .$database->escape_value($this->subject_id)."','".$database->escape_value($this->user_id)."','".$database->escape_value($this->status)."')";

    /*$database->escape_value(this->email), 
    //$database->escape_value(this->hospital_id), 
    //$database->escape_value(this->first_name),
    //$database->escape_value(this->lastname),
    //$database->escape_value(this->password), 
    //$database->escape_value(this->phone_number), 
    //$database->escape_value(this->picture_url),
    //$database->escape_value(this->title),*/

      global $database;

   // $attributes = $this->escaped_atttributes();
    //$sql.= "INSERT INTO ".self::table_name." ( join(", ", array_keys($attributes)) ) VALUES ("
    //$sql.=  join(", ", array_values($attributes)) .");

    if($database->query($sql)){
      $this->id = $database->insert_id();
      return true;
    }
    else{
      return false;
    } 
  }
    
 public function delete(){
    global $database;

    $sql = "DELETE FROM ".self::$table_name." WHERE id=".$database->escape_value($this->id)." LIMIT 1";
  }
    
 public function update(){
    global $database;

    $attributes = $this->escaped_attributes();
    $attribute_pairs = array();

    foreach($attributes as $key => $value){
      $attribute_pairs[] = "{$key}='{$value}'";
    }

     $sql= "UPDATE " .self::$table_name." SET " .join(",", $attribute_pairs)." WHERE id=".$database->escape_value($this->id);

     $database->query($sql);
     
     return ($database->affected_rows()==1) ? true : false;
  }
    
}
?>