myApp.controller('examParameterController', ['$scope', '$state', '$stateParams', 'service', 'responseReview', 'authService', 'storageService', function($scope, $state, $stateParams, service, responseReview, authService, storageService) {
  	
    $('.horizontal-menu').show();
    
    $('.exam-options').show();
    // $('.year-options').hide();
	
    $scope.examoption = "year";
    $scope.exam_parameters;
    $scope.questions = [];
    $scope.topics= [];
    $scope.subjects = ['Agriculture','Biology', 'Chemistry', 'Commerce', 'Economics', 'Government', 'Mathematics', ];
    $scope.selected_year = null;
    $scope.selected_topics = [];
    $scope.selected_subject = null;
    $scope.selected_class = null;
    $scope.selected_number_of_questions = null;
    $scope.selected_mode = null;
    $scope.selected_time = null;
    $scope.selected_examtype = null;
    $scope.classtopics = [];
    $scope.selected_time = null;
    $scope.classes = ["All", "SSS1", "SSS2", "SSS3"];
    $scope.times = ["2 hours", "1 hour 30 mins", "1 hour", "45 mins", "30 mins", "20 mins", "10 mins"];
    $scope.numbers = [100, 60, 40, 30, 20, 10];
    $scope.modes = ["Exam", "Practice"];
    $scope.exam_type = ["SSCE"];
    $scope.years = [2010,2011,2012,2013,2014,2015];
    
    if(authService.isLoggedIn()){
        if(service.setSubjectTopics()){
           service.send().then(function(response){
			   console.log(response.data);
             if(responseReview.check(response.data)==true){  
                if(response.data.data){
                   $scope.subjectTopics = response.data.data; 
                }
             }
                
            }, function(error){
                
            })
        }
    }
    else{
        authService.logOut();
    }
    
    $('.imgpanel').show();
    
    var old_exam = storageService.getStorageValue("exam");
    
    if(old_exam!=false){
        if(old_exam.exam=="custom"){
            $scope.old_exam_info = old_exam.subject +" - " +old_exam.class +" - " +old_exam.examtype +" - " +old_exam.mode +" Mode";
            $('#old-exam-btn').show();
        }
        if(old_exam.exam=="year"){
            $scope.old_exam_info = old_exam.subject +" - " +old_exam.year +" - " +old_exam.examtype +" - " +old_exam.mode +" Mode";
            $('#old-exam-btn').show();
        }
        if(old_exam.exam!="custom"&&old_exam.exam!="year"){
            $('#old-exam-btn').hide();
        }
    }
    else{
        $('#old-exam-btn').hide();
    }
    
    
    $scope.loadOldExam = function(){
        if(old_exam!=false){
            $state.go('exam', {exam: old_exam});
        }
    }
    
    
    $scope.showCustomDiv = function(){
       if($scope.examoption!="custom"){
            resetVariables();
            $('#custom').attr('class', "exam-option-btn active");
            $('#years').attr('class', "exam-option-btn");
            $('.exam-options').show();
            $('.year-options').hide(); 

            $scope.examoption = "custom";
       }
    }
    
    $scope.showYearDiv = function(){
       if($scope.examoption!="year"){
            resetVariables();
            $('#years').attr('class', "exam-option-btn active");
            $('#custom').attr('class', "exam-option-btn");
            $('.exam-options').hide();
            $('.year-options').show();

            $scope.examoption = "year";
       }
    }
    
    var resetVariables = function(){
        $scope.exam_parameters;
        $scope.questions = [];
        $scope.topics= [];
        $scope.subjects = null;
        $scope.selected_topics = [];
        $scope.selected_subject = null;
        $scope.selected_class = null;
        $scope.selected_number_of_questions = null;
        $scope.selected_mode = null;
        $scope.selected_time = null;
        $scope.selected_examtype = null;
        $scope.classtopics = [];
        $scope.selected_year = null;
    }
    
    $scope.setClass = function(num){
        $scope.selected_class = $scope.classes[num];
        
        $scope.selected_topics = [];
        $scope.classtopics = [];
        
        for(var i=0;i<$scope.topics.length;i++){
           
            if($scope.topics[i].class==$scope.selected_class){
                $scope.classtopics.push($scope.topics[i]);
            }
            if($scope.selected_class=="All"){
                $scope.classtopics = $scope.topics;
            }
        }
        
    }
    
    $scope.setYear = function(num){
        $scope.selected_year = $scope.years[num];
    }
    
    $scope.setTime = function(num){
        $scope.selected_time = $scope.times[num];
    }
    
    $scope.setNumber = function(num){
        $scope.selected_number_of_questions = $scope.numbers[num];
    }
    
    $scope.setMode = function(num){
        $scope.selected_mode = $scope.modes[num];
    }
    
    $scope.setExamType = function(num){
        $scope.selected_examtype = $scope.exam_type[num];
    }
    
    $scope.addToTopics = function(num){
        if(array_contains($scope.selected_topics, $scope.classtopics[num].topic)){
            var index = $scope.selected_topics.indexOf($scope.classtopics[num].topic);
        
            if(index>-1){
               $scope.selected_topics.splice(index, 1);
            }
            
        }
        else{
            $scope.selected_topics.push($scope.classtopics[num].topic);
        }
        
    }
    
    var ParseTime = function(t){
        var time = 0;
        
       switch(t){
           case "2 hours":
             time = 7200;  
              break; 
           case "1 hour 30 mins":
             time = 5400;   
              break;
           case "1 hour":
             time = 3600;     
              break; 
           case "45 mins":
             time = 2700;   
              break; 
           case "30 mins":
             time = 1800;     
              break; 
           case "20 mins": 
             time = 1200;   
              break; 
           case "10 mins":  
             time = 600;     
              break; 
       }
        
        return time;
    }
    
    var array_contains = function(arr, value){
        if(arr.length==0){
            return false;
        }
        else{
            for(var i=0;i<arr.length;i++){
                if(arr[i]==value){
                    return true;
                    break;
                }
            }
        }
        
        return false;
    }
    
    var getData = function(){
        var subject = $scope.selected_subject;
        var number = $scope.selected_number_of_questions;
        var clas = $scope.selected_class;
        var topics = $scope.selected_topics;
        var exam_type = $scope.selected_examtype;
        var time = ParseTime($scope.selected_time);
        
        if(service.makeCustom(subject, clas, number, exam_type, topics)==true){
            service.send().then(function(response){
               if(responseReview.check(response.data)){ 
                    if(response.data.data!=false&&response.data.data!=undefined){
                        data = {
                            subject: subject,
                            class: clas,
                            examtype: exam_type,
                            mode: $scope.selected_mode,
                            time: time,
                            questions: response.data.data,
                            exam: "custom"
                        }


                        $state.go('exam', {exam: data});
                    }
                   else{
                            $scope.err_message = "the requested exam could not be started...try selecting more topics to work with and make sure you have an internet connection on your device.";

                            $('#errorModal').modal('show');
                        }
               }
                
            }, function(error){
                 console.log(error.data);
            });
        }
    }
    
    
    var getYearData = function(){
        var subject = $scope.selected_subject;
        var exam_type = $scope.selected_examtype;
        var year = $scope.selected_year;
        
        if(service.makeYear(subject, exam_type, year)==true){
            service.send().then(function(response){
                
            if(responseReview.check(response.data)){ 
                if(response.data.data!=false&&response.data.data!=undefined){
                    data = {
                        subject: subject,
                        time: $scope.selected_time,
                        year: year,
                        examtype: exam_type,
                        mode: $scope.selected_mode,
                        questions: response.data.data,
                        exam: "year"
                    }


                    $state.go('exam', {exam: data});
                }
                else{
                        $scope.err_message = "the requested exam could not be started...please make sure you have an internet connection on your device.";

                        $('#errorModal').modal('show');
                    }
            }
                
            }, function(error){
                 console.log(error.data);
            });
        }
    }
    
    $scope.setSubject = function(num){
      $scope.selected_topics = [];
      $scope.selected_subject = $scope.subjectTopics[num].name;    
      $scope.topics = $scope.subjectTopics[num].topics;
      if($scope.examoption=="year"){    
        $scope.selected_time =  $scope.subjectTopics[num].time; 
      }
      $scope.selected_class = null;
    }
    
    $scope.checkStart = function(){
        
      if($scope.examoption=="custom"){  
            var selected_time = ParseTime($scope.selected_time);

            if($scope.selected_subject!=null&&$scope.selected_topics!=[]&&$scope.selected_subject!=[]&&$scope.selected_class!=null&&$scope.selected_number_of_questions != 0&&$scope.selected_mode!=null&&$scope.selected_time != null&&$scope.selected_examtype!=null){
                getData();
            }
            else{

            }
      }
      if($scope.examoption=="year"){
            if($scope.selected_subject!=null&&$scope.selected_mode!=null&&$scope.selected_year!=null
                                                   &&$scope.selected_examtype!=null){
                getYearData();
            }                                                      
            else{

            }
      }
       
    }
    
}]);