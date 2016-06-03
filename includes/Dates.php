<?php 

class Dates{
    
    
    public static function getCurrentDateTime(){
        return date('Y-m-d H:i:s');
    }
    
    //in the future the user time and date will  be computed specific to the user 
    /*function now($str_user_timezone,
        $str_server_timezone = CONST_SERVER_TIMEZONE,
        $str_server_dateformat = CONST_SERVER_DATEFORMAT) { //php 5.2 >
 
      // set timezone to user timezone
      date_default_timezone_set($str_user_timezone);

      $date = new DateTime('now');
      $date->setTimezone(new DateTimeZone($str_server_timezone));
      $str_server_now = $date->format($str_server_dateformat);

      // return timezone to server default
      date_default_timezone_set($str_server_timezone);

      return $str_server_now;
    
    }*/
}

?>