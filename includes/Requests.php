<?php 
require_once 'Database.php';
require_once 'Dates.php';
require_once 'User.php';

class Request{
    
  public static $table_name = "requests";
  
  public $request_id;
  public $from_id;
  public $from_type;
  public $to_id;
  public $to_type;
  public $created;
  public $accepted;    
  
  public static function make($fid, $ft, $tid, $tt){
      global $database;
      
      if(!empty($fid)&&!empty($ft)&&!empty($tid)&&!empty($tt)){
      
          $frid = $database->escape_value($fid);
          $frt = $database->escape_value($ft);
          $toid = $database->escape_value($tid);
          $tot = $database->escape_value($tt);
          
          $request = new Request();
          
          $request->from_id = $frid;
          $request->from_type = $frt;
          $request->to_id = $toid;
          $request->to_type = $tot;
          $request->created = Dates::getCurrentDateTime();
          
          return $request;
      }
      else{
          return false;
      }
  }  
    
  public static function findReceivedRequests($uid){
      global $database;
      
      $usid = $database->escape_value($uid);
      
      $result_array = $database->query("SELECT requests.request_id, users.picture_url, users.firstname, users.lastname, users.school, users.sclass, users.id FROM requests, users WHERE requests.to_id = {$usid} AND requests.from_id = users.id ORDER BY requests.created DESC ");
      
      $object_array = array();
      while ($row = $database->fetch_array($result_array)) {
         $object_array[] = $row;
      }
      
      return !empty($object_array) ? $object_array : false;
  }   
    
  public static function findSentRequests($uid){
      global $database;
      
      $usid = $database->escape_value($uid);
      
      $result_array = self::find_by_sql("SELECT * FROM " .self::$table_name. " WHERE from_id ={$usid}");
		return !empty($result_array) ? array_shift($result_array) : false;
  }
    
  public static function find_all() {
		return self::find_by_sql("SELECT * FROM " .self::$table_name);
  }
    
  public static function find_request($fid, $ft, $tid, $tt){
      global $database;
      
      if(!empty($fid)&&!empty($ft)&&!empty($tid)&&!empty($tt)){
      
          $frid = $database->escape_value($fid);
          $frt = $database->escape_value($ft);
          $toid = $database->escape_value($tid);
          $tot = $database->escape_value($tt);
          
          $result_array = self::find_by_sql("SELECT * FROM " .self::$table_name. " WHERE from_id={$frid} AND from_type='{$frt}' AND to_id={$toid} AND to_type='{$tot}'");
		return !empty($result_array) ? true : false;
      }
  }     
  
  public static function find_by_id($id=0) {
    $result_array = self::find_by_sql("SELECT * FROM " .self::$table_name. " WHERE request_id={$id} LIMIT 1");
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