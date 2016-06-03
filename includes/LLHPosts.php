<?php 
require_once "Database.php";
require_once "Dates.php";

class LLHPost{
    
    public static $table_name = "llhuserpost";
    
    public $id;
    public $post_id;
    public $department;
    public $view_date;
    
    public function __construct(){
       
    }
    
    public static function isLLHPost($sid, $qid){
       global $database;
       $quid = $database->escape_value($qid);
       $subid = $database->escape_value($sid);
        
       $result_array = Posts::getQuestionPostOwner($subid,$quid,1,"L");    
        
       if($result_array!=false){
           return array_shift($result_array);
       }    
       else{
           return false;
       }
    } 
    
    public static function getPosts($dept=""){
         $result_array = self::find_by_sql("SELECT * FROM " .self::$table_name. " WHERE department = '{$dept}' ORDER BY view_date DESC  LIMIT 50");
        
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
  
  public function create(){
     global $database;
     $sql= "INSERT INTO " .self::$table_name. " (post_id,department,view_date) VALUES ('".$database->escape_value($this->post_id)."','".$database->escape_value($this->department)."','".$database->escape_value($this->view_date)."')";

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
      $this->post_id = $database->insert_id();
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

     return($databse->affected_rows()==1) ? true : false;
  }
}

?>