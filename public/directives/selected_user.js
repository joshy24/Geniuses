myApp.directive('selectedUser', function(){
    return {
        restrict : "EA",
        controller:['$scope', function($scope){
            
            $scope.selected_user = [];
            
            this.setUser = function(user){
                $scope.selected_user.push(user);
            }
        }],
        template: ' <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h3 class="modal-title" ng-model="selected_user.firstname" id="myModalLabel">{{selected_user.firstname}}</h3> <h5 class="modal-title" ng-model="selected_user.lastname" >{{selected_user.lastname}}</h5>   <img ng-src="{{selected_user.picture_url}}" height="70" width="70" class="img-circle" style="margin 0px auto;">  <h5 ng-model="selected_user.username" >{{selected_user.username}}</h5><h5 ng-model="selected_user.school" >{{selected_user.school}}</h5><h5 ng-model="selected_user.aclass" >{{selected_user.aclass}}</h5>'
    }
});