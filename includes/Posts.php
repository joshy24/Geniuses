<?php
  require_once 'Questions.php';
  require_once 'Database.php';
  require_once 'Dates.php';
  require_once 'Friends.php';
  require_once 'LLHPosts.php';
  require_once 'FriendsPost.php';
  require_once 'UserPosts.php';
  require_once 'Subjects.php';
  require_once 'Discussion.php';
  require_once 'User.php';
  
  class Posts{
       
       protected static $table_name = "posts";  
       
       public $post_id;  
       public $question_id;
       public $subject_id;
       public $user_id;
       public $user_type;
       public $discussion_id;
       public $post_type;
       public $post_date;
       
       public static function make($subd, $qd, $ud,$ust,$dd, $t){
           
           global $database;
           
           $qid = $database->escape_value($qd);
           $subid = $database->escape_value($subd);
           $uid = $database->escape_value($ud);
           $ut = $database->escape_value($ust);
           $did = $database->escape_value($dd);
           $type = $database->escape_value($t);
           
           $post = new Posts();
           //$post->post_id = 0; post_id will be auto assigned in DataBase
           $post->question_id = $qid;
           $post->subject_id = $subid;
           $post->user_id = $uid;
           $post->user_type = $ut;
           $post->discussion_id = $did;
           $post->post_type  = $t;
           $post->post_date = Dates::getCurrentDateTime();
              return $post;
       }
       
       public static function getPost($id){
            $result_array = self::find_by_sql("SELECT * FROM " .self::$table_name. " WHERE post_id={$id} LIMIT 1");
           
		    return !empty($result_array) ? array_shift($result_array) : false;
       }
       
       public static function getQuestionPostOwner($subid, $qid=0, $uid=0, $ut=""){
            $result_array = self::find_by_sql("SELECT * FROM " .self::$table_name. " WHERE subject_id = {$subid} AND question_id = {$qid} AND user_id = {$uid} AND user_type = '{$ut}' LIMIT 1");
           
           return !empty($result_array) ? array_shift($result_array) : false;  
       }
       
       public static function getDiscussionPostOwner($did=0, $uid=0, $ut=""){
            $result_array = self::find_by_sql("SELECT * FROM " .self::$table_name. " WHERE discussion_id = {$did} AND user_id = {$uid} AND user_type = '{$ut}' LIMIT 1");
           
           return !empty($result_array) ? array_shift($result_array) : false;  
       }
       
       public function getPostComments($num, $usid, $type){
           $friend_ids_array = Friends::getAllFriendsById($usid,$type);
           
           if($friend_ids_array!=false){
                $id_array = array();
           
                for($i=0;$i<count($friend_ids_array);$i++){
                    $id_array[$i] = $friend_ids_array[$i]->friend_id;
                }
               
                $id_array[count($friend_ids_array)] = "'".$usid."'";
               
                $comm_friends =  Comment::getCommentsByFriends($this->post_id, $id_array, $num);   
               
                return $comm_friends;
           }
           else{
               return "";
           }
       }
      
       public function getCommentsUserInfo($allcomments){
           $users_info = array();
           $count = 0;
           
           if($allcomments!=null&&$allcomments!=false&&$allcomments!=""&&$allcomments!='undefined'){  
            foreach ($allcomments as $comment){
               
               $id = $comment->user_id;
               
               $user = User::find_by_id($id);
               
               if($user!=false){
                   $users_info[$count] = (object)['firstname' => $user->firstname, 'lastname' => $user->lastname, 'picture_url' => $user->picture_url];
               }
               else{
                   $users_info[$count] = null;
               }
               
               $count++;
            } 
           }
           
           return $users_info;
       }
      
       public function getCommentsInfo($allcomments){
           $users_info = array();
           $count = 0;
           
           if($allcomments!=null&&$allcomments!=false){  
            foreach ($allcomments as $comment){
               
               $id = $comment->user_id;
               
               $user = User::find_by_id($id);
               
               if($user!=false){
                   $users_info[] = ['firstname' => $user->firstname, 'lastname' => $user->lastname, 'picture_url' => $user->picture_url];
               }
               else{
                   $users_info[$count] = null;
               }
               
               $count++;
            } 
           }
           
           return $users_info;
       }
      
       public function getPostType(){
          return $this->post_type;
       }
       
       public function getPostQuestion(){  
           
           $subject = Subject::find_by_id($this->subject_id); 
    
           $name = $subject->name;
           
           $q = Questions::find_by_name($name, $this->question_id);  
           return $q;
       }
      
       public function getPostDiscussion(){
           $discussion = Discussion::find_by_id($this->discussion_id);
           
           return $discussion;
           
       }
      
       public function getPostDate(){
           return $this->post_date;
       }
      
       public function getOwner(){
           $user = User::find_by_id($this->user_id);
           
           if($user!=false){
                $user->password = "";
                return $user;
           }
           else{
               if($this->user_id==1){
                   return 1;
               }
               else{
                   return false;
               }
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

        foreach($this->attributes() as $key => $value){
          $clean_attributes[$key] = $database->escape_value($value);
        }

        return $clean_attributes;
      }

       public function createPost(){
               global $database;
           
         $sql= "INSERT INTO " .self::$table_name. " (question_id, subject_id, user_id, user_type, discussion_id, post_type, post_date) VALUES ('" .$database->escape_value($this->question_id)."','".$database->escape_value($this->subject_id)."','".$database->escape_value($this->user_id)."','".$database->escape_value($this->user_type)."','".$database->escape_value($this->discussion_id)."','".$database->escape_value($this->post_type)."','".$database->escape_value($this->post_date)."')";

            global $database;

            if($database->query($sql)){
              $this->post_id = $database->insert_id();
              return true;
            }
            else{
              return false;
            } 
       }
      
       public function deletePost(){
           
       }
      
       public function updatePost(){
           
       }
  }

?>