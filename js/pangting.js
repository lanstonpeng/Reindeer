//Main thread	===================================================================================================
window.pangting=(function(){
		//config table
		/*var constants={
			defaultTime:400,//most slideDown and slideUp use this
			navTime:400,
			addCourseTime:600,
			remarkOverlayDown:600
		};*/
				 
		function init(){
			//kind of a bit werid or ugly here
			DataContorller.CourseController.initCourseTableByDay({day:1});
			DataContorller.CourseController.initCourseTableByDay({day:2});
			DataContorller.CourseController.initCourseTableByDay({day:3});
			DataContorller.CourseController.initCourseTableByDay({day:4});
			DataContorller.CourseController.initCourseTableByDay({day:5});
			DataContorller.CourseController.initCourseTableByDay({day:6});
			DataContorller.CourseController.initCourseTableByDay({day:7});

			//init the necessary elements,variables
			var sideBarBtn=$("ul.buttons"),
				logoBtn=$(".navigation .logo"),
				courseTable=$("table.courseTable"),
				addCourseBtn=$("a.addCourseBtn"),
				seeAllCourseBtn=$("a.seeAllCourses"),
				seeMoreReviewBtn=$("a.seeMoreReviewBtn"),
				addReviewBtn=$("a.addReviewBtn");

        	var config=Functionality.dataUtil.config.constants;
	        //navgation,a bit ugly here
	        function _navDelegate(e){
	            $.scrollTo($( "."+$(this).attr('class')+"Content" ),{
	                            duration: config.navTime,
	                            easing:'jswing'          
	            });
	        };
	        sideBarBtn.children().click(_navDelegate);
	        logoBtn.on("click",_navDelegate); //logo needs navigtion,too


	        //=========================remarks switch====================
	        $(".container").on("click",".iphone_switch",function(e){
	        	var cache=$(this),
	        		remarkOverlay=$(".remarkOverlay"),
	        		courseId=$(this).parent(".part1").find(".span10").attr("data-courseid");
	        	
	        	DataContorller.CourseController.getRemarkByCourseId({courseId:courseId});
	        	cache.toggleClass("iphone_switch_off");
	        	if (remarkOverlay.css("display")=="none"){
	        		remarkOverlay.clearQueue().show("slide", { direction: "up",easing:"easeOutQuint" }, config.remarkOverlayDown); 
	        	}
	        	else{
	        		remarkOverlay.hide("slide", { direction: "up",easing:"easeOutQuint" }, config.remarkOverlayDown); 
	        	}
	        });
	       //============================================================

	       //=========================see All course ====================
	        seeAllCourseBtn.click(function(e){
	          	var days=$(this).closest(".container").parent().attr("class").replace("Content","").trim();
	 			DataContorller.CourseController.getAllTopCoursesTable({days:days});
	          	$(".wholeCourseOverlay").show("slide", { direction: "left",easing:"easeOutQuint" }, config.seeAllCourseSlideTime); 
	           	return false;
	        });

	        $(".wholeCourseOverlay .backTo").click(function(e){
	          $(".wholeCourseOverlay").hide("slide", { direction: "left"}, config.seeAllCourseSlideTime); 
	           return false;
	        });
	        //===========================================================

	        //==========================Add Coures=======================
	        addCourseBtn.click(function(e){
	        	var days=$(this).closest(".container").parent().attr("class").replace("Content","").trim(),
	        		day=Functionality.getNum(days);

				$(".courseOverlay").show("slide", { direction: "right",easing:"easeOutQuint" }, config.addCourseSlideTime,function(){
					UI.AddCoursePage.bindEvent({
						day:day,
						days:days
					});
				}); 
				return false;
	        });

	        //===========================================================


	        //add Review btn
	        addReviewBtn.on("click",function(e){
	        	var courseId=$(this).closest(".details").parent().find(".part1 .span10").attr("data-courseid");

	        	 
	        	UI.AddReview.bindEvent({
	        		courseId:courseId,
	        		target:$(this)
	        	});

	        	return false;
	        });
	        //see All Reviews Btn
	        seeMoreReviewBtn.click(function(e){
	        	var courseId=$(this).closest(".details").parent().find(".part1 .span10").attr("data-courseid")
	        	DataContorller.CourseController.getAllReviewByCourseId({
		        	courseId:courseId
		        });
	        	$(".reviewOverlay").show();
	        	$(".addReviewArea,.ReviewArea").slideDown(config.defaultAnimationTime,"easeOutExpo");
	        	return false;
	    	});

	    	//listen to the UP and DOWN  keyboard
	    	$(document).on("keypress",function(e){
	    		
	    	});


		}
		

		return {
			init:init

		}
})();

