myApp.directive('testDirect', function(){
    return{
        restrict: "EAC",
        scope: {
            post: "="
        },
        controller: ['$scope', function($scope){
            $scope.$watch('post', function(){
                console.log($scope.post);
            })
        }]
    }
});