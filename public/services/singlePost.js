myApp.factory('singlePost',['$rootScope', function($rootScope){
  var service = {};
  service.data = false;
  service.sendData = function(dat){
      this.data = dat;
      $rootScope.$broadcast('single_post');
  };
  service.getData = function(){
    return this.data;
  };
  return service;
}]);