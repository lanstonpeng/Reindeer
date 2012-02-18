/*var View=function(){
	
}
View.prototype.bindTemplate=function(options){
	var bindTarget=options.target;
	
	bindTarget && bindTarget.html(options.content);
	}
};

var courseTable=function(){

}
courseTable.prototype=new View();
*/


var UI={
	bindTemplate:function(options){

		var bindTarget=options.target,
			content=Mustache.render(options.template, options.data);
		bindTarget && bindTarget.html(content);
	},
	showModal:function(options){
		var modal=$("#modalMsg"),
			header=options.header || "Just a piece of tips",
			body=options.body || "The coder forgot to add the message,sorry";
		
		modal.find("h3").text(header);
		modal.find("p").text(body);
		modal.modal();
		
	}
};
UI.CourseReview=(function(){
	function bindReview(options){


		function _refreshArrowLayout(target){
			
			return function(){
				var current=target.next().text();
				target.next().text(parseInt(current)+1);
			}
		}
		//such an ugly damn piece of code here!!!
		DataContorller.CourseController.getCourseReviewByCourseId({
			courseId:options.courseId,
			target:options.target
		});

		//@@vote System
		var parentNode=options.target;

		
		parentNode.on('click','.icon-arrow-up',function(e){

			
			var reviewid=$(this).closest('.span3').attr("data-reviewid"),
				courseid=$(this).closest('.details').prev(".details").find(".span10").attr("data-courseid"),
				isallowUPNum=Functionality.isAllow({
					item:"courseReviewUPtest5",
					itemId:reviewid
				});
			isallowUPNum && DataContorller.CourseController.updateNum({
				reviewId:reviewid,
				courseId:courseid,
				command:'upNum'
			},_refreshArrowLayout($(this)));	
								
			!isallowUPNum && UI.showModal({
				header:"I know there's someone like you",
				body:"You know,over voting is bad"
			});

		});

		parentNode.on('click','.icon-arrow-down',function(e){
			var reviewid=$(this).closest('.span3').attr("data-reviewid"),
				courseid=$(this).closest('.details').prev(".details").find(".span10").attr("data-courseid"),
				isallowDownNum=Functionality.isAllow({
					item:"courseReviewDowntest5",
					itemId:reviewid
				});
			isallowDownNum && DataContorller.CourseController.updateNum({
				reviewId:reviewid,
				courseId:courseid,				
				command:'downNum'
			},_refreshArrowLayout($(this)));		
			
			!isallowDownNum && UI.showModal({
				header:"I know there's someone like you",
				body:"You know,over voting is bad,"
			});	
		});
	
	};

	return {
		bindEvent:bindReview
	}
})();

UI.CourseDetail=(function(){
	var couresDetailtemplatePath=Functionality.dataUtil.config.templatePath.courseDetail,
		template=Functionality.loadTemplateSync({path:couresDetailtemplatePath});
		 
	
	function bindCourseDetails(options){
		//there is ! caching the course data
		var courseCache=Functionality.modelCache.course[options.days], 
			data=Functionality.lookupJSON(courseCache).where('id',options.courseId);
		
		//console.log(options)
		UI.bindTemplate({
			target:options.target,
			data:data,
			template:template
		});

		_bindCourseDeatilsEvent(options);
		UI.Progress.bindEditable({
			days:options.days,
			courseId:options.courseId
		});
		$('.progressComments').tooltip(); 
	}

	function _bindCourseDeatilsEvent(options){
		var editableItems=options.target.find($(".itemEditable")),
		//This is where damn things happen
			courseNameEle=options.target.find(".itemEditable")[0],
			teacherEle=options.target.find(".itemEditable")[1],
			placeEle=options.target.find(".itemEditable")[2],
			reasonEle=options.target.find(".itemEditable")[3];



		function _enableEditItem(){
			editableItems.attr("contenteditable",true).addClass("itemEditing");

		}
		function _disableEditItem(){
			editableItems.attr("contenteditable",false).removeClass("itemEditing");
		}

		function _saveSession(){
			
		}

		function _recoverSession(){
			
		}

		options.target.find($("a.edit")).on("click",function(){
			$(this).html('<i class="icon-edit"></i>Save' );
			$(this).on("click",function(e){
				 
				 //##warning,no all item can be updated ,depends on the current situation
				 DataContorller.CourseController.updateCourse({
				 	courseName:$(courseNameEle).text(),
				 	place:$(placeEle).text(),
				 	teacher:$(teacherEle).text(),
				 	reason:$(reasonEle).text(),
				 	courseId:options.courseId
				 },function(){
				 	UI.showModal({
				 		header:"System's sucking Tips",
				 		body:"You've updated it,damn it,at this moment,you have to refresh to see the change "
				 	})
				 });

			});

			_enableEditItem();
			return false;
		});
		options.target.find($("a.cancle")).on("click",function(){
			$(this).prev().html('<i class="icon-edit"></i>Edit');
			_disableEditItem();
			return false;
		});

		//remember to update the course while the item is blur or something else
	}

	return {
		bindEvent:bindCourseDetails
	}
})();

