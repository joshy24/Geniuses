myApp.service('storageService', function(){
    
    this.setStorageValue = function(key, value){
        try{    if(key!=null&&key!=undefined&&$.isEmptyObject(key)==false&&value!=null&&value!=undefined&&$.isEmptyObject(value)==false){
                var newvalue = JSON.stringify(value);
                localStorage.setItem(key, newvalue);
                return true;
            }
            else{
                return false;
            }
        }
        catch(e){
            console.log(e);
            return false;
        }
    }
    
    this.getStorageValue = function(key){
        var value= localStorage.getItem(key);
        try{
            if(value){
                 var newvalue = JSON.parse(value);

                if(newvalue!=null&&newvalue!=undefined){
                    return newvalue;
                }
                else{
                   return false;   
                }

            }
            else{
                return false;
            }
        }
        catch(e){
            console.log(e);
            return false;
        }
    }
    
});