myApp.directive('examExplanation', ['$compile', '$sce', function($compile, $sce){
    return {
        restrict: "E",
        scope: {
            content: "="
        },
        link: function(scope, element, attrs){
            
            scope.getHtml = function(html){
                return $sce.trustAsHtml(html);
            };
            
            scope.$watch("content", function(){
               if(scope.content!=undefined){
                    scope.explanation_image = scope.content.explanation_image;
                    var default_small = "img/default_small.png";

                    scope.image_explanation = default_small;

                    if(scope.content.text_explanation==null&&scope.content.image_explanation!=null){
                        scope.image_explanation = scope.content.image_explanation;
                        scope.text_explanation = "";

                        $('.textexplanation').hide();
                        $('.imageexplanation').show();
                    }
                    if(scope.content.text_explanation!=null&&scope.content.image_explanation==null){
                        scope.text_explanation = scope.content.text_explanation;
                        scope.image_explanation = default_small;

                        $('.textexplanation').show();
                        $('.imageexplanation').hide();
                    }

               }
                
            });
            
             var t =  '<div explanation-div><div class="container-fluid"><div class="explanation-top-div"></div><div class="explanation-content-div"><div class="col-md-7 col-xs-12"><h5 class="textexplanation" ng-bind-html="getHtml(text_explanation)"></h5><img class="imageexplanation" ng-src="{{image_explanation}}">   </div><div class="col-md-5 col-xs-12"><img class="explanationimage" ng-src="{{explanation_image}}">   </div>     </div>  </div>  </div>'        

             element.html(t);  
             $compile(element.contents())(scope);
            
        }
    }
}]);