UI.CourseTable=(function(){
	var couresDetailtemplatePath=Functionality.dataUtil.config.templatePath.courseDetail;

	function _bindTableEvent(options){
		 
		var courseTable=$("."+options.days+"Content"+" table.courseTable");
		


		function _refreshArrowLayout(target){
			
			return function(){
				var current=target.next().text();
				target.next().text(parseInt(current)+1);
			}
		}

		//@@vote System
		courseTable.find("tbody").on("click","tr .icon-arrow-up",function(e){
			var courseid=$(this).closest("tr").attr("data-courseid"),
				isallowUPNum=Functionality.isAllow({
					item:"courseUPtest4",
					itemId:courseid
				});
			isallowUPNum && DataContorller.CourseController.updateNum({
				courseId:courseid,
				command:'upNum'
			},_refreshArrowLayout($(this)) );
			//show hints
			!isallowUPNum && UI.showModal({
				header:"I know there's someone like you",
				body:"You know,over voting is bad,"
			});
			//##warning ,UX improvment here
			//not show up while clicking the vote button
			
		});

		courseTable.find("tbody").on("click"," tr .icon-arrow-down",function(e){
			var courseid=$(this).closest("tr").attr("data-courseid"),
				isallowDownNum=Functionality.isAllow({
					item:"courseDowntest4",
					itemId:courseid
				});

			isallowDownNum && DataContorller.CourseController.updateNum({
				courseId:courseid,
				command:'downNum'
			},_refreshArrowLayout($(this)) );
			//show hints
			!isallowDownNum && UI.showModal({
				header:"I know there's someone like you",
				body:"You know,over voting is bad,repeat,over voting is bad"			

			});
			//e.stopPropagation();
		});
 	
 		
 		//@@tr click event
		courseTable.find("tbody tr").click(function(e){
	    	var courseId=this.dataset.courseid,
	    		details=$(this).closest('.row').find(".details");
	    		 
	  		//close the remark overlay in case the user forget it
	  		var remarkOverlay=$(".remarkOverlay")

	  		if(remarkOverlay.css("display")!="none"){
	  			remarkOverlay.hide("slide", { direction: "up",easing:"easeOutQuint" }, 400); 
	        }
      	  
		    //The animation part of the whole course details parts
		    if (details){
		        if(details.hasClass("detailsHidden1")){
		            //there's a bit ugly here,though it happens once
	           		//bind course details
			  		/*UI.CourseDetail.bindEvent({
			  			courseId:courseId,
			  			days:options.days,
			  			target:$(details[0])
			  		});
			  		//bind the coures reviews
			  		UI.CourseReview.bindEvent({
			  			courseId:courseId,
			  			target:details.find($(".reviews .row"))

			  		});*/

		            $(details[0]).removeClass("detailsHidden1");
		            $(details[1]).removeClass("detailsHidden2");
		        }
		        else{
		         
		          $(details[0]).removeClass("detailsHidden1");
		          $(details[1]).removeClass("detailsHidden2");
		          $(details[0]).addClass("detailsHidden1");
		          $(details[1]).addClass("detailsHidden2");

		          setTimeout(function(){
					    //bind course details
				  		UI.CourseDetail.bindEvent({
				  			courseId:courseId,
				  			days:options.days,
				  			target:$(details[0])
				  		});

				  		//bind the coures reviews
				  		UI.CourseReview.bindEvent({
				  			courseId:courseId,
				  			target:details.find($(".reviews .row"))
				  		});

		            $(details[0]).removeClass("detailsHidden1");
		          	$(details[1]).removeClass("detailsHidden2");
		          },500); 
		        }
		    }	        	
	    });
	};

	var bindCourse=function(options){
		var target=$("."+options.days+"Content .courseTable tbody");
		UI.bindTemplate({
			data:options.data,
			template:options.tableTemplate,
			target:target
		});
		_bindTableEvent({
			days:options.days
		});
	};


	return {
		//bindTableEvent:bindTableEvent,
		bindEvent:bindCourse
		//bindCourseDetails:bindCourseDetails
	}

})();

