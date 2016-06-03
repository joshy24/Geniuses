myApp.service('getExternalPost',['$q','$http','authService','service','externalpost','responseReview', function($q,$http,authService,service,externalpost,responseReview){
    var pid = null;               
    var post = [];   
            
    this.getPost = function(id){
        pid = id;
        doGetPost();
    }                             
    
    var send_in = function(data){
    
       var url = "endpoints/userData2.php";
        
       data.at = authService.getAt();
       data.rt = authService.getRt();
      
       if(data.rt===false||data.at===false){
           authService.logOut();
       }    
        
       var deferred = $q.defer();
       $('.spinner-div').show();
       $http.post(url, data).then(
           function successCallback(response){
              deferred.resolve(response);
               $('.spinner-div').fadeOut();
           },
           function errorCallback(){
              deferred.reject(false);
               $('.spinner-div').fadeOut();
           }
       );
      
       return deferred.promise;
    }          
              
    var send = function(data, url){
     var deferred = $q.defer();
       
       $http.post(url, data).then(
           function successCallback(response){
              deferred.resolve(response);
              
           },
           function errorCallback(){
              deferred.reject(false);
           }
       );
      
       return deferred.promise;
    }
    
    
    var doGetPost = function(){
        if(authService.isLoggedIn()){
            //sending thru logged in service
           
            data = {
                post_id: pid,
                method: "getPost"
            }
        
            send_in(data).then(function(response){
                if(responseReview.check(response.data)){
                    if(response.data.data!=false){
                        post = response.data.data;
                        
                        externalpost.sendData(post);
                    }
                    else{
                        return false;
                    }
                }
            }, function(error){
                console.log(error);
            });
        }
        else{
            //sending thru non-logged in service
            var data = {
                post_id: pid
            }

            var url = "endpoints/post.php";

            send(data, url).then(function(response){
                
                if(response.data.post!=false){
                    post = response.data.post;
                    
                    externalpost.sendData(post);
                }
                else{
                    return false;
                }
                
                $('.spinner-div').fadeOut();
                
            }, function(error){
                $('.spinner-div').fadeOut();
               console.log(error);
            });
        }   
    }
    
}])
