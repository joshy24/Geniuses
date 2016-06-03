<?php
  require_once 'Database.php'; 
  require_once 'Topics.php';

  class Subject{
      protected static $table_name = "subjects";  
      
      public $id;
      public $name;
      public $icon_url;
      public $color;
      public $time;
  
  public static function find_subjects_and_topics(){
     
          $sql  = "SELECT * FROM " .self::$table_name;
          $result_array = self::find_by_sql($sql);
          
          $subject_topics = array();
         
      
          if(!empty($result_array)){
              //$sid = $database->escape_value($subject_id);
               $count = 0;
             foreach($result_array as $result){
                  $subject = $result;

                  $topics = Topics::find_by_subject($subject->id);
                      
                  $name = $subject->name; 
                 
                  $time = $subject->time;
                 
                  $subject_topics[$count] = array("name" => $name, 'topics' => $topics, "time" => $time);
                
                  $count=$count+1;
             }
              
             return $subject_topics;
              
          }
          else{return false;}
  }
      
  public static function find_all(){
      $sql  = "SELECT id, name FROM " .self::$table_name;
      $result_array = self::find_by_sql($sql);
      
      return !empty($result_array) ? $result_array : false;
  }        
      
  public static function find_by_name($subjectname=""){
          if(!empty($subjectname)){
              global $database;
          $sname = $database->escape_value($subjectname);
          
           $sql  = "SELECT * FROM " .self::$table_name;
           $sql .= " WHERE name = '{$sname}' ";
           $sql .= "LIMIT 1";
           $result_array = self::find_by_sql($sql);
           
           return !empty($result_array) ? array_shift($result_array) : false;
         }
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
      
  }
 

?>