UI.CourseAll=(function(){
	var bindAllCourse=function(options){
		var target=$(".wholeCourseOverlay .rightContent");
		UI.bindTemplate({
			data:options.data,
			template:options.template,
			target:target
		});
		Functionality.modelCache.course[options.days+"NeedUpdated"]=true
			
	}
	return {
		bindEvent:bindAllCourse
	}
})();

UI.ReviewAll=(function(){
	
	var bindAllReview=function(options){
	
		var target=$(".reviewOverlay .ReviewArea");
		UI.bindTemplate({
			data:options.data,
			template:options.template,
			target:target
		});
	};
	return{
		bindEvent:bindAllReview
	}
})()

UI.Remark=(function(){

	function _refreshArrowLayout(target){
		
		return function(){
			var current=target.next().text();
			target.next().text(parseInt(current)+1);
		}
	}
	var bindRemark=function(options){


		var target=$(".remarkOverlay .remarkContent");
		UI.bindTemplate({
			data:options.data,
			template:options.template,
			target:target
		});


		//@voteSystem
		target.on('click','.icon-arrow-up',function(e){
			var courseid=$(this).closest('.remarkItem').attr("data-courseid"),
				remarkid=$(this).closest('.remarkItem').attr("data-remarkid"),
				isallowUPNum=Functionality.isAllow({
					item:"courseRemarkUPtest6",
					itemId:remarkid
				});
				isallowUPNum && DataContorller.CourseController.updateNum({
					remarkId:remarkid,
					courseId:courseid,
					command:'upNum'
				},_refreshArrowLayout($(this)));	
									
				!isallowUPNum && UI.showModal({
					header:"I know there's someone like you",
					body:"You know,over voting is bad"
				});				
		});

		target.on('click','.icon-arrow-down',function(e){
			var courseid=$(this).closest('.remarkItem').attr("data-courseid"),
				remarkid=$(this).closest('.remarkItem').attr("data-remarkid"),
				isallowDownNum=Functionality.isAllow({
					item:"courseRemarkDowntest6",
					itemId:remarkid
				});
				isallowDownNum && DataContorller.CourseController.updateNum({
					remarkId:remarkid,
					courseId:courseid,
					command:'downNum'
				},_refreshArrowLayout($(this)));	
									
				!isallowDownNum && UI.showModal({
					header:"I know there's someone like you",
					body:"You know,over voting is bad"
				});				
		});	
		
		//@bind add Remark Event
		UI.AddRemarkDropDown.bindAddRemarkEvent({
			courseId:options.courseId
		});
	};



	return {
		bindEvent:bindRemark
	}

})();

