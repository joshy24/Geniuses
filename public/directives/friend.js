myApp.directive('myFriend', ['$state', function($state){
    return {
        restrict : "EA",
        scope: {
          friend: "=",
          set: "&"    
        },
        controller: ['$scope', function($scope){
			
			if($scope.friend.picture_url==""||$scope.friend.picture_url==null){
				$scope.friend_picture = "img/default.png";	
			}
			else{
				$scope.friend_picture = $scope.friend.picture_url;
			}
			
            $scope.showProfile = function(uid){
                $state.go('user', {id: uid});
            }
        }],
        template: '<div class="col-md-12 col-xs-12">  <div class="afriend"><div class="row"><div class="col-xs-1 col-md-1"><img class="img-circle" ng-src="{{friend_picture}}" height="40" width="40"></div>    <div class="col-xs-3 col-md-3"><h5 class="text-center capitalize">{{friend.firstname}}</h5></div> <div class="col-xs-3 col-md-3"><h5 class="text-center capitalize">{{friend.lastname}}</h5></div><div class="col-xs-3 col-md-3"><h5 class="text-center">{{friend.school}}</h5></div>    <div class="col-xs-2 col-md-2"><h5 class="text-center">{{friend.sclass}}</h5></div>    <button class="col=md-12 col-xs-12" ng-click="showProfile(friend.id)" id="view-profile-btn">view profile</button></div></div></div>'
    }
}]);