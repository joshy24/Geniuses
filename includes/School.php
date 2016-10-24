<?php 
require_once 'Database.php';
require_once 'Dates.php';
require_once 'User.php';

class School{
    
  public static $table_name = "school";
  
  public $id;
  public $name;
  public $address;
  public $location;    
  
  public static function find_all() {
      global $database;
      
      $result_array = self::find_by_sql("SELECT name FROM ".self::$table_name);
       
      $object_array = array();
      for($i=0;$i<count($result_array);$i++){
         $object_array[] = $result_array[$i]->name;
      }
      
      return !empty($object_array) ? $object_array : false;
  }
    
  public static function find_by_name($name = ""){
      global $database;
      
      $n = $database->escape_value($name);
      
      $result_array = self::find_by_sql("SELECT * from ".self::$table_name." WHERE name = '{$n}'");
      
      return !empty($result_array) ? array_shift($result_array) : false;
  }   
     
  public static function find_by_like_name($name = ""){
      global $database;
      
      $n = $database->escape_value($name);
      
      $result_array = self::find_by_sql("SELECT * from ".self::$table_name." WHERE name LIKE '%{$n}%'");
      
      return !empty($result_array) ? $result_array : false;
  }         
    
  public static function find_by_id($id=0) {
    $result_array = self::find_by_sql("SELECT * FROM " .self::$table_name. " WHERE id={$id} LIMIT 1");
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
  
  public function attributes(){
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
     $sql= "INSERT INTO " .self::$table_name. " (from_id, from_type, to_id, to_type, created ) VALUES ('".$database->escape_value($this->from_id)."','".$database->escape_value($this->from_type)."','".$database->escape_value($this->to_id)."','". $database->escape_value($this->to_type)."','".$database->escape_value($this->created)."')";

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
      $this->id = $database->insert_id();
      return true;
    }
    else{
      return false;
    } 
  }
   
  public function delete(){
    global $database;

    $sql = "DELETE FROM ".self::$table_name." WHERE request_id=".$database->escape_value($this->request_id)." LIMIT 1";
      
    $database->query($sql);

    return($database->affected_rows()==1) ? true : false;
  }

  public function update(){
    global $database;

    $attributes = $this->escaped_attributes();
    $attribute_pairs = array();

    foreach($attributes as $key => $value){
      $attribute_pairs[] = "{$key}='{$value}'";
    }

     $sql= "UPDATE " .self::$table_name." SET " .join(",", $attribute_pairs)." WHERE request_id=".$database->escape_value($this->request_id);

     $database->query($sql);

     return($database->affected_rows()==1) ? true : false;
  }
    
}

?>