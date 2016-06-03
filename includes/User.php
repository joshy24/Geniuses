<?php
require_once 'Database.php';
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of User
 *
 * @author Joshua
 */
class User {

  protected static $table_name = "users";  
  protected static $db_fields = array('fbid', 'username', 'password', 'firstname', 'lastname', 'gender', 'age_range', 'email', 'sclass', 'school', 'department', 'about', 'fav_subject', 'datecreated', 'referrer_id', 'picture_url', 'online', 'activation', 'phone_number', 'status');
    
  public $id;
  public $fbid;    
  public $username;
  public $password;
  public $firstname;
  public $lastname; 
  public $gender;
  public $age_range;
  public $email;
  public $sclass;
  public $school;
  public $department;  
  public $about;    
  public $fav_subject;
  public $datecreated;
  public $referrer_id;  
  public $picture_url;    
  public $online;
  public $activation;
  public $phone_number;
  public $status;  
  public $points;	

    
  public function initialize($fid, $un, $pass, $fn, $ln, $gen, $ar, $mail, $cls, $scl, $dep, $abt, $fav_sub, $rid , $pic, $act, $pn){  
    $this->fbid = $fid;
    $this->username = $un;
    $this->password = $pass;
    $this->firstname = $fn;  
    $this->lastname = $ln;
    $this->gender = $gen;
    $this->age_range = $ar;  
    $this->email = $mail;
    $this->sclass = $cls;
    $this->school = $scl;
    $this->department = $dep;
    $this->about = $abt;
    $this->fav_subject = $fav_sub;  
    $this->datecreated =  strftime("%Y-%m-%d %H:%M:%S", time());
    $this->referrer_id = $rid;
    $this->picture_url = $pic; 
    $this->online = false;  
    $this->activation = $act;
	$this->phone_number = $pn;   
    if($fid!=null){
        $this->status = 1;
    }
    else{
        $this->status = 0; 
    }
	$this->points = 0;  
  }
	
  public static function find_all($offset) {
		return self::find_by_sql("SELECT * FROM " .self::$table_name. " LIMIT 10 OFFSET {$offset}");
  }
  
  public static function find_by_id($id=0) {
      global $database;
      $userid = $database->escape_value($id);
      
      $result_array = self::find_by_sql("SELECT * FROM " .self::$table_name. " WHERE id={$userid} LIMIT 1");
      return !empty($result_array) ? array_shift($result_array) : false;
  }
    
  public static function find_by_fbid($fid=0) {
      global $database;
      $fbuid = $database->escape_value($fid);
      
      $result_array = self::find_by_sql("SELECT * FROM " .self::$table_name. " WHERE fbid={$fbuid} LIMIT 1");
      return !empty($result_array) ? array_shift($result_array) : false;
  }    
    
