myApp.directive('userView', ['$compile', function($compile){
    
    var picture="";
    
    var template = "img/profile27.png";
    
    var getTemplate = function(){
       return "";
    }
    
    return {
        restrict : "EA",
        scope : {
            user: "=",
            us: "=",
            isnew: "@",
            closeModal: "&"
        },
        controller: ['$scope', '$state', 'setUserRequest', function($scope, $state, setUserRequest){
           $scope.ischecked = false;
           $scope.picture = $scope.user.picture_url ? $scope.user.picture_url : "img/default.png";   
            
           $scope.ifnew = JSON.parse($scope.isnew);    
            
           $scope.showUser = function(uid){
               
               if($scope.ifnew){
                   if(!$scope.ischecked){
                       $scope.ischecked = true;
                   }
                   else{
                       $scope.ischecked = false;
                   }
                   
                   setUserRequest.sendData($scope.user.id);
               }
               if(!$scope.ifnew){
                   $('#findModal').modal('hide');
                   $state.go("user", {id: uid});
               }
           }    
           
        }],
        template :'<div ng-show="!ifnew" class="afounduser row"><a href="" class="geniuses-a" ng-click="showUser(user.id)"><div class="col-xs-1 col-md-1"><img class="img-circle" ng-src="{{picture}}" id="user_img" height="35" width="35"></div><div class="col-xs-5 col-md-5"><h5 class="text-center" id="first_name" >{{user.firstname}} {{user.lastname}} </h5></div> <div class="col-xs-2 col-md-2"><h5 class="text-center">{{user.sclass}} </h5></div><div class="col-md-4 col-xs-4"><h5 class="text-center">{{user.school}}</h5></div> </a></div> <!-- ############## -->  <div ng-show="ifnew" class="afounduser row"><a href="" class="geniuses-a" ng-click="showUser(user.id)"><div class="col-xs-1 col-md-1"><img class="img-circle" ng-src="{{picture}}" id="user_img" height="35" width="35"></div><div class="col-xs-4 col-md-4"><h5 class="text-center" id="first_name" >{{user.firstname}} {{user.lastname}} </h5></div> <div class="col-xs-2 col-md-2"><h5 class="text-center">{{user.sclass}} </h5></div><div class="col-md-4 col-xs-4"><h5 class="text-center">{{user.school}}</h5></div> <div class="col-md-1 col-xs-1"><img ng-show="ischecked" id="request-checked-img" src="img/verify.png" height="25" width="25"></div></a></div>'    
    }
}]);