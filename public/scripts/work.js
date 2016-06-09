$(document).ready(function(){
    
    $(window).scroll(function () {
       var h = $(window).height(); 
      
       if ($(this).scrollTop() > 100&&h>700) {
            $('.imgpanel').addClass('stick');
       } 
       if($(this).scrollTop() <= 100){
            $('.imgpanel').removeClass('stick');
       }    
       });     
    
    $('#signup').click(function(){
        $('.signinform').addClass("hidden");
        $('.signupform').removeClass("hidden");
    });
    
    $('#signin').click(function(){
        $('.signupform').addClass("hidden");
        $('.signinform').removeClass("hidden");
    });
    
     $('.custom').click(function(){
            $('.custom').attr('class', "exam-option-btn active");
            $('.years').attr('class', "exam-option-btn");
            $('.exam-options').show();
            $('.year-options').hide();
        });

        $('.years').click(function(){
            $('.years').attr('class', "exam-option-btn active");
            $('.custom').attr('class', "exam-option-btn");
            $('.exam-options').hide();
            $('.year-options').show();
        });
  
    
    hideOnline();
    
    
    $('#hide-show-btn').click(function(){
        
        if($('#online-holder-div').hasClass('shown')){
            hideOnline();
        }
        else{
            showOnline()
        }
       
    });
    
    
    function showOnline(){
         var awidth = $(window).width()-270;
            var aheight = $(window).height()*0.40;
              $('#online-users').show();
            
            $('#online-holder-div').animate({
              left : awidth,
              height: aheight
             }, 200); 
            
            $('#ahr').show();
            
            $('.online-user').show();
            
            $('#hide-img').attr('src', 'img/rightarrow.png');
            
            $('#online-holder-div').addClass('shown');
    }
    
    function hideOnline(){
        var awidth = $(window).width()-55;
            
            
            $('#online-holder-div').animate({
              left : awidth,
              height: 60
             }, 200); 
            
            $('#ahr').hide();
            
            $('#hide-img').attr('src', 'img/leftarrow.png');
            
            $('#online-users').hide();
            
            $('.online-user').hide();
            
            $('#online-holder-div').removeClass('shown');
    }
    
})