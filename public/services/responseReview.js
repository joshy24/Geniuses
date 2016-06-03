myApp.factory('responseReview', ['authService','storageService', function(authService, storageService){
    
    var afactory = {};
    
    afactory.check = function(response){
        var at = response.at;
        var nt = response.nt;
        var it = response.it;
       
        if(it==true){
            authService.logOut();
        }
        else{
            if(authService.isLoggedIn()){
                
                if(at==null&&nt==null&&it==false){
                    authService.logOut();
                    return false;
                }
                else{
                    if(at==false&&nt==false){
                        //the at token is still valid
                        return true;
                    }
                    else{
                        if(at!=false&&at!=null&&nt==true){
                            if(getClaimsFromToken(at)==true){
                                storageService.setStorageValue("at", "");
                                storageService.setStorageValue("at", at);
                                return true;
                            }
                            else{
                                authService.logOut();
                                return false;
                            }
                            
                        }
                        else{
                            //unrecognised response
                            authService.logOut();
                            return false;
                        }
                    }
                }
                
            }
            else{
                //authService.logOut();
            }
        }
    }
    
    var getClaimsFromToken = function(){
        try{
           var token = storageService.getStorageValue('at');
           var user = {};
           if (typeof token !== 'undefined') {
               var encoded = token.split('.')[1];
               data = JSON.parse(urlBase64Decode(encoded));
           }
           return true;
        }
        catch(ex){
             send("img/defaultwhite.png");
             localStorage.clear();
             $state.go("login");
        }
    }
    
    function urlBase64Decode(str) {
           var output = str.replace('-', '+').replace('_', '/');
           switch (output.length % 4) {
               case 0:
                   break;
               case 2:
                   output += '==';
                   break;
               case 3:
                   output += '=';
                   break;
               default:
                   throw 'Illegal base64url string!';
           }
           return window.atob(output);
    }
    
    return afactory;
    
}]);