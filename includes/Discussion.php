<?php
require_once 'Database.php';
require_once 'Dates.php';


Class Discussion{
    protected static $table_name = "discussion";
    
    public $discussion_id;
    public $user_id;
    public $user_type;
    public $discussion;
    public $created;
    
    public static function make($id=0, $type="", $disc=""){
        global $database;
        
        $id = $database->escape_value($id);
        $type = $database->escape_value($type);
        $disc = $database->escape_value($disc);
        
        if(!empty($id)&&!empty($type)&&!empty($disc)){
        
            $discussion = new Discussion();
            $discussion->user_id = $id;
            $discussion->user_type = $type;
            $discussion->discussion = $disc;
            $discussion->created = Dates::getCurrentDateTime();
               
            return $discussion;
        }
        else{
            return false;
        }
    }
    
    public static function find_by_id($id=0) {
        $result_array = self::find_by_sql("SELECT * FROM " .self::$table_name. " WHERE discussion_id={$id} LIMIT 1");
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

    public function createDiscussion(){
               global $database;
         $sql= "INSERT INTO " .self::$table_name. " (user_id, user_type, discussion, created) VALUES ('".$database->escape_value($this->user_id)."','".$database->escape_value($this->user_type)."','".$database->escape_value($this->discussion)."','".$database->escape_value($this->created)."')";

            global $database;

            if($database->query($sql)){
              $this->discussion_id = $database->insert_id();
              return true;
            }
            else{
              return false;
            } 
       }
      
    public function deleteDiscussion(){
    
    }
    
    public function updateDiscussion(){
           global $database;

           $attributes = $this->escaped_attributes();
           $attribute_pairs = array();

           foreach($attributes as $key => $value){
              $attribute_pairs[] = "{$key}='{$value}'";
           }

           $sql= "UPDATE " .self::$table_name." SET " .join(",", $attribute_pairs)." WHERE discussion_id=".$database->escape_value($this->discussion_id);

           $database->query($sql);

           return($database->affected_rows()==1) ? true : false;
    }

  }

?>