<?php 
require_once 'Database.php';
require_once 'Posts.php';
require_once 'FetchedPosts.php';
require_once 'Dates.php';
require_once 'Friends.php';


class FriendsPost{
    
    protected static $table_name = "friendpost";    
     
    public $post_id;
    public $user_type;
    public $user_id;
    public $last_viewed;
    
    public static function friendPostTagExists($fid=0, $pid=0){
         global $database;
         $fid = $database->escape_value($fid);
         $pid = $database->escape_value($pid);
         
         $result_array = self::find_by_sql("SELECT * FROM friendpost WHERE post_id = {$pid} AND user_id = {$fid} LIMIT 1");
		return !empty($result_array) ? true : false;
     }
    
    public static function updateUserFriendsTag($uid=0, $user_type, $pid=0){
          $friends = Friends::getAllFriends($uid, $user_type);
         
          $updatecount=0;
         
          if($friends!=false){
            foreach($friends as $friend){
              
              $postid = $pid;
              $usertype = $friend->friend_type;
              $userid = $friend->friend_id;
              $lastviewed = Dates::getCurrentDateTime();//*****
              
              $attributes = array('post_id'=>$postid, 'user_type'=>$usertype, 'user_id'=>$userid, 'last_viewed'=>$lastviewed);     
         
              $attribute_pairs= array();
         
              foreach($attributes as $key => $value){
                  $attribute_pairs[] = "{$key}='{$value}'";
              }     
              
              $sql="";
              
              if(self::friendPostTagExists($friend->friend_id, $pid)){
     $sql= "UPDATE friendpost SET " .join(",", $attribute_pairs)." WHERE post_id = {$postid} AND user_id = {$userid}";
              }
              else{
                $sql= "INSERT INTO friendpost (post_id, user_type, user_id, last_viewed) VALUES ('". $postid."','".$usertype."','".$userid."','".$lastviewed."')";
              }

              global $database;
              $database->query($sql); 
              
              ($database->affected_rows()==1) ? $updatecount++ : $updatecount=$updatecount;
          }
              
            if($updatecount==count($friends)){
              
              return true;
            }
            else{
              return false;
            }  
          }
          else{
              return false;
          }
         
          
     }
    
    public static function find_friend_tag_post($id, $postid, $usertype){
        $result_array = self::find_by_sql("SELECT * FROM " .self::$table_name. " WHERE user_id={$id} AND post_id = {$postid} AND user_type = '{$usertype}'");
        
            return !empty($result_array) ? $result_array : false;
    }
    
    public static function find_by_id($id=0, $type=''){
        global $database;
        $ut = $database->escape_value($type);
        $uid = $database->escape_value($id);
        
        $result_array = self::find_by_sql("SELECT * FROM " .self::$table_name. " WHERE user_id={$uid} ANd user_type='{$ut}' ORDER BY last_viewed DESC LIMIT 50");
        
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
    
    public function update(){
    global $database;

    $attributes = $this->escaped_attributes();
    $attribute_pairs = array();

    foreach($attributes as $key => $value){
      $attribute_pairs[] = "{$key}='{$value}'";
    }

     $sql= "UPDATE " .self::$table_name." SET " .join(",", $attribute_pairs)." WHERE user_id={$user_id} AND post_id = {$post_id} AND user_type = '{$user_type}'";

     $database->query($sql);

     return($database->affected_rows()==1) ? true : false;
  }
}

?>