UI.AddCoursePage=(function(){


	var bindAddCoursePageEvent=function(options){
 		var container=$(".addCourseArea"),
			courseName=container.find(".addCourseName"),
			reason=container.find(".addCourseReason"),
			place=container.find(".addCoursePlace"),
			teacher=container.find(".addCourseTeacher"),
			endTime=container.find(".addCourseEndTime"),
			startTime=container.find(".addCourseStartTime"),
			schoolId=16; //GDUT only first

		var saveBtn=container.find(".addCourseSave"),
			clearBtn=container.find(".clearlAddCourse"),
			backTo=$(".courseOverlay .backTo");
		//school should be like.... need to be refactor
		//schoolId=container.find(".addCourseSchool")...
		function _hideOverlay(){
			$(".courseOverlay").hide("slide", { direction: "right" }, 400); 
		}
		
		function _clearItem(){
				[courseName,reason,place,teacher,endTime,startTime].forEach(function(elem,index,arr){
					elem.val("")	
				});			
		}

		function _isEnough(){
			return $("."+options.days+"Content").find("tbody tr").length >= 5;                                                                                            
		}

		backTo.off("click");
		backTo.on("click",function(e){
	        _clearItem();
	        _hideOverlay();
	        return false;
	    });

		clearBtn.off("click");
		clearBtn.on("click",function(e){
			_clearItem();
		})

		//##warning:valitation should happen here
		saveBtn.off("click");
		saveBtn.on("click",function(e){
			var day=options.day;
			DataContorller.CourseController.addCourse({
				courseName:courseName.val(),
				reason:reason.val(),
				place:place.val(),
				teacher:teacher.val(),
				endTime:endTime.val(),
				startTime:startTime.val(),
				schoolId:schoolId,
				day:day
				},function(){
					Functionality.modelCache.course[options.days+"NeedUpdated"]=true;
					//try to rebind the courseTable
					!_isEnough() && DataContorller.CourseController.getCoursesTableByDay({day:day});								
					_hideOverlay();
				}
			);		
		});
	}
	
	return {
		
		bindEvent:bindAddCoursePageEvent
	}

})();

UI.Progress=(function(){
	var template='<input class="input-medium" id="progressComment" type="text"/><a class="btn btn-success btn-small" style="margin-right:22px" href="#"><i class="icon-ok"></i> Ok</a><a class="btn btn-warning btn-small" style="margin-left:22px" href="#"><i class="icon-remove"></i>No</a>'


	var hidePopup=function(e){
		
		},
	    bindEditable=function(options){
	    		
			var parent=$("."+options.days+"Content").find(".part2"),
				tempholder="",
				status=true,
				current="",
				width=parseInt(parent.find(".progress").css("width")),
				originalWidth=parseInt(parent.find(".progress .bar")[0].style.width),
				newWidth=0;
			
		 
			parent.on("mousemove",".progress",function(e){
				newWidth=e.offsetX/width*100;
				//console.log("newWidth",newWidth,"originalWidth",originalWidth)
				$(this).children(".bar").css("width",newWidth+"%");
			});	

			parent.on("mouseout",".progress",function(e){
				//$("#tempholder").tooltip('hide')
				console.log("original:",originalWidth)
				$(this).children(".bar").css("width",(originalWidth) +"%");
			});

			parent.on("click",".progress",function(e){
				var bar=$(this).children(".bar"),
					tempwidth=originalWidth;
					
					bar.css("width",newWidth+"%");		
					
				$(this).append('<div id="tempholder"></div>');
				var tempholder=$("#tempholder");

				tempholder.css("left",newWidth+"%").tooltip({title:template}).tooltip('show');

				$("body").on("click",".tooltip-inner .btn-success",function(e){
					originalWidth=newWidth;
					$(".progress").trigger("mouseout");
					//save progress data
					
					DataContorller.CourseController.addProgressComment({
						courseId:options.courseId,
						timePoint:newWidth,
						comment:$("#progressComment").val()
					},function(){
						DataContorller.CourseController.updateProgress({
							courseId:options.courseId,
							width:newWidth,
						});
						tempholder.tooltip("hide");
						//update the the progress bar
						bar.css("width",newWidth+"%");
						return false;						
					});
					return false;
				});

				$("body").on("click",".tooltip-inner .btn-warning",function(e){
					originalWidth=tempwidth;
					$(".progress").trigger("mouseout");
					tempholder.tooltip("hide");
					return false;
				});
				console.log("tempwidth: ",tempwidth);
				originalWidth=newWidth;				
				/*
				if(tempholder[0]){
					tempholder.css("left",newWidth+"%").tooltip({title:template}).tooltip('show')
				}
				else{

					$(this).append('<div id="tempholder"></div>');
					tempholder.css("left",newWidth+"%").tooltip({title:template}).tooltip('show')

					$("body").on("click",".tooltip-inner .btn-success",function(e){
						originalWidth=newWidth;
						tempholder.tooltip("hide");
					});

					$("body").on("click",".tooltip-inner .btn-warning",function(e){
						originalWidth=tempwidth;
						tempholder.tooltip("hide");
					});

					current = newWidth;
					
				}*/
				/*
				tempholder=$("#tempholder");
				$(this).children(".bar").css("width",newWidth+"%");
				var tempwidth=originalWidth;
				 
				if( tempholder[0] ){
					console.log("already",$("#tempholder"))
					tempholder.css("left",newWidth+"%").tooltip('show')
				}
				else{
					$(this).append('<div id="tempholder"></div>');
					tempholder=$("#tempholder");
					
					tempholder.css("left",newWidth+"%").tooltip({title:template}).tooltip('show');

					$("body").on("click",".tooltip-inner .btn-success",function(e){
						originalWidth=newWidth;
						tempholder.tooltip("hide");

						return false;
					});

					$("body").on("click",".tooltip-inner .btn-warning",function(e){
						originalWidth=tempwidth;
						tempholder.tooltip("hide");
						
						return false;
					});					
				}
				
				originalWidth=newWidth;*/
				
			});
		},
		save=function(options){
			
		}
		return {
			bindEditable:bindEditable		
			}
})();

