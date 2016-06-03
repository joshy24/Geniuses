<?php
    require_once 'Database.php';
    require_once 'Posts.php';
    require_once 'Dates.php';
    require_once 'Subjects.php';
    require_once 'User.php';
    require_once 'Comments.php';

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
class Questions {
    //put your code here
  protected static $table_name = "questions";

    
  public $question_id;
  public $subject;
  public $year;    
  public $question;
  public $optionA;
  public $optionB;
  public $optionC; 
  public $optionD;
  public $answer; 
  public $instruction;
  public $explanation;
  public $topic;    
  public $class;
  public $image;
  public $explanationimage;   
  public $exam_type;
      
    
  public static function find_exam_year($subject="", $e_type="", $year){
      
       global $database;
       
       $subj = strtolower($subject);
      
       $sql = "SELECT * FROM {$subj} WHERE exam_type='{$e_type}' AND year = {$year}";
      
       $result_set = $database->query($sql);
     
       $object_array = array();
      
       while($row = $database->fetch_array($result_set)){
         
          $object_array[]=$row;
         
       }
      
       return !empty($object_array) ? $object_array : false;
  }
    
  public static function find_exam($subject="", $number=0, $clas="", $topics=[], $e_type=""){
      
      global $database;
      
      foreach($topics as $key => $topic) {
          $topics[$key] = $database->escape_value($topic);
      }
      
      $newtopics = join("','", $topics);
      
      $subj = strtolower($subject);
      
      if($clas=="All"){
         $sql = "SELECT * FROM {$subj} WHERE topic IN ('$newtopics') AND exam_type='{$e_type}' ORDER BY RAND() LIMIT {$number}";
      }
      else{
         $sql = "SELECT * FROM {$subj} WHERE topic IN ('$newtopics') AND class='{$clas}' AND exam_type='{$e_type}' ORDER BY RAND() LIMIT {$number}"; 
      }
      
      $result_set = $database->query($sql);
      
      $object_array = array();
      
      while($row = $database->fetch_array($result_set)){
          $object_array[]=$row;
      }
      
      return !empty($object_array) ? $object_array : false;
   }
	
  public static function find_all() {
		return self::find_by_sql("SELECT * FROM questions");
  }
    
  public static function find_by_id($id,$sub){
        $sql = "SELECT * FROM ".$sub." WHERE question_id={$id} LIMIT 1";
		$result_array = self::find_by_sql($sql);
		return !empty($result_array) ? array_shift($result_array) : false;
  }    
      
  public static function find_by_name($sub="", $id=0){

      $subj = strtolower($sub);
      
      $query ="SELECT * FROM {$subj} WHERE question_id={$id} LIMIT 1";
      
      $result_array = self::find_by_sql($query);
      
		return !empty($result_array) ? array_shift($result_array) : false;
  }    
    
  public static function find_by_year($year, $subject){
       $result_array = self::find_by_sql("SELECT * FROM " .self::$table_name ." WHERE year={$year} AND subject={$subject}");
		return !empty($result_array) ? $result_array : false;
  }
        
  public static function find_by_topic($topic, $subject){
       $result_array = self::find_by_sql("SELECT * FROM " .self::$table_name ." WHERE topic={$topic} AND subject={$subject}");
		return !empty($result_array) ? $result_array : false;
  }    

  public static function find_by_class($theclass, $subject){
       $result_array = self::find_by_sql("SELECT * FROM " .self::$table_name ." WHERE class='{$theclass}' AND subject='{$subject}'");
  
       return !empty($result_array) ? $result_array : false;
  }
    
  public static function find_by_topic_and_class($topic, $class, $subject){
       $result_array = self::find_by_sql("SELECT * FROM " .self::$table_name ." WHERE topic={$topic} AND class={$class} AND subject={$subject}");
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
	  $object_vars = $this->attributes();
	  // We don't care about the value, we just want to know if the key exists
	  // Will return true or false
	  return array_key_exists($attribute, $object_vars);
  }
  
  protected function attributes(){
    return get_object_vars($this);
  }
  
}
    
?>    