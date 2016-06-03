<?php

require_once 'jwt_helper.php';

class MyJWT{
    
    private $data = null;

    public static function getAccessToken($user){
        
        $tokenId    = uniqid();
        $issuedAt   = time();
        $notBefore  = $issuedAt + 10;             //Adding 10 seconds
        $expire     = $notBefore + 1800;            // Adding 30 mins in seconds
        $serverName = "geniusesng.com"; // Retrieve the server name from config file

        /*
         * Create the token as an array
        */
        $data = [
            'iat'  => $issuedAt,         // Issued at: time when the token was generated
            'jti'  => $tokenId,          // Json Token Id: an unique identifier for the token
            'iss'  => $serverName,       // Issuer
            'nbf'  => $notBefore,        // Not before
            'exp'  => $expire,           // Expire
            'user' => $user,
            'role' => "student"
        ];

        
        $secret_key = base64_decode(getenv('HTTP_POST_KEY'));

        $data = $data;

        $jwt = JWT::encode($data, $secret_key, 'HS512');

        return $jwt;
    }
    
    public static function getRefreshToken(){
         
        $tokenId    = uniqid();
        $issuedAt   = time();
        $notBefore  = $issuedAt + 10;             //Adding 10 seconds
        $expire     = $notBefore + 80400;            // Adding a day in seconds
        $serverName = "geniusesng.com"; // Retrieve the server name from config file
        
        /*
         * Create the token as an array
        */
        $data = [
            'iat'  => $issuedAt,         // Issued at: time when the token was generated
            'jti'  => $tokenId,          // Json Token Id: an unique identifier for the token
            'iss'  => $serverName,       // Issuer
            'nbf'  => $notBefore,        // Not before
            'exp'  => $expire,           // Expire
            'role' => "student"
        ];

        
        $secret_key = base64_decode(getenv('HTTP_POST_KEY'));

        $data = $data;

        $jwt = JWT::encode($data, $secret_key, 'HS512');

        return $jwt;
    }

}

?>