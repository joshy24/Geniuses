myApp.directive('examResult', ['service', 'responseReview', 'storageService', function(service, responseReview, storageService){
    return{
        restrict: "E",
        scope: {
            result: "="
        },
        controller: ['$scope',function($scope){
            $scope.gen = false;
            $scope.fb = false;
            
            $scope.exam_type_no_year = $scope.result.exam_type_no_year;
            $scope.subject = $scope.result.subject;
            $scope.exam_type = $scope.result.exam_type;
            $scope.mode = $scope.result.mode;
            $scope.attempted = $scope.result.attempted;
            $scope.correct = $scope.result.correct;
            $scope.incorrect = $scope.result.incorrect;
            $scope.percent_score = $scope.result.percent_score;
            $scope.total_question_count = $scope.correct + $scope.incorrect;
            
            var msg1 = "I scored " +$scope.correct+"/" +$scope.total_question_count +" in a " +$scope.exam_type +" "  +$scope.subject +" exam on Geniuses.";
            var msg2 = "Geniuses has helped me prepare for my upcoming " +$scope.exam_type_no_year +" exam.";
            var msg3 = " Geniuses has helped me improve my knowledge of "+$scope.subject;
            var msg4 = "Geniuses is really cool.";
            
            var msgs = [msg1,msg2,msg3,msg4];
            
            $scope.selected_message = msgs[0];
            
            $scope.shareScore = function(){
                $('#shareModal').modal("show");
                $('#msgs-div').hide();
                $scope.selected_message = msgs[0];
            }
            
            $scope.showMsgs = function(ch){
                $('#msgs-div').show();
                
                switch(ch){
                    case "f":
                        $scope.fb = alter($scope.fb);  
                        break;
                    case "g":
                        $scope.gen = alter($scope.gen); 
                        break;
                }
            }
            
            $scope.setMessage = function(num){
                $scope.selected_message = msgs[num];
            }
                        
            function alter(avar){
                var v;
                if(avar == true){ 
                    v = false; 
                }
                else{
                    v = true;   
                }
                
                return v;
            }
            
            $scope.share = function(){
                if($scope.selected_message!=""){
                   if($scope.gen==true){
                       
                       if(service.setDiscussion($scope.selected_message)){
                          
                           service.send().then(function(response){
                            if(responseReview.check(response.data)==true&&response.status==200){
                                if(response.data.data!=false){
                                     
                                    var posts = storageService.getStorageValue("posts");
                            
                                    if(aContainsB(JSON.stringify(response.data.data), "postid")){
                                        if(posts!=false){
                                            posts.splice(0,0,response.data.data);

                                            storageService.setStorageValue("posts", posts);
                                        }
                                        else{
                                            posts = response.data.data;

                                            storageService.setStorageValue("posts", posts);
                                        }

                                        //show successful post message
                                        $('#shareModal').modal('hide');
                                        $scope.message = "The message was successfully posted on your timeline.";
                                        $('#messageModal').modal('show');

                                    }
                                    
                                }
                                else{
                                    showError();
                                }
                            }
                            else{
                               showError();    
                            }
                              
                           }, function(error){
                               showError();
                           });
                       }
                   }
                   if($scope.fb==true){
                       
                   }
                }
            }
            
            var showError = function(){
                 $('#shareModal').modal('hide');
                 $scope.message = "Ooops...the message was NOT successfully posted on your timeline.";
                 $('#messageModal').modal("show");
            }
            
            function aContainsB(a, b) {
                return a.indexOf(b) >= 0;
            }
            
        }],
        templateUrl: "templates/result.html"
    }
}]);