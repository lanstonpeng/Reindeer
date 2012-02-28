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

		parentNode.off("click");//cancel the click event so that it won't tirgger many times
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
		console.log("-- to progress options",options);
		UI.Progress.bindEditable({
			days:options.days,
			courseId:options.courseId
		});

		//enable the progress comments
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

		//UX part in updating the course details
		function _updateCourseCache(data){
			var course=Functionality.modelCache.course[data.days];
			for(var i=0,len=course.length;i<len;i++){
			   if(course[i].id==data.courseId){
			   	
			   	var courseItem=course[i];	
			   		courseItem.courseName=data.courseName;
			   		courseItem.place=data.place;
			   		courseItem.teacher=data.teacher;
			   		courseItem.reason=data.reason;
			   }
			}
			//update the course table
			var target=$("."+data.days+"Content").find("tbody tr");
			for(var i=0,len=target.length;i<len;i++){
				if($(target[i]).attr("data-courseid")==data.courseId){
					$(target[i]).find("td")[0].innerText=data.courseName;
					$(target[i]).find("td")[2].innerText=data.teacher;
				}
			}
			console.log("--update course cache");
		}


		
		options.target.find($("a.edit")).on("click",function(){
			console.log("edit click")
			$(this).html('<i class="icon-edit save"></i>Save' );
			$(this).on("click",function(e){
				 console.log("save click")
				 //##warning,no all item can be updated ,depends on the current situation
				 DataContorller.CourseController.updateCourse({
				 	courseName:$(courseNameEle).text(),
				 	place:$(placeEle).text(),
				 	teacher:$(teacherEle).text(),
				 	reason:$(reasonEle).text(),
				 	courseId:options.courseId
				 },function(){
				 	_updateCourseCache({
					 	courseName:$(courseNameEle).text(),
					 	place:$(placeEle).text(),
					 	teacher:$(teacherEle).text(),
					 	reason:$(reasonEle).text(),
					 	courseId:options.courseId,
					 	days:options.days
					 });
					_disableEditItem();
				 	UI.showModal({
				 		header:"System's sucking Tips",
				 		body:"You've updated it,damn it,at this moment,you have to refresh to see the change "
				 	});
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
	var couresDetailtemplatePath=Functionality.dataUtil.config.templatePath.courseDetail,
		config=Functionality.dataUtil.config.constants;

	function _bindTableEvent(options){
		 
		var courseTable=$("."+options.days+"Content"+" table.courseTable");
		


		function _refreshArrowLayout(target){
			
			return function(){
				var current=target.next().text();
				target.next().text(parseInt(current)+1);
			}
		}

		//@@vote System
		courseTable.find("tbody tr .icon-arrow-up").on("click",function(e){
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
			e.stopPropagation();
		});

		courseTable.find("tbody tr .icon-arrow-down").on("click",function(e){
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
			e.stopPropagation(); //you cant make it while you put an eye on the event listener(at first)
		});
 	
 		
 		//@@tr click event
		courseTable.find("tbody tr").click(function(e){
	    	var courseId=this.dataset.courseid,
	    		details=$(this).closest('.row').find(".details");
	    		 
	  		//close the remark overlay in case the user forget it
	  		var remarkOverlay=$(".remarkOverlay");
	  		if(remarkOverlay.css("display")!="none"){
	  			remarkOverlay.hide("slide", { direction: "up",easing:"easeOutQuint" }, config.remarkOverlayDown); 
	        }
      	  
		    //The animation part of the whole course details parts
		    if (details){
		        if(details.hasClass("detailsHidden1")){
		            //there's a bit ugly here,though it happens once
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

	var config=Functionality.dataUtil.config.constants;
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
			$(".courseOverlay").hide("slide", { direction: "right" },config.addCourseSlideTime ); 
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
	//var template='<input class="input-medium" id="progressComment" type="text"/><a class="btn btn-success btn-small" style="margin-right:22px" href="#"><i class="icon-ok"></i> Ok</a><a class="btn btn-warning btn-small" style="margin-left:22px" href="#"><i class="icon-remove"></i>No</a>'
	var template=Functionality.loadTemplateSync({
	    		path:Functionality.dataUtil.config.templatePath.courseProgressPopup
	    }),
	    arrowTemplate=Functionality.loadTemplateSync({
	    		path:Functionality.dataUtil.config.templatePath.coursePrgressArrow
	    });
	
	function _updateProgressArrowUI(options){
		var arrow=$(Mustache.render(arrowTemplate,options)).css("display","none");
		options.target.append(arrow);
		arrow.fadeIn();

		//add arrow 
	}

	//This's where UX happens
	function _updateProgressCache(data){
		var course=Functionality.modelCache.course[data.days];
		for(var i=0,len=course.length;i<len;i++){
			if(course[i].id==data.courseId){
				//update it
				var progress=course[i].progress;
				progress.width=data.timePoint;
				progress.progress_comments.push({
					comment:data.comment,
					timePoint:data.timePoint
				})
			}
		}

	}
	function _triggerDragStart(e){
		console.log("drag start ",e)
		var removeArea=$(".removeArea");
		e.dataTransfer.effectAllowed='move';
        e.dataTransfer.setData("myid",this.dataset.pcommentId); 
		removeArea.fadeIn();

		removeArea.off("mouseover").off("mouseout");
		removeArea.on("mouseover",function(e){
			$(this).css("backgroundColor","rgba(255,0,0,0.4)");
		}).on("mouseout",function(e){
			$(this).css("backgroundColor","rgba(0,0,0,0.4)");
		});

	}
	function _triggerDragStop(e,ui){
		var removeArea=$(".removeArea");
		removeArea.css("backgroundColor","rgba(0,0,0,0.4)")
		removeArea.fadeOut();
	
	}
	function _setCommentRemoveable(){
		var removeArea=$(".removeArea");

		removeArea[0].addEventListener("dragover",function(e){
			e.preventDefault();
			return false;
		},false)
		removeArea.on("dragenter",function(e){
			//console.log("dragenter",e)
		});
		removeArea.on("dropend",function(e){
			//console.log("dropend",e)
		});
		removeArea[0].addEventListener("drop",function(e){
			console.log("drop",e.dataTransfer.getData("myid"));
			DataContorller.CourseController.deleteSomething({
				itemName:"ProgressComment",
				itemId:e.dataTransfer.getData("myid")
			})
			e.stopPropagation();
		},false);

	};

	var hidePopup=function(e){
		
		},
	    bindEditable=function(options){
	    		
			var parent=$("."+options.days+"Content").find(".part2");
			var	tempholder="",
				status=true,
				removeArea=$(".removeArea"),
				width=parseInt(parent.find(".progress").css("width")),
				progressComment= parent.find(".progressDetails i"),
				originalWidth=parseInt(parent.find(".progress .bar")[0].style.width),
				newWidth=0;
			
		    //bind draggable with jquery with the aim of remove the progress comments
		   	/* progressComment.draggable({ 
		   		//revert: true,
		   		//cursorAt: { bottom: 0 },
		   		//start:_triggerDragStart,
		   		//stop:_triggerDragStop

		   	});*/
			//progressComment removeable
			//progressComment.on("dragstart",_triggerDragStart);
			//progressComment.on("dragstop",_triggerDragStop);
			for(var i=0,len=progressComment.length;i<len;i++){
				progressComment[i].addEventListener("dragstart",_triggerDragStart,false)
				progressComment[i].addEventListener("dragend",_triggerDragStop,false)
			}
			_setCommentRemoveable();


			parent.on("mousemove",".progress",function(e){
				newWidth=e.offsetX/width*100;
				$(this).children(".bar").css("width",newWidth+"%");
			});	

			parent.on("mouseout",".progress",function(e){
				console.log("original:",originalWidth)
				$(this).children(".bar").css("width",(originalWidth) +"%");
			});
			//Pop up the modal
			parent.on("click",".progress",function(e){
				var bar=$(this).children(".bar"),
					tempwidth=originalWidth;
				//UX here
				bar.css("width",newWidth+"%");						
				$(this).append('<div id="tempholder"></div>');

				var tempholder=$("#tempholder");
				tempholder.css("left",newWidth+"%").tooltip({title:template}).tooltip('show');

				//save progress comment
				$("body").on("click",".tooltip-inner .btn-success",function(e){
					var comment=$("#progressComment").val();

					//set the bar width 
					originalWidth=newWidth;
					//a little bit ugly here,the improment of UX ?!
					$(".progress").trigger("mouseout");

					//save progress data
					DataContorller.CourseController.addProgressComment({
						courseId:options.courseId,
						timePoint:newWidth,
						comment:comment
					},function(){
						//update the progress bar width,a little bit ugly here
						//to-do:
						//mix this part in addProgressComment
						DataContorller.CourseController.updateProgress({
							courseId:options.courseId,
							width:newWidth,
						});
						tempholder.tooltip("hide");
						
						//update the bar UI
						bar.css("width",newWidth+"%");
						//update the arrow UI
						_updateProgressArrowUI({
							timePoint:newWidth,
							comment:comment,
							target:parent.find(".progressDetails")
						});

						//update the course progress cache
						_updateProgressCache({
							timePoint:newWidth,
							comment:comment,
							days:options.days,
							courseId:options.courseId
						});
						return false;						
					});
					return false;
				});
				//cancle adding progress comment
				$("body").on("click",".tooltip-inner .btn-warning",function(e){
					originalWidth=tempwidth;
					$(".progress").trigger("mouseout");
					tempholder.tooltip("hide");
					return false;
				});
				//console.log("tempwidth: ",tempwidth);
				originalWidth=newWidth;				
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
	var config=Functionality.dataUtil.config.constants;
	function _hideReivewOverlay(){
		var addArea=$(".addReviewArea"),
	        reviewArea=$(".ReviewArea");
        	reviewArea && reviewArea.slideUp(config.addReviewOverlay,"easeOutQuint");
	        addArea && addArea.slideUp(config.addReviewOverlay,"easeOutQuint",function(){
	        		$(".reviewOverlay").hide();
	        });
	}

    function _updateReviewUI(options){
    	//judge if there's less than 5 reivews
    	var target=options.target.closest(".details").find(".reviews .row");

    	if(target.children().length<5){//need to be updated
    		var template=Functionality.loadTemplateSync({
	    		path:Functionality.dataUtil.config.templatePath.courseReview
	    	}),
	    		token={
	    			"token":[options]
	    		},
	    		result=$(Mustache.render(template,token)).css("display","none");
	    		//insert it into the dom
	    		target.append(result);
	    		result.fadeIn();
    	}
    	else{
    		//nothing to do
    	}

    }
	var bindAddReview=function(options){
    	var addReviewArea=$(".addReviewArea"),
    		addReviewBtn=addReviewArea.find(".addReviewBtn");

    	$(".reviewOverlay").show();
    	addReviewArea.slideDown(config.addReviewOverlay,"easeOutExpo");
    	addReviewBtn.on('click',function(){
    		var parent=$(this).closest('.row'),
    		    userName=parent.find('.addReviewUserName').val(),
    		    content=parent.find('.addReviewContent').val();
    		DataContorller.CourseController.addReview({
    			courseId:options.courseId,
    			userName:userName,
    			content:content
    		},function(){
    			//maybe a little bit ugly here,it should share this variable on the top
    			_updateReviewUI({
    				target:options.target,
    				courseId:options.courseId,
    				userName:userName,
    				content:content
    			});
    			//hide the add Review overlay
    			_hideReivewOverlay();
    		});
    	});
    	Functionality.modelCache.courseReviews["review"+options.courseId+"NeedUpdated"]=true;
    	addReviewArea.find(".cancelReviewkBtn").on("click",function(){
    		_hideReivewOverlay();
    	});
    	//cache the course reviews
    	//Functionality.modelCache.course[options.days+"NeedUpdated"]
    	return false;	
	}

	return {
		bindEvent:bindAddReview
	}
})();