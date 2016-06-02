myApp.controller('modalController', ['$scope', '$state', '$stateParams', 'singlePost', 'authService', function($scope, $state, $stateParams, singlePost, authService){
    if(authService.isLoggedIn()){
        $scope.$on('single_post',function(){
            if(singlePost.getData()){
              $scope.singlepost = singlePost.getData();  
                
              $('#singlePostModal').modal('show');    
            }
        });
    }
    else{
        authService.logOut();
    }
    
}]);