myApp.service('login', ['$http', '$q', 'authService', function($http, $q, authService){
    var data=[];
    var url = "";
    
    this.make = function(dat, ur){
        url = ur;
        data = dat;
    }
    
    this.makeFBlogin = function(){
        
    }
    
    this.getFBUserSignedIn = function(id, fn, ln, ar, gn, purl, mail){
        if(id&&fn&&ln&&ar){
            url = "endpoints/fblogin.php";
            data = {
                email: mail,
                id: id,
                fname: fn,
                lname: ln,
                age_range: ar,
                gender: gn,
                pic_url: purl,
                method: "checkUserExists"
            }
        }
    }
    
    this.setFBUserNameUpdate = function(username, id){
        if(username&&id){
            url = "endpoints/fblogin.php";
            data = {
                user_id: id,
                username: username,
                method: "UpdateProfileUserName"
            }
        }
    }
    
    this.setFBUserDetailsUpdate = function(username, id, sclass, school, dep, num){
        if(username&& id&& sclass&& school&& dep&& num){
            url = "endpoints/fblogin.php";
            data={
                username:username,
                user_id:id,
                sclass: sclass,
                school: school,
                department: dep,
				phone: num,
                method: "UpdateProfileAll"
            }
        }
    }
    
    this.send = function(){
        if(url==""){
            url = "endpoints/login.php";
        }
       
      if(data!=[]){
        var deferred = $q.defer();
       $('.spinner-div').show();
       $http.post(url, data).then(
           function successCallback(response){
              $('.spinner-div').fadeOut();
              deferred.resolve(response);
           },
           function errorCallback(error){
               $('.spinner-div').fadeOut();
              deferred.reject(error);
           }
       );
      
       return deferred.promise;
      }
    }
    
}]);