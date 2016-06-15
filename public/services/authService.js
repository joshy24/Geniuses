myApp.service('authService', ['$state', 'currentUser', 'logout','storageService', function($state, currentUser, logout, storageService){
    
    this.isLoggedIn = function(){
       var sat = storageService.getStorageValue('at');
       var rat = storageService.getStorageValue('rt');
        
       if(sat && sat!=null && rat && rat!=null){
           return true;
       }
       else{
           return false;
       }
    }
    
    this.logOut = function(){
         send("logout");
         localStorage.clear();
         $state.go("login");    
    }
    
    var send = function(dat){
         logout.sendData(dat);
    }
    
    this.setRt = function(token){
        storageService.setStorageValue("rt", token);
    }
    
    this.getRt = function(){
        var rat = storageService.getStorageValue('rt');
        if(rat && rat!=null){
             return rat;
        }
        else{
             return false;
        }
    }
    
    this.setAt = function(token){
        storageService.setStorageValue("at", token);
    }
    
    this.getAt = function(){
        var sat = storageService.getStorageValue('at');
        if(sat && sat!=null){
             return sat;
        }
        else{
             return false;
        }
    }
    
    this.setFt = function(token){
        storageService.setStorageValue("ft", token);
    }
    
    this.getFt = function(){
        var fat = storageService.getStorageValue('ft');
        
        if(fat && fat!=null){
            return fat;
        }
        else{
            return false;
        }
    }
    
    this.getUser = function(){
        user = getClaimsFromToken();
        if(user){
            return user;
        }
        else{
            
            return false;
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
           return data.user;
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
    
    
}]);