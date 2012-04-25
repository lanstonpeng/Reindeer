//Main thread	===================================================================================================
window.pangting=(function(){
		//config table
		var constants={
			defaultTime:400,//most slideDown and slideUp use this
			navTime:400,
			addCourseTime:600,
			remarkOverlayDown:600,
			database:{}

		};
				 
		function init(){
			//kind of a bit werid or ugly here
			DataContorller.CourseController.initCourseTableByDay({day:1});
			/*
            DataContorller.CourseController.initCourseTableByDay({day:2});
			DataContorller.CourseController.initCourseTableByDay({day:3});
			DataContorller.CourseController.initCourseTableByDay({day:4});
			DataContorller.CourseController.initCourseTableByDay({day:5});
			DataContorller.CourseController.initCourseTableByDay({day:6});
			DataContorller.CourseController.initCourseTableByDay({day:7});
            */

			//init the necessary elements,variables
			var sideBarBtn=$("ul.buttons"),
				logoBtn=$(".navigation .logo"),
				courseTable=$("table.courseTable"),
				addCourseBtn=$("a.addCourseBtn"),
				seeAllCourseBtn=$("a.seeAllCourses"),
				seeMoreReviewBtn=$("a.seeMoreReviewBtn"),
				addReviewBtn=$("a.addReviewBtn");

        
	        //navgation,a bit ugly here
	        function _navDelegate(e){
	            $.scrollTo($( "."+$(this).attr('class')+"Content" ),{
	                            duration: constants.navTime,
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
	        		remarkOverlay.clearQueue().show("slide", { direction: "up",easing:"easeOutQuint" }, constants.remarkOverlayDown); 
	        	}
	        	else{
	        		remarkOverlay.hide("slide", { direction: "up",easing:"easeOutQuint" }, constants.remarkOverlayDown); 
	        	}
	        });
	       //============================================================

	       //=========================see All course ====================
	        seeAllCourseBtn.click(function(e){
	          	var days=$(this).closest(".container").parent().attr("class").replace("Content","").trim();
	 			DataContorller.CourseController.getAllTopCoursesTable({days:days});
	          	$(".wholeCourseOverlay").show("slide", { direction: "left",easing:"easeOutQuint" }, constants.addCourseTime); 
	           	return false;
	        });

	        $(".wholeCourseOverlay .backTo").click(function(e){
	          $(".wholeCourseOverlay").hide("slide", { direction: "left"}, constants.addCourseTime); 
	           return false;
	        });
	        //===========================================================

	        //==========================Add Coures=======================
	        addCourseBtn.click(function(e){
	        	var days=$(this).closest(".container").parent().attr("class").replace("Content","").trim(),
	        		day=Functionality.getNum(days);

				$(".courseOverlay").show("slide", { direction: "right",easing:"easeOutQuint" }, constants.addCourseTime,function(){
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
	        		courseId:courseId
	        	});

	        	return false;
	        });
	        /*
	        $(".addReviewArea").click(function(e){
	        	var addArea=$(".addReviewArea"),
	        		reviewArea=$(".ReviewArea");
	        	reviewArea && reviewArea.slideUp(constants.defaultTime,"easeOutQuint");
	        	addArea && addArea.slideUp(constants.defaultTime,"easeOutQuint",function(){
	        		$(".reviewOverlay").hide();
	        	});
	        });*/

	        //see All Reviews Btn
	        seeMoreReviewBtn.click(function(e){
	        	var courseId=$(this).closest(".details").parent().find(".part1 .span10").attr("data-courseid")
	        	DataContorller.CourseController.getAllReviewByCourseId({
		        	courseId:courseId
		        });
	        	$(".reviewOverlay").show();
	        	$(".addReviewArea,.ReviewArea").slideDown(constants.defaultTime,"easeOutExpo");
	        	return false;
	    	});


		}
		

		return {
			init:init

		}
})();