  public static function find_by_code($code=0){
      global $database;
      $c = $database->escape_value($code);
      
      $result_array = self::find_by_sql("SELECT * FROM " .self::$table_name. " WHERE activation = '{$c}' AND status = 0 LIMIT 1");
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
    
  public static function find_by_username($username=""){
      global $database;
      
      $uname = $database->escape_value($username);
      
      $result_array = self::find_by_sql("SELECT * FROM " .self::$table_name. " WHERE username = '{$uname}' LIMIT 1");
      
      return !empty($result_array) ? true : false;
  }  
	
  public static function userPhoneExists($phone=""){
      global $database;
      
      $pn = $database->escape_value($phone);
      
      $result_array = self::find_by_sql("SELECT * FROM " .self::$table_name. " WHERE phone_number = '{$pn}' LIMIT 1");
      
      return !empty($result_array) ? true : false;
  }  
    
  public static function find_by_FLname($uid, $fname, $lname, $offset){
      $result_array = self::find_by_sql("SELECT * FROM " .self::$table_name. " WHERE id NOT LIKE {$uid} AND (firstname='{$fname}' AND lastname='{$lname}') OR (firstname='{$lname}' AND lastname='{$fname}') LIMIT 50 OFFSET {$offset}");
		return !empty($result_array) ? $result_array : false;
  }
  
  public static function find_by_name($uid, $name, $offset){
      $result_array = self::find_by_sql("SELECT * FROM " .self::$table_name. " WHERE id NOT LIKE {$uid} AND (firstname='{$name}' OR lastname='{$name}') LIMIT 50 OFFSET {$offset}");
		return !empty($result_array) ? $result_array : false;
  }

  public static function find_User_by_School($skul="", $offset=0, $id=0){
      global $database;
      
      $sk = $database->escape_value($skul);
      $os = $database->escape_value($offset);
      $uid = $database->escape_value($id);
      
      $result_array = self::find_by_sql("SELECT * from ".self::$table_name." WHERE id NOT LIKE {$uid} AND school = '{$sk}' LIMIT {$os}");
      
      return !empty($result_array) ? $result_array : false;
  }
        
  public static function authenticateMail($email="", $password="") {
    global $database;
    $email = $database->escape_value($email);
    $password = $database->escape_value($password);
    $password_hash =  md5($password);

    $sql  = "SELECT * FROM " .self::$table_name;
    $sql .= " WHERE email = '{$email}' ";
    $sql .= "AND password = '{$password_hash}' ";
    $sql .= "LIMIT 1";
    $result_array = self::find_by_sql($sql);
   
		return !empty($result_array) ? array_shift($result_array) : false;
  }
    
  public static function authenticateUser($name="", $password="") {
    global $database;
    $name = $database->escape_value($name);
    $password = $database->escape_value($password);
    $password_hash =  md5($password);

    $sql  = "SELECT * FROM " .self::$table_name;
    $sql .= " WHERE username = '{$name}' ";
    $sql .= "AND password = '{$password_hash}' ";
    $sql .= "LIMIT 1";
    $result_array = self::find_by_sql($sql);
   
		return !empty($result_array) ? array_shift($result_array) : false;
  }    
  
  public static function userExists($email="") {
    global $database;
    $email = $database->escape_value($email);

    $sql  = "SELECT * FROM " .self::$table_name;
    $sql .= " WHERE email = '{$email}' ";
    $sql .= "LIMIT 1";
    $result_array = self::find_by_sql($sql);
     
    return !empty($result_array) ? true : false;
               
  }
    
  public static function usernameExists($uname="") {
    global $database;
    $uname = $database->escape_value($uname);

    $sql  = "SELECT * FROM " .self::$table_name;
    $sql .= " WHERE username = '{$uname}' ";
    $sql .= "LIMIT 1";
    $result_array = self::find_by_sql($sql);
    
    return !empty($result_array) ? true : false;
                
  }
	
  public static function getTopPoints(){
	  
  }	
	
  public static function getAllPoints(){
	  self::find_by_sql("SELECT * FROM " .self::$table_name. " WHERE username = '{$uname}' LIMIT 1");
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
     $sql= "INSERT INTO " .self::$table_name. "(fbid, username, password, firstname, lastname, gender, age_range, email, sclass, school, department, about, fav_subject, datecreated, referrer_id, picture_url, online, activation, phone_number, status, points) VALUES ('".$database->escape_value($this->fbid)."','".$database->escape_value($this->username)."','".$database->escape_value($this->password)."','".$database->escape_value($this->firstname)."','".$database->escape_value($this->lastname)."','".$database->escape_value($this->gender)."','".$database->escape_value($this->age_range)."','".$database->escape_value($this->email)."','". $database->escape_value($this->sclass)."','".$database->escape_value($this->school)."','".$database->escape_value($this->department)."','".$database->escape_value($this->about)."','".$database->escape_value($this->fav_subject)."','".$database->escape_value($this->datecreated)."','".$database->escape_value($this->referrer_id)."','".$database->escape_value($this->picture_url)."','".$database->escape_value($this->online)."','".$database->escape_value($this->activation)."','".$database->escape_value($this->phone_number)."','".$database->escape_value($this->status)."','".$database->escape_value($this->points)."')";
	
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
	  
	return $database->query($sql);   
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
