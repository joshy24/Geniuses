myApp.factory('logout',['$rootScope', function($rootScope){
  var service = {};
  service.data = false;
  service.sendData = function(dat){
      this.data = dat;
      $rootScope.$broadcast('logout');
  };
  service.getData = function(){
    return this.data;
  };
  return service;
}]);