myApp.service("service", ['$http','$q','authService', function($http, $q, authService){
    var data = [];
    var url = "";
	var is_show_loading = false;
   
	this.setDeleteUser = function(){
		is_show_loading = true;
		data = {
			method: "deleteUser"
		}
	}
	
	this.setDeleteComment = function(anid){
		is_show_loading = true;
		data = {
			id: anid,
			method: "deleteComment"
		}
	}
	
    this.setBatchRequest = function(req_ids){
		is_show_loading = true;
        data = {
            request_ids:req_ids,
            from_type: "S",
            method: "sendBatchRequests"
        }
    }
    
    this.setSearchSchools = function(skul,lim){
		is_show_loading = false;
        data = {
            school: skul,
            limit: lim,
            method: "getSearchSchools"
        }
    }
    
    this.setSchools = function(){
		is_show_loading = false;
        data = {
            method: "getSchools"
        }
    }
    
    this.setViewCount = function(pid){
		is_show_loading = false;
        data = {
            post_id: pid,
            method: "incrementViewCount"
        }
    }
    
    this.setShareCount = function(pid){
		is_show_loading = false;
        data = {
            post_id: pid,
            method: "incrementShareCount"
        }
    }
   
    this.setHelpful = function(pid, op){
		is_show_loading = false;
        data = {
            post_id: pid,
            operation: op,
            method: "setHelpful"
        }
    }
    
    this.setPost = function(post_id){1
		is_show_loading = true;
        data = {
            post_id: post_id,
            method: "getPost"
        }
    }
    
    this.setLatestComments = function(adate, id){
	   is_show_loading = true;
       if(adate&&id){
          data = {
            method: "getLatestCommentsOnPost",
            post_id: id,
            comment_date: adate 
          }   
          
          return true;
       }
       else{
           return false;
       }
    }
    
    this.setEditDiscussion = function(did, dis){
		is_show_loading = true;
        if(did&&dis){
            data = {
                discussion_id : did,
                discussion : dis,
                method: "editDiscussion"
            }
            
            return true;
        }
        else{
            return false;
        }
    }
    
    this.setEditComment = function(cid, comment){
		is_show_loading = true;
        if(cid&&comment){
            data = {
                comment_id : cid,
                comment : comment,
                method: "editComment"
            }
            
            return true;
        }
        else{
            return false;
        }
    }
    
    this.setmakeComment = function(pid, oid, oust, ut, comm){
		is_show_loading = true;
        if(pid&&oid&&oust&&ut&&comm){
           data = {
               post_id: pid,
               owner_id: oid,
               owner_type: oust,
               user_type: ut,
               comment: comm, 
               method: "postComment"
           }    
           return true;
        }
        else{
            return false;
        }
    }
    
    this.setQuestionPost = function(subject, qid){
		is_show_loading = true;
        if(subject!=undefined&subject!=null&&qid>0){
            data = {
               question_id : qid,
               subject_name : subject,
               method : "postQuestion"   
            }
            return true;
        }
        else{
            return false;
        }
    }    
    
    this.makeCustom = function(subj, clas, num, et, top){
		is_show_loading = true;
        if(subj&&clas&&num&&et&&top){
            data = {
                subject: subj,
                aclass: clas,
                number: num,
                exam_type: et,
                topics: top,
                exam_option: "custom",
                method: "getQuestions", 
            }
        }
          
        return true;
    }
    
    this.makeYear = function(subj, et, yr){
		is_show_loading = true;
        if(subj&&et&&yr){
            data = {
                subject: subj,
                exam_type: et,
                method: "getQuestions", 
                year: yr,
                exam_option: "year",
            }
        }
          
        return true;
    }
    
    this.setReplyRequest = function(rid, act){
		  is_show_loading = true;
          if(rid&&act){    
            data = {
                action: act, 
                request_id: rid,
                method: "userRequestResponse"
            }
            
            return true;
          }
          else{
             return false;
          }
    }
    
    this.setuploadImage = function(img){
		is_show_loading = true;
        if(img!=null&&img!=undefined){
            data = {
                image: img,
                method: "uploadImage"
            }
            return true;
        }
        else{
            return false;
        }
    }
    
    this.setSubjectTopics = function(){
		is_show_loading = true;
        data = {
             method: "getSubjects"
        }
        
        return true;
    }
    
    this.setUpdateProfile = function(d){
	   is_show_loading = true;
       if(d!=null&&d!=undefined){
           data = d;
           
           return true;
       }
       else{
           return false;
       }  
    }
    
    this.setFriends = function(os){
		is_show_loading = true;
        data = {
             user_type: "S",
             offset : os,
             method: "getFriends"
        }
        
        return true;
    }
    
    this.setRequests = function(){
	   is_show_loading = true;
       data = {
           method: "getFriendRequests"
       } 
        
       return true;
    }
    
    this.setUser = function(id, type){
		is_show_loading = true;
        if(id>1&&type){
             data = {
                 find_id : id,
                 find_type : type,
                 user_type: "S",
                 method : "getUser"
             }
             return true;
        }
        else{
            return false;
        }
    }
    
    this.setSendRequest = function(tid, tt){
          is_show_loading = true;
          if(tid&&tt){    
            data = {
                from_type: "S",
                to_id: tid,
                to_type: tt,
                method: "sendFriendRequest"
            }
            
            return true;
          }
          else{
             return false;
          }
    }
    
    this.setGetUsers = function(fname, lname, os){
        is_show_loading = true;
        if(fname||lname&&os){
         data = {
             firstname : fname,
             lastname  : lname,
             method : "getUsersByName",
             offset : os
         }
        
            return true;
        }
        else{
            return false;
        }
       
    }
    
    this.setLogOut = function(){
        data = {
             method : "LogUserOut"    
        }
    }
    
    this.setfriendsOnline = function(){
		is_show_loading = false;
        data = {
           method : "getOnlineUsers" 
        }
         
        return true;
    }
    
    this.setDiscussion = function(discussion){
		is_show_loading = true;
        if(discussion!=null&&discussion.trim().length>0){
            data = {
               discussion : discussion,
               method : "postDiscussion"    
            }     
            
            return true;
        }
        else{
             return false;
        }
    }
    
    this.setPosts = function(num){
		  is_show_loading = true;
          data = {
            method: "getAllPosts",
            post_count: num
          } 
          return true;
    }
    
    this.setEmail = function(mail,subject,name){
		is_show_loading = true;
        data = {
		   name: name,	
           method: "sendMail",
           msg: mail,
           subject: subject
        }
    }
    
    this.setNotofication = function(){
	   is_show_loading = false;	
       data = {
           method: "getFriendRequests"
       }    
    }
    
    
    this.send = function(){
       if(url==""){
          url = "endpoints/userData2.php";
       }
       
       data.at = authService.getAt();
       data.rt = authService.getRt();
      
       if(data.rt===false||data.at===false){
           authService.logOut();
       }    
        
	   if(is_show_loading==true){	
       	  $('.spinner-div').show();
	   }	
		
       var deferred = $q.defer();
		
       $http.post(url, data).then(
           function successCallback(response){
              deferred.resolve(response);
               $('.spinner-div').fadeOut();
           },
           function errorCallback(){
              deferred.reject(false);
               $('.spinner-div').fadeOut();
           }
       );
      
       return deferred.promise;
    }
 
}]);