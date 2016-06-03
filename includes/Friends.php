<?php 
require_once 'Database.php';
require_once 'Posts.php';
require_once 'User.php';

class Friends{
    
    protected static $table_name = "friends";
    
    public $entry_id;
    public $user_id;
    public $user_type;
    public $friend_id;
    public $friend_type;
    
    public static function make($usid=0, $ust='', $frid=0, $frt=''){
        global $database;
      
      if(!empty($usid)&&!empty($ust)&&!empty($frid)&&!empty($frt)){
      
          $uid = $database->escape_value($usid);
          $ut = $database->escape_value($ust);
          $frid = $database->escape_value($frid);
          $frt = $database->escape_value($frt);
          
          $friend = new Friends();
          
          $friend->user_id = $uid;
          $friend->user_type = $ut;
          $friend->friend_id = $frid;
          $friend->friend_type = $frt;
          
          return $friend;
      }
      else{
          return false;
      }
    }
    
    public static function isFriend($usid, $utype, $friendid, $ftype){
        global $database;
        $aid = $database->escape_value($usid);
        
        $result_array = self::find_by_sql("SELECT * FROM " .self::$table_name. " WHERE user_id = {$aid} AND user_type='{$utype}' AND friend_id = {$friendid} AND friend_type = '{$ftype}' LIMIT 1");
        
		return !empty($result_array) ? true : false;
    }
    
    public static function getFriendsOnline($usid=0, $type="", $lim){
        global $database;
        $uid = $database->escape_value($usid);
        
        $result_array = $database->query("SELECT users.picture_url, users.firstname, users.lastname, users.id FROM users,friends WHERE user_id = {$uid} AND user_type = '{$type}' AND friend_id  = users.id AND users.online = 1 Limit {$lim}");
      
      $object_array = array();
      while ($row = $database->fetch_array($result_array)) {
         $object_array[] = $row;
      }
      
		return !empty($object_array) ? $object_array : false;
    }
    
    public function getFriendCount(){
        $friend_count = self::find_by_sql("SELECT COUNT(user_id) AS FRIENDS FROM ".self::$table_name." WHERE user_id= {$this->user_id} AND user_type='{$this->user_type}'");
		return $friend_count>0 ? $friend_count : false;
    }
    
    public static function getAllFriends($id=0, $type, $offset=0){
        global $database;
        $aid = $database->escape_value($id);
     
        $result_array = self::find_by_sql("SELECT * FROM " .self::$table_name. " WHERE user_id = {$aid} AND user_type = '{$type}' LIMIT 15 OFFSET {$offset}");
		return !empty($result_array) ? $result_array : false;
    }
    
    public static function getAllFriendsById($id=0, $type){
        global $database;
        $aid = $database->escape_value($id);
        $type = $database->escape_value($type);
		
     
        $result_array = self::find_by_sql("SELECT friend_id FROM " .self::$table_name. " WHERE user_id = {$aid} AND user_type = '{$type}'");
		return !empty($result_array) ? $result_array : false;
    }
    
    public static function getAllFriendsData($id=0, $type='', $offset=0){
        global $database;
        
        $usid = $database->escape_value($id);
        $ustype = $database->escape_value($type);
        $off = $database->escape_value($offset);
        
        $result_array = $database->query("SELECT users.username, users.firstname, users.lastname, users.sclass, users.school, users.department, users.picture_url, users.id, users.fav_subject FROM friends, users WHERE (friends.user_id = {$usid} AND friends.user_type = '{$ustype}') AND (friends.friend_id = users.id) LIMIT 15 OFFSET {$off}");
        
        $object_array = array();
          while ($row = $database->fetch_array($result_array)) {
             $object_array[] = $row;
          }
      
		return !empty($object_array) ? $object_array : false;
    }
    
    public static function isFriendQuestionPost($subid, $quid=0, $uid=0, $type){
         $friends = self::getAllFriends($uid, $type);
         
         if($friends!=false){
             for($i=0;$i<count($friends);$i++){
                 $result = Posts::getQuestionPostOwner($subid, $quid, $friends[$i]->friend_id, $friends[$i]->friend_type);
                  if($result!=false){
                      return $result;
                  }
             }
         }
             
         return false;     
     }
    
    public static function isFriendDiscussionPost($duid=0, $uid=0, $type){
         $friends = self::getAllFriends($uid, $type);
        
         if($friends!=false){
           for($i=0;$i<count($friends);$i++){
             $result = Posts::getDiscussionPostOwner($duid, $friends[$i]->friend_id, $friends[$i]->friend_type);
              if($result!=false){
                  return $result;
              }
           }
         }
             
         return false;     
     }
    
    public function getFriendData($id=0){
        global $database;
        $aid = $database->escape_value($id);
        $user_table_name = "users";
        
        $sql  = "SELECT * FROM " .$user_table_name;
        $sql .= " WHERE user_id = '{$aid}' ";
        $sql .= "LIMIT 1";
        $result_array = self::find_by_sql($sql);
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
        $attributes = array();

        foreach(self::$db_fields as $field){
            if(property_exists($this, $field)){
                $attributes[$field] = $this->$field;
            }
        }  

        return $attributes;
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
     $sql= "INSERT INTO " .self::$table_name. " (user_id, user_type, friend_id, friend_type) VALUES ('".$database->escape_value($this->user_id)."','".$database->escape_value($this->user_type)."','".$database->escape_value($this->friend_id)."','". $database->escape_value($this->friend_type)."')";

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
      $this->entry_id = $database->insert_id();
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

     $sql= "UPDATE" .self::$table_name."SET" .join(",", $attribute_pairs)."WHERE id=".$database->escape_value($this->id);

     $database->query($sql);

     return($database->affected_rows()==1) ? true : false;
  }
}


?>