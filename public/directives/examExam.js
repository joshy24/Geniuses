myApp.directive('examExam', ['$sce', '$state', 'service', 'responseReview', 'storageService', function($sce, $state, service, responseReview, storageService, explanation){
    return{
        restrict: "E",
        scope: {
            data: "="
        },
        templateUrl: "templates/examTemplate.html",
        controller: ['$scope', '$interval', function($scope, $interval){
            
            var default_small = "img/default_small.png";
            var default_image_url = "img/logo new (2).png";
            
            $('.horizontal-menu').hide();
	
            try{//caught when scope.questions is not yet set
            $scope.answer_text = "";
            $scope.current_count=1;
            $scope.question_text = "";
            $scope.question_text = "yes <br>hello guys";
            $scope.question_image = default_small;
            $scope.optionA_text="",$scope.optionB_text="",$scope.optionC_text="", $scope.optionD_text="" ;
            $scope.optionA_img = default_small;
            $scope.optionB_img = default_small;
            $scope.optionC_img = default_small;
            $scope.optionD_img = default_small;
            $scope.total_number_of_questions = $scope.data.questions.length;
            $scope.image_url = default_image_url;
            $scope.image_text = "";
            $scope.answers = [];
            $scope.instruction = "";
            $scope.text_explanation = null;
            $scope.image_explanation = null;
            $scope.explanation_image = null;
            $scope.question_topic = "";
            $scope.time_allowed = 0;
            $scope.question_number = "";
            var selected_answers = new Array($scope.total_number_of_questions);
            var hours = 100;
            var minutes = 0;
            var seconds = 0;
            var timer;
            var explanation_allowed = true;
        
            //end of variable declaration;
            
            $scope.mode = $scope.data.mode;
            
            $scope.questions = $scope.data.questions; // pass our questions from data to variable questions for convenience
            $scope.exam_type = $scope.data.examtype;
            $scope.subject = $scope.data.subject;
            
            var resource_path = "images/"+$scope.exam_type+"/"+$scope.subject;
            $scope.subject_img = "images/subjects/" +$scope.subject+".png";
            
            hideLoadingImages();    
                
            setQuestionParameters();
            
            setModeParameters();
            
            setExamTime();
            
            }
            catch(e){
                
            }
            
            // stops the interval
            $scope.stop = function() {
              $interval.cancel(timer);
            };
 
            $scope.$on('$destroy', function() {
              $scope.stop();
            });
            
            function setExamTime(){
                
                if($scope.mode == "Exam"){
                     $scope.time_allowed  = $scope.data.time;
                     seconds = $scope.data.time;
                }
                else{
                    $scope.time_allowed = null;
                }
                    
            }
            
            function setModeParameters(){
                if($scope.mode == "Exam"){
                    $('#timer-div').show();
                    explanation_allowed = false;
                    startTimer();
                }
                if($scope.mode == "Practice"){
                    $('#timer-div').hide();
                    explanation_allowed = true;
                }
            }

            function updateTime(){
                seconds -=1;
                if(seconds>0){
                    $scope.the_time = switchTime(seconds);
                }
                else{
                    $interval.cancel();
                    setResult();
                }
                
            }
            
            function switchTime(seconds){
                var sec = seconds%60;
                
                var hours = 0;
                
                var a = seconds/60;
                
                var mins = Math.floor(a);
                
                if(mins>=60){
                    hours = Math.floor(mins/60);
                    
                    mins = mins%60;
                }
                
                h = "0"+hours;
                m = mins;
                if(mins<10){
                    m = "0"+mins;
                }
                s = sec;
                if(sec<10){
                    s = "0" +sec;
                }
                
                return h +" : " +m +" : " +s;  
                
            }
            
            function setQuestionParameters(){
                hideExplanations();
                showLoadingImages();
                setQuestionNumberText();
                setQuestion();
                setOptions();
                setImage();
                
                if($scope.current_count>1){
                  if(selected_answers[$scope.current_count-1]==undefined){    
                    resetRadios();
                  }
                  else{
                    setRadio();  
                  }
                }
                else{
                  if(selected_answers[0]==undefined){    
                    resetRadios();
                  }
                  else{
                    setRadio();  
                  }
                }

            }
            
            function hideExplanations(){
                $('.textexplanation').hide();
                $('.imageexplanation').hide();
                $('.explanationimage').hide();
            }
            
            //functions 
			
			$scope.pauseExam = function(){
				if($scope.mode=="Exam"){
					pauseTimer();
				}
				$('#pauseModal').modal('show');
			}
			
			$('#pauseModal').on('hide.bs.modal', function () {
				continue_exam();
			});
			
			var continue_exam = function(){
				if($scope.mode=="Exam"){
					resumeTimer();
				}
			}
			
            $scope.gotoQuestion = function(num){
                if(num<=$scope.total_number_of_questions){
                    $scope.current_count = num;
                    
                    setQuestionParameters();
                }
            }   
            
            $scope.nextQuestion = function(){
                if($scope.current_count<$scope.total_number_of_questions){
                    $scope.current_count+=1;
                    
                    setQuestionParameters();
                }
            }
            
            $scope.previousQuestion = function(){
                if($scope.current_count>1){
                    $scope.current_count-=1;
                    
                    setQuestionParameters();
                }
            }
            
            $scope.showExplanation = function(){
                if(explanation_allowed==true){
                    $scope.text_explanation = null;
                    $scope.image_explanation = null;
                    $scope.explanation_image = null;

                    setExplanation();

                    if($scope.text_explanation!=null||$scope.image_explanation!=null){

                            if($scope.text_explanation==null&&$scope.image_explanation!=null){
                                $scope.image_explanation = $scope.image_explanation;
                                $scope.text_explanation = "";

                                $('.textexplanation').hide();
                                $('.imageexplanation').show();
                            }
                            if($scope.text_explanation!=null&&$scope.image_explanation==null){
                                $scope.text_explanation = $scope.text_explanation;
                                $scope.image_explanation = default_small;

                                $('.textexplanation').show();
                                $('.imageexplanation').hide();
                            }

                            if($scope.explanation_image==null){
                                $('.explanationimage').hide();
                            }
                            else{
                                $('.explanationimage').show();
                            }

                            $scope.explanation_information = "Explanation to " +$scope.subject +" Question " +$scope.current_count +" of " +$scope.total_number_of_questions;


                            $('#explanationModal').modal('show');
                    }
                    else{
                        $scope.message = "The explanation to this question is not available because the question is being edited. please move on to the next question.";
                        $('#messageModal').modal("show");
                    }    
                    
                    $scope.answer_text = "The answer is "+$scope.questions[$scope.current_count-1].answer+". ";
                    
                    var ans = "";
                    
                    switch($scope.questions[$scope.current_count-1].answer){
                        case "A":
                            ans = $scope.questions[$scope.current_count-1].optionA;
                            break;
                        case "B":
                            ans = $scope.questions[$scope.current_count-1].optionB;
                            break;
                        case "C":
                            ans = $scope.questions[$scope.current_count-1].optionC;
                            break;
                        case "D": 
                            ans = $scope.questions[$scope.current_count-1].optionD;
                            break;
                    }
                    
                    if(ans.match(/\d+(-)\d+(-)\D/g)){
                        
                    }
                    else{
                        $scope.answer_text+=ans;
                    }
                    $('#explanation-image-loading').hide();
                	$('#image-explanation-loading').hide();
                }
                else{
					$scope.message = "Explanations cannot be viewed in Exam Mode";
					$('#messageModal').modal('show');
				}
               
            }
            
            $scope.endExam = function(){
                if($scope.mode=="Exam"){
                    stopTimer();
                    setResult();
                    $('#endExamModal').modal('hide');
                }
                else{
                    //show End of Practice Modal
                    $('#endExamModal').modal('hide');
                    $state.go('examparameters');
                }
            }
            
            $scope.setAnswer = function(ch){
                selected_answers[$scope.current_count-1] = ch;
                setRadio();
            }
        
            $scope.showMaxImage = function(){
                
                var image_url = resource_path+"/images"+$scope.questions[$scope.current_count-1].image; 
                
                if(aContainsB(image_url, ".png")){
                       $scope.max_image = image_url;
                       $('#showImageModal').modal("show");
                }
                else{
                    
                }
                
            }
            
            function setQuestionNumberText(){
                $scope.question_number = "Question "+$scope.current_count+" of " +$scope.total_number_of_questions;
            }
            
            function setQuestion(){
					var question_url = resource_path+"/QuestionImages" +$scope.questions[$scope.current_count-1].question.trim();

					if(aContainsB(question_url, ".png")){
						 $scope.question_image = question_url;
						 $scope.question_text = "";
						 showQuestionImage();
					}
					else if(aContainsB(question_url, ".txt")){
						 
					}
					else{
						 $scope.question_text = $scope.questions[$scope.current_count-1].question;
						 if($scope.questions[$scope.current_count-1].instruction!=null&&$scope.questions[$scope.current_count-1].instruction!=undefined){
							 $scope.question_text = $scope.questions[$scope.current_count-1].instruction + $scope.question_text;
						 }
						 $scope.question_image = default_small;
						 showQuestionText();
					}  
            }
            
            function setOptions(){
                
                var optionA = $scope.questions[$scope.current_count-1].optionA.trim();
                
                if(optionA.match(/\d+(-)\d+(-)\D/g)){
                       $scope.optionA_img = resource_path+"/ImageOptions/"+$scope.questions[$scope.current_count-1].optionA.trim()+".PNG";
                       $scope.optionB_img = resource_path+"/ImageOptions/"+$scope.questions[$scope.current_count-1].optionB.trim()+".PNG";
                       $scope.optionC_img = resource_path+"/ImageOptions/"+$scope.questions[$scope.current_count-1].optionC.trim()+".PNG";
                       $scope.optionD_img = resource_path+"/ImageOptions/"+$scope.questions[$scope.current_count-1].optionD.trim()+".PNG";
                    
                        var img = new Image();
                        img.onload = function () {
                            $scope.options_height = img.height;
                            $scope.options_width = img.width;
                            $scope.$apply();
                        }
                        img.src = $scope.optionA_img;
                    
                        showOptionImages();
                }
                else {
                       $scope.optionA_text = "A. "+$scope.questions[$scope.current_count-1].optionA;
                       $scope.optionB_text = "B. "+$scope.questions[$scope.current_count-1].optionB;
                       $scope.optionC_text = "C. "+$scope.questions[$scope.current_count-1].optionC;
                       $scope.optionD_text = "D. "+$scope.questions[$scope.current_count-1].optionD;
                        
                       
                        
                       showOptionText();
                }
                
                $('.option-image-loading').hide();
            }
            
            function setExplanation(){
                var explanation = resource_path+"/Explanations/"+$scope.questions[$scope.current_count-1].explanation;
                var explanation_img = resource_path+"/ExplanationImages/"+$scope.questions[$scope.current_count-1].explanationimage;
                
                    if(aContainsB(explanation, ".png")) {   
                      $scope.image_explanation = explanation;
                    }
                    else {
                      $scope.image_explanation = null;    
                      try{
                        if($scope.questions[$scope.current_count-1].explanation.length>1){
                          $scope.text_explanation = $scope.questions[$scope.current_count-1].explanation;  
                        }
                        else{
                          $scope.text_explanation = null;  
                        }
                      }
                      catch(ex){
                          $scope.text_explanation = null;
                      }
                    }
             
                    if(aContainsB(explanation_img, ".png")){   
                       $scope.explanation_image = explanation_img;
                    }
                    else{
                       $scope.explanation_image = null;
                    }
            }
            
            function setImage(){
                var image_url = resource_path+"/images"+$scope.questions[$scope.current_count-1].image; 
                $scope.image_url = "";
                    if(aContainsB(image_url, ".png")) {
                       $scope.image_url = image_url;
                       $('.question-image').hide();
                       $('.question-image').fadeIn();
                    }
                    else {
                       $scope.image_url = "";
                       $('.question-image').hide();
                    }
                $('#question-image-loading').hide();
            }
            
            function hideLoadingImages(){
                $('#question-image-loading').hide();
                $('.option-image-loading').hide();
                $('#image-question-loading').hide();
                $('#explanation-image-loading').hide();
                $('#image-explanation-loading').hide();    
            }
            
            function showLoadingImages(){
                $('#question-image-loading').show();
                $('.option-image-loading').show();
                $('#image-question-loading').show();
                $('#explanation-image-loading').show();
                $('#image-explanation-loading').show();    
            }
            
            function showQuestionImage(){
                $('#question-text').hide();
                $('#question-image').hide();
                $('#question-image').fadeIn();  
                $('#image-question-loading').hide();
            }
            
            function showQuestionText(){
                $('#question-text').hide();
                $('#question-text').fadeIn();   
                $('#question-image').hide();
                $('#image-question-loading').hide();
            }
            
            function showOptionImages(){
                $('.question-option').hide();
                $('.question-option-img').hide();
                $('.question-option-img').fadeIn();
            }
            
            function showOptionText(){
                $('.question-option-img').hide();
                $('.question-option').hide();
                $('.question-option').fadeIn();
            }
            
            function showResult(r){
                $state.go('result', {result: r});
            }
            
            function setResult(){
                var et = "";
                
                if($scope.data.exam=="year"){
                    et = $scope.exam_type +" " +$scope.data.year;
                }
                if($scope.data.exam=="custom"){
                    et = $scope.exam_type;
                }   
                
                if($scope.mode == "Exam"){
                    var scores = computeScores();
                    
                    data = {
                        subject: $scope.subject,
                        exam_type: et,
                        exam_type_no_year:$scope.exam_type,
                        mode: "Exam",
                        attempted: scores[0],
                        correct: scores[1],
                        incorrect: scores[2],
                        percent_score: scores[3] +"%"
                    }
                    
                    showResult(data);
                }
            }
            
            function computeScores(){
                var correct = 0;
                var incorrect = $scope.total_number_of_questions;
                var attempted = 0;
                
                for(var i=0;i<$scope.total_number_of_questions;i++){
                    
                     if(selected_answers[i]!=undefined){
                         attempted+=1;
                     }
                    
                     if($scope.questions[i].answer == selected_answers[i]){
                         correct+=1;
                         incorrect-=1;
                     }
                }
                
                var percent = (correct/$scope.total_number_of_questions)*100;
                percent = Math.round(percent);
               
                var result = [attempted, correct, incorrect,percent];
                
                return result;
            }
            
            function stopTimer(){
                $interval.cancel(timer);
            }
            
            function startTimer(){
              $interval.cancel(timer);

              // store the interval promise
              timer = $interval(updateTime, 1000, seconds);
            }
            
            function pauseTimer(){
                 $interval.cancel(timer);
            }
            
            function resumeTimer(){
                $interval.cancel(timer);

              // store the interval promise
              timer = $interval(updateTime, 1000, seconds);
            }
            
            function doesFileExist(imageUrl) {
                if(imageUrl.endsWith(".png")){
                    return true;
                }
                else{
                    return false;
                }
            }
            
            $scope.getHtml = function(html){
                return $sce.trustAsHtml(html);
            };
            
            $scope.postToTimeline = function(){
                
                $('#toTimelineModal').modal('hide');
                
                var subject = $scope.subject.trim();
                
                var num=0;
                
                if($scope.current_count>1){
                    var num = $scope.current_count-1;
                }
                
                var qid = $scope.questions[num].question_id;
                
                if(service.setQuestionPost(subject,qid)==true){
                    service.send().then(function(response){
                        
                        if(response.data.data!=false&&response.data.data!=undefined){
                            //get stored posts
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
                                 $scope.message = "The current question has been sucessfully posted to your timeline.";
                                 $('#messageModal').modal('show');
                                
                            }
                            else if(response.data.data=="F"){
                                $scope.message = "This question was posted by one of your friends. The question has been reposted for you.";
                                $('#messageModal').modal('show');
                            }
                            else if(response.data.data=="U"){
                                $scope.message = "You have posted this question before. The question has been successfully reposted to your timeline.";
                                $('#messageModal').modal('show');
                            }
                            else{
                                
                            }
                         
                        }
                        
                    }, function(error){
                        $scope.message = "An error occurred posting this question to your timeline.";
                        $('#messageModal').modal('show');
                    });
                }
            }
            
            
            function isInt(value) {
              return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value));
            }
            
            function aContainsB(a, b) {
                return a.indexOf(b) >= 0;
            }
            
            function resetRadios(){
                try{
                 $('#useless-radio').attr('checked', 'checked');      
                 $("#useless-radio").prop("checked", true);
                }
                catch(ex){
                    
                }
            }
            
            function setRadio(){
                
                var num = $scope.current_count>1 ? $scope.current_count-1 : 0; 
                
                switch(selected_answers[num]){
                    case "A":
                      $('#radioA').attr('checked', 'checked');    
                      $('#radioA').prop('checked', true);
                      break;
                    case "B":
                      $('#radioB').attr('checked', 'checked');    
                      $('#radioB').prop('checked', true);  
                      break;
                    case "C":
                      $('#radioC').attr('checked', 'checked');    
                      $('#radioC').prop('checked', true);    
                      break;
                    case "D":
                      $('#radioD').attr('checked', 'checked');    
                      $('#radioD').prop('checked', true);    
                      break;    
                        
                }
            }
			
			if($state.current.name=="exam"){
				$('#startModal').modal('show');
			}
			else{
				$('#startModal').modal('hide');
			}
            
            
        }]
    }
}]);