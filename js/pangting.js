//$(function(){
	
	pangting=function(){
		//config table
		var constants={
			defaultTime:400,
			navTime:400,
			addCourseTime:600

		}
        //data-binding module
		var dataModule=function(){
			this.getProgress=function(courseId){
				$("#tooltip").tooltip({title:"First Class"});
			}
			//@@ToDo:  get data from server

		}

		//UI functions
		var details=function(){
			
		}

		
		 
		function init(){
			/*
				@@Todo:
					initial data-biding
			*/
			//init modules
			var data=new dataModule();
			data.getProgress();
			 
			//init the necessary elements,variables
			var sideBarBtn=$("div.buttons"),
				courseTable=$("table.courseTable"),
				addCourseBtn=$("a.addCourseBtn"),
				seeAllCourseBtn=$("a.seeAllCourses"),
				seeMoreReviewBtn=$("a.seeMoreReviewBtn"),
				addReviewBtn=$("a.addReviewBtn");

		
			//init the basic functionality
        
	        //navgation
	        sideBarBtn.children().click(function(e){
	           
	            $( "."+$(this).attr('class')+"Content" ).ScrollTo({
	                            duration: constants.navTime
	                           
	              });
	        });

	        seeAllCourseBtn.click(function(e){
	          $(".wholeCourseOverlay").show("slide", { direction: "left",easing:"easeOutQuint" }, constants.addCourseTime); 
	           return false;
	        });
	        $(".wholeCourseOverlay .backTo").click(function(e){
	          $(".wholeCourseOverlay").hide("slide", { direction: "left"}, constants.addCourseTime); 
	           return false;
	        });

	        //Add Coures Button
	        addCourseBtn.click(function(e){
	          $(".courseOverlay").show("slide", { direction: "right",easing:"easeOutQuint" }, constants.addCourseTime); 
	          return false;
	        });

	        $(".courseOverlay .backTo").click(function(e){
	          $(".courseOverlay").hide("slide", { direction: "right" }, 400); 
	           return false;
	        });

	        //courseTable Click EventBinding
	        courseTable.find("tbody tr").click(function(e){
         	 //@@Todo:clear it
	          var details=$(this).parent().parent().parent().find(".details");
	          
	          if (details){
	              //get the course id
	              console.log(e.currentTarget)
	            //show the details
	            if(details.hasClass("detailsHidden1")){
	                console.log("remove") 
	                $(details[0]).removeClass("detailsHidden1");
	                $(details[1]).removeClass("detailsHidden2");
	            }
	            else{
	              console.log("adding")
	              $(details[0]).removeClass("detailsHidden1");
	              $(details[1]).removeClass("detailsHidden2");
	              $(details[0]).addClass("detailsHidden1");
	              $(details[1]).addClass("detailsHidden2");
	              //get data
	              setTimeout(function(){
	                $(details[0]).removeClass("detailsHidden1");
	              	$(details[1]).removeClass("detailsHidden2");
	              },500); 
	               
	                   
	            }

	          }	        	

	        });

	        //add Review btn
	        addReviewBtn.click(function(e){
	        	$(".reviewOverlay").show();
	        	$(".addReviewArea").slideDown(constants.defaultTime,"easeOutExpo");
	        	return false
	        });

	        //see All Reviews Btn
	        seeMoreReviewBtn.click(function(e){
	        	$(".reviewOverlay").show();
	        	$(".addReviewArea,.ReviewArea").slideDown(constants.defaultTime,"easeOutExpo");
	        	return false;
	    	});
	        $(".addReviewArea").click(function(e){
	        	
	        	 
	        	var addArea=$(".addReviewArea"),
	        		reviewArea=$(".ReviewArea");

	        	reviewArea && reviewArea.slideUp(constants.defaultTime,"easeOutQuint");
	        	addArea && addArea.slideUp(constants.defaultTime,"easeOutQuint",function(){
	        		$(".reviewOverlay").hide();
	        	});
	        	 
	        	
	        	 
	        	
	        });




		}
		


		

		return {
			init:init

		}
	}
//})


//utility
var util = util || {};
util.toArray = function(list) {
  return Array.prototype.slice.call(list || [], 0);
};

