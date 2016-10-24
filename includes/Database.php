<?php
 require_once 'config.php';
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Database
 *
 * @author Joshua
 */
class Database {
    
    private $connection;
    private $magic_quotes_active;
    private $real_escape_string_exists;
    
    function __construct() {
        $this->openConnection();
        $this->magic_quotes_active = get_magic_quotes_gpc();
	    $this->real_escape_string_exists = function_exists( "mysql_real_escape_string" ); // i.e. PHP >= v4.3.0
    }
    
    public function openConnection() {
      $this->connection = mysqli_connect(DB_SERVER, DB_USER, DB_PASS);
        if (!$this->connection) {
            die("Database connection failed: " . mysqli_error());
        }
        else{
            mysqli_set_charset($this->connection,"utf8");
            $db_select = mysqli_select_db($this->connection, DB_NAME);
            if (!$db_select) {
                    die("Database selection failed: " . mysqli_error());
            }
        }
    }
    
    public function closeConnection(){
       if(isset($this->connection)) {
	 mysqli_close($this->connection);
	 unset($this->connection);
       }
    }
    
    public function query($sql){
        $result = mysqli_query($this->connection, $sql);
        if (!$result) {
                die("Database query failed: " . mysqli_error());
        }
        
        return $result;
    }
    
    public function escape_value( $value ) {
		if( $this->real_escape_string_exists ) { // PHP v4.3.0 or higher
			// undo any magic quote effects so mysql_real_escape_string can do the work
			if( $this->magic_quotes_active ) { $value = stripslashes( $value ); }
			$value = mysqli_real_escape_string($this->connection, $value );
		} else { // before PHP v4.3.0
			// if magic quotes aren't already on then add slashes manually
			if( !$this->magic_quotes_active ) { $value = addslashes( $value ); }
			// if magic quotes are active, then the slashes already exist
		}
		return $value;
	}
        
    public function fetch_array($result_set){
        return mysqli_fetch_array($result_set, MYSQLI_ASSOC);
    }
   
    public function num_rows($result_set) {
      return mysqli_num_rows($result_set);
    }

    public function insert_id() {
     // get the last id inserted over the current db connection
      return mysqli_insert_id($this->connection);
    }

    public function affected_rows() {
      return mysqli_affected_rows($this->connection);
    }
    
}

$database = new Database();
?>