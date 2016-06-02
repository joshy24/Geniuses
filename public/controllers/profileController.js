myApp.controller('ProfileController', ['$rootScope', '$scope', '$state', 'service', 'responseReview', 'currentUser', 'authService', function($rootScope, $scope, $state, service, responseReview, currentUser, authService){
   
        $('.horizontal-menu').show();
        
        var user = authService.getUser();
        
        if(user.picture_url==""){
            $scope.current_img = "img/default.png";
        }
        else{
            $scope.current_img = user.picture_url;
        }
        
        $scope.setUserClass = function(cl){
            $scope.editProfile.aclass = cl;
        }
        
		$scope.deleteProfile = function(){
			service.setDeleteUser();
			service.send().then(function(response){
				if(responseReview.check(response.data)){
					authService.logOut();
				}
				
			}, function(error){
				
			})
		}
		
        $scope.editProfile = {
            username : user.username,
            firstname : user.firstname,
            lastname  : user.lastname,
            aclass : user.sclass,
            department : user.department,
            fav_subject : user.fav_subject,
            aboutme: user.about,
            hobby: user.hobby,
			phone_number: user.phone_number
            
        }
        
        if($scope.editProfile.aclass!=undefined&&$scope.editProfile.aclass!=null&&$scope.editProfile.aclass!=""){
            switch($scope.editProfile.aclass){
                case "SSS1":
                    $('#radioA').attr('checked', 'checked'); 
                    break;
                case "SSS2":
                    $('#radioB').attr('checked', 'checked'); 
                    break;    
                case "SSS3":
                    $('#radioC').attr('checked', 'checked'); 
                    break;    
            }
        }
        
        $scope.editPassword = {
            password : undefined,
            repassword : undefined
        }
        
        $scope.send = function(dat){
            currentUser.sendData(dat);
        }
    
        $scope.submitEdited = function(){
            data = {
                username : $scope.editProfile.username,
                firstname : $scope.editProfile.firstname,
                lastname : $scope.editProfile.lastname,
                email  : $scope.editProfile.email,
                aclass : $scope.editProfile.aclass,
                department : $scope.editProfile.department,
                fav_subject : $scope.editProfile.fav_subject,
                about: $scope.editProfile.aboutme,
				phone_number: $scope.editProfile.phone_number,
                method : "updateProfile"
            }
            
            if(service.setUpdateProfile(data)){
                service.send().then(function(response){
             
                    if(responseReview.check(response.data)==true){
                        var user = authService.getUser();

                        if(user!=undefined&&user!=null){
                            $scope.send(user.picture_url);
                            $scope.msg = "your profile has been updated";
                            $('#messageModal').modal("show");    
                        }  
                        else{
                            authService.logOut();
                        }

                    }
                    
                },function(error){
                    
                });
            } 
        }
        
        
            $scope.uploadFile = function(){
               var afile = $scope.myFile;
               
               if(afile!=null&&afile!=undefined){
                   $scope.validateandsend(afile);
               }
             }
             
             $scope.send = function(dat){
                  currentUser.sendData(dat);
             };
             
             $scope.validateandsend = function(afile){
                  var regex = new RegExp("([a-zA-Z0-9\s_\\.\-:])+(.jpg|.png|.gif|.jpeg)$");
                    if (regex.test(afile.name.toLowerCase())){

                        //Check whether HTML5 is supported.
                        if (typeof (afile) != "undefined") {
                            //Initiate the FileReader object.
                            var reader = new FileReader();
                            //Read the contents of Image File.
                            reader.readAsDataURL(afile);
                            reader.onload = function (e) {
                                //Initiate the JavaScript Image object.
                                var image = new Image();

                                //Set the Base64 string return from FileReader as source.
                                image.src = e.target.result;
                                
                                //Validate the File Height and Width.
                                image.onload = function () {
                                    var height = this.height;
                                    var width = this.width;
                                    if (height > 1000 || width > 1000) {
                                        document.getElementById('msg').innerHTML = "the image has to be less than 1000px wide and 1000px high";
                                    }
                                    else{
                                        
                                       if(service.setuploadImage(image.src)){
                                            service.send().then(function(response){
                                               
                                                if(response.status==200){
                                                    if(responseReview.check(response.data)==true){
                                                       
                                                          if(response.data.data!=false){
                                                                $('#myImage').attr('src', response.data.data);   
                                                                $scope.send(response.data.data);
                                                                $scope.msg = "your profile has been updated";
                                                                $('#messageModal').modal("show");   
                                                          }   
                                                          else{
                                                                $scope.msg = "Oooops...An error occurred uploading your new image please try again later!";
                                                                $('#messageModal').modal("show");  
                                                          }     
                                                    }
                                                }
                                            },function(error){
                                                console.log(error);
                                                document.getElementById('msg').innerHTML = "an error occurred uploading that image.";
                                            });   
                                       }    
                                         
                                    }
                                 }

                            }
                        } 
                        else {
                            alert("This browser does not support HTML5.");
                            return false;
                        }
                    } else {
                        alert("Please select a valid Image file.");
                        return false;
                    }
             }
        
        $('#profileview_button').attr('class', "current control-button");
        $('#profile-div').show();
        $('#password-div').hide();
        $('#delete-div').hide();
        
        $scope.showProfile = function(){
            $scope.account_type = $scope.editProfile;
            $('#profileview_button').attr('class', "current control-button");
            $('#passchange_button').attr('class', "control-button");
            $('#accdelete_button').attr('class', "control-button");
            
            $('#profile-div').show();
            $('#password-div').hide();
            $('#delete-div').hide();
        }
        $scope.showPassword = function(){
            $scope.account_type = $scope.editPassword;
            $('#profileview_button').attr('class', "control-button");
            $('#passchange_button').attr('class', "current control-button");
            $('#accdelete_button').attr('class', "control-button");
            
            $('#profile-div').hide();
            $('#password-div').show();
            $('#delete-div').hide();
        }
        $scope.showDelete = function(){
            $scope.account_type = $scope.deleteAccount;
            $('#profileview_button').attr('class', "control-button");
            $('#passchange_button').attr('class', "control-button");
            $('#accdelete_button').attr('class', "current control-button");
            
            $('#profile-div').hide();
            $('#password-div').hide();
            $('#delete-div').show();
        }
    
    $scope.goHome = function(){
        $state.go("home");
    }
    
}]);