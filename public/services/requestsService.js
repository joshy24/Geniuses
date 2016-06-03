myApp.factory('requestsService',['$rootScope', function($rootScope){
  var service = {};
  service.requests = false;  
    
  service.sendData = function(req){
     service.requests = req;
     $rootScope.$broadcast('requestschange');
  };
  service.getRequests = function(){
    return this.requests;
  };
  return service;
}]);