UI.AddRemarkDropDown=(function(){

	var addRemark=function(options){
		var container=$(".remarkOverlay"),
			save=container.find(".addRemarkBtn"),
			cancle=container.find(".removeRemarkBtn"),
			userNameEle=container.find("[placeholder='userName']"),
			contentEle=container.find("[placeholder='Content']");


		save.on('click',function(){
			DataContorller.CourseController.addRemark({
				userName:userNameEle.val(),
				content:contentEle.val(),
				courseId:options.courseId
			},function(){
				//rebind the remark
				DataContorller.CourseController.getRemarkByCourseId({
					courseId:options.courseId
				})
			});
		});

		cancle.on('click',function(){
			userNameEle.val("");
			contentEle.val("")
		});
	}

	return {
		bindAddRemarkEvent:addRemark
	}

})();

UI.AddReview=(function(){
	
	function _hideReivewOverlay(){
		console.log("--closing")
		var addArea=$(".addReviewArea"),
	        reviewArea=$(".ReviewArea");
        	reviewArea && reviewArea.slideUp(400,"easeOutQuint");
	        addArea && addArea.slideUp(400,"easeOutQuint",function(){
	        		$(".reviewOverlay").hide();
	        });
	}

	var bindAddReview=function(options){
    	var addReviewArea=$(".addReviewArea");

    	$(".reviewOverlay").show();
    	addReviewArea.slideDown(400,"easeOutExpo");

    	addReviewArea.find(".addReviewkBtn").on('click',function(){
    		var parent=$(this).closest('.row'),
    		    userName=parent.find('.addReviewUserName').val(),
    		    content=parent.find('.addReviewContent').val();
    		DataContorller.CourseController.addReview({
    			courseId:options.courseId,
    			userName:userName,
    			content:content
    		},function(){
    			//hide the add Review overlay
    			_hideReivewOverlay();
    		});
    	});
    	addReviewArea.find(".cancelReviewkBtn").on("click",function(){
    		_hideReivewOverlay();
    	});

    	return false;	
	}

	return {
		bindEvent:bindAddReview
	}
})();