myApp.factory('currentUser',['$rootScope', function($rootScope){
  var service = {};
  service.data = false;
  service.sendData = function(dat){
      this.data = dat;
      $rootScope.$broadcast('current_user');
  };
  service.getData = function(){
    return this.data;
  };
  return service;
}]);
