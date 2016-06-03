myApp.factory('externalpost',['$rootScope', function($rootScope){
  var service = {};
  service.post = false;   
    
  service.sendData = function(dat){
      this.post = dat;
      $rootScope.$broadcast('externalpost');
  };
  service.getPost = function(){
    return this.post;
  };
  
  return service;
}]);
