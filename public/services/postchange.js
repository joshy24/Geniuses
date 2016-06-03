myApp.factory('postChange',['$rootScope', function($rootScope){
  var service = {};
  service.post = false;
  service.id = null;
  service.to = null;    
    
  service.sendData = function(dat, dat2, to){
      this.post = dat;
      this.id = dat2;
      this.to = to;
      $rootScope.$broadcast('postchange');
  };
  service.getPost = function(){
    return this.post;
  };
  service.getId = function(){
    return this.id;  
  };    
  service.getTo = function(){
    return this.to;  
  }    
  return service;
}]);
