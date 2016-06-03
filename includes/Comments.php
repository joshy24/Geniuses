<?php
 require_once 'Database.php';

class Comment{
    
  protected static $table_name = "comments";    
    
  public $comment_id;
  public $user_id;
  public $created;
  public $post_id;
  public $comment;
  public $user_type;   
    
  public static function make($userid, $postid, $comm, $usertype){
     if(!empty($userid)&&!empty($postid)&&!empty($comm)&&!empty($usertype)){
      $acomment = new Comment();
         
      $acomment->user_id = $userid;
      $acomment->post_id = $postid;
      $acomment->comment = $comm;
      $acomment->created = Dates::getCurrentDateTime();
      $acomment->user_type = $usertype;
         
         return $acomment;
     }
     else{
         return false;
     }
  }    
    
  public static function getCommentsByFriends($postid=0, $friend_ids=[], $lim = 0){
      global $database;
      
      $pid = $database->escape_value($postid);
      
      foreach($friend_ids as $key => $id) {
          $friend_ids[$key] = $id;
      }
      
      $new_friend_ids = join(",", $friend_ids);
      
      $sql = "SELECT * FROM ".self::$table_name." WHERE user_id IN ($new_friend_ids) AND post_id = {$pid} ORDER BY created DESC LIMIT {$lim}";
      
      $result_array = self::find_by_sql($sql);
      
      return $result_array;
  }    
    
  public static function find_comments_on($pid, $limit){
    global $database;  
    $qid = $database->escape_value($pid);
      
    $sql  = "SELECT * FROM " .self::$table_name;
    $sql .= " WHERE post_id = {$qid} ORDER BY created DESC Limit {$limit}";
    $result_array = self::find_by_sql($sql);
      
      return $result_array;
  } 
    
  public static function find_comments_after($pid="", $friend_ids=[], $adate=""){
    global $database;  
    
    foreach($friends_ids as $key => $id) {
         $friend_ids[$key] = $database->escape_value($id);
    }
      
    $new_friend_ids = join("','", $friend_ids);  
      
    $ad = $database->escape_value($adate);
    $pd = $database->escape_value($pid);  
      
    $sql  = "SELECT * FROM " .self::$table_name;
    $sql .= " WHERE user_id IN ('$new_friends_ids') AND post_id = {$pd} AND created > '{$ad}' ORDER BY created DESC Limit 20";
    $result_array = self::find_by_sql($sql);
      
      return $result_array; 
  }
    
  public static function find_user_discussion_comment($uid, $pid){
    global $database; 
    $usid = $database->escape_value($uid);
    $poid = $database->escape_value($pid);
      
    $sql  = "SELECT * FROM " .self::$table_name;
    $sql .= " WHERE user_id = '{$usid}' AND ";
    $sql .= " post_id = '{$poid}' ";
    $sql .= " AND discussion = 1 ";
    $sql .= " LIMIT 1";
    $result_array = self::find_by_sql($sql);
      
     return !empty($result_array) ? array_shift($result_array) : false;
  }        
    	
  public static function find_all() {
		return self::find_by_sql("SELECT * FROM " .self::tablename);
  }
  
  public static function find_by_id($id=0) {
    $result_array = self::find_by_sql("SELECT * FROM " .self::$table_name. " WHERE comment_id={$id} LIMIT 1");
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

  public function full_name() {
    if(isset($this->first_name) && isset($this->last_name)) {
      return $this->first_name . " " . $this->last_name;
    } else {
      return "";
    }
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

    foreach($this->attributes() as $key => $value){
      $clean_attributes[$key] = $database->escape_value($value);
    }

    return $clean_attributes;
  }
  
  public function create(){
     global $database;
     $sql= "INSERT INTO " .self::$table_name. " (user_id, created, post_id, comment, user_type ) VALUES ('".$database->escape_value($this->user_id)."','".$database->escape_value($this->created)."','".$database->escape_value($this->post_id)."','". $database->escape_value($this->comment)."','".$database->escape_value($this->user_type)."')";

    ///*$database->escape_value(this->email), 
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
      $this->comment_id = $database->insert_id();
      return true;
    }
    else{
      return false;
    } 
  }
   
  public function delete(){
    global $database;

    $sql = "DELETE FROM ".self::table_name." WHERE id=".$database->escape_value($this->id)." LIMIT 1";
  }

  public function update(){
    global $database;

    $attributes = $this->escaped_attributes();
    $attribute_pairs = array();

    foreach($attributes as $key => $value){
      $attribute_pairs[] = "{$key}='{$value}'";
    }

     $sql= "UPDATE " .self::$table_name." SET " .join(",", $attribute_pairs)." WHERE comment_id=".$database->escape_value($this->comment_id);

     $database->query($sql);

     return($database->affected_rows()==1) ? true : false;
  }
    
}


?>