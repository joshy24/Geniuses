myApp.directive('profileItem', ['$compile', function ($compile){
    
    var un,fn, ln, em, cls, dep, fav;
    
    
    var getTemplate = function(data){
        var template = '';
        
        switch(data.number){
            case 1:
                template = '<h2 class="info">Profile Information</h2><h4 class="alabel">UserName</h4> <input class="profile-info" type="text" value=' +data.username +' ng-model="editProfile.username"><h4 class="alabel">First Name</h4><input class="profile-info" type="text" placeholder="" value="' +data.firstname +'" ng-model="editProfile.firstname"><h4 class="alabel">Last Name</h4><input class="profile-info" type="text" value="' +data.lastname +'" ng-model="editProfile.lastname"> <h4 class="alabel">Email Address</h4><input class="profile-info" type="text" placeholder="" value="' +data.email +'" ng-model="editProfile.email"><h4 class="alabel">Class</h4><input class="profile-info" type="text" placeholder="" value="' +data.aclass +'" ng-model="editProfile.aclass"><h4 class="alabel">Department</h4><input class="profile-info" type="text" placeholder="" value="' +data.department +'" ng-model="editProfile.department"><h4 class="alabel">Favourite Subject</h4><input class="profile-info" type="text" placeholder="" value="' +data.fav_subject +'" ng-model="editProfile.fav_subject"><button ng-click="submitEdited()" class="profile-save-button">Update Profile</button>';
                console.log(data.fav_subject)
                break;
            case 2:
                template = '<h2 class="password">Change Password</h2><h4 class="alabel">Password</h4><input class="profile-info" type="password"><h4 class="alabel">Retype Password</h4><input class="profile-info" type="password"><button class="save-button">Save</button>';
                break;
            case 3:
                template = '<h2 class="password">Delete Account</h2><h5 class="msg">Note that deleting your account is irriversible.</h5><button class="delete-button">Delete My Account</button>';
                break;
        }
        
        return template;
    }
    
    var linker = function(scope, element, attrs) {
        
        scope.$watch('content', function(){
            element.html(getTemplate(scope.content));
            $compile(element.contents())(scope);
        });
        
    }
    
    return {
      restrict: "E",
      link: linker,
      scope: {
            content:'='
      }
    }
    
    
}]);