
//@@Namespace:Functionality
var Functionality={
	toArray : function(list) {
 		return Array.prototype.slice.call(list || [], 0);
	},
	//store template here
	templateCache:{},
	loadTemplateSync:function(options){
		var that=this;
		//See if we've already load this template
		if(!that.templateCache[options.path]){
			$.ajax({
				type:"GET",
				async:false,
				url:options.path,
				dataType:"text",
				success:function(data){

					that.templateCache[options.path]=data;
					return data;
				}
			});
		}
		else{
			return that.templateCache[options.path];
		}


	},
	loadTemplateAsync:function(options){
		var that;
		if(!that.templateCache[options.path]){
			$("#tmpResult").load(options.path,function(){
				that.templateCache[options.path]=$("#tmpResult").html();
				options.callback&&options.callback();
			});
			
		}
	},
	getDay:function(dayNum){
		switch(dayNum){
			case 1:
				return "monday";
			case 2:
				return "tuesday";
			case 3:
				return "wednesday";
			case 4:
				return "thrusday";
			case 5:
				return "friday";
			case 6:
				return "saturday";
			case 7:
				return "sunday";
			case 0:
				return "stream";
				
		}
	},
	//Data Binding Module
	dataUtil:(function(){

			var du={},
				privateVar=1; //For demostration
			

			du.config={
				router:{
					domain:"http://localhost:3000",
					course:{
						add:"",
						destroy:"",
						update:"",
						showall:"",
						gettable:"/courses/table/#day",
						getalltable:""

					}
				},
				tmplate:{
					courseTable:"templates/tmpl-course-table.js"
				}
			};

			du.request=function(options){
				var defaultSuccess=function(data){
					if(data){
						return data;
					}
				};

				$.ajax({
					type:options.type||"POST",
					url:options.url,
					data:options.data,
					dataType:options.dataType||"JSON",
					success:options.success||defaultSuccess,
					beforeSend:options.beforeSend
				});
			};

			du.bindTemplate=function(options){
				
			};

			du.getProgress=function(courseId){
				$("#tooltip").tooltip({title:"First Class"});
			}
			//@@ToDo:  get data from server
			return du;
		})(),
};


var UI={
	bindTemplate:function(options){
		var bindTarget=options.target;
		bindTarget.html(options.content);
	}
};
UI.Course=(function(){
	var courseTable=$("table.courseTable");
	var bindTable=function(options){
		UI.bindTemplate(options);
	};
	var bindTableEvent=function(){
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
	}

	return {
		bindTableEvent:bindTableEvent,
		bindTable:bindTable
	}

})();

//@@Namespace: Controller
var DataContorller={};
DataContorller.CourseController=(function(){
	var dataUtil=Functionality.dataUtil,
		template=Functionality.templateCache["templates/tmpl-course-table.js"];

	var getCoursesTableByDay=function(day){
			//Load template Sync
			Functionality.loadTemplateSync({path:"templates/tmpl-course-table.js"});
			Functionality.loadTemplateSync({path:"templates/tmpl-course-tdetails.js"});

			dataUtil.request({
				type:"GET",
				url:dataUtil.config.router.domain+dataUtil.config.router.course.gettable.replace("#day",day||1),
				beforeSend:function(){
					template=template||Functionality.templateCache["templates/tmpl-course-table.js"];
					
				},
				success:function(data){
				 	var d=Mustache.render(template, data),
				 		days=Functionality.getDay(day),
				 		target=$("."+days+"Content .courseTable tbody");
				 	//That's the View taking place
				 	UI.Course.bindTable({content:d,target:target});
				 	UI.Course.bindTableEvent();
				}
				});	
				//bind data to template
				//dataUtil.bindTemplate({path});
				//bind event
			},
		getAllTopCoursesTable=function(){
			Functionality.loadTemplateSync({{path:"templates/tmpl-course-table.js"}});
		},


	

	return {
		getCoursesTableByDay:getCoursesTableByDay,
		getAllTopCoursesTable:getAllTopCoursesTable
	}

})();

//@@Namespace:Model Module
var metaDataModel={
	//Course Module
	course:function(options){
		this.name=options.name||"";
 
	}

};


//Core,only pangting object expose to the global envirnment 	
window.pangting=(function(){
		//config table
		var constants={
			defaultTime:400,//most slideDown and slideUp use this
			navTime:400,
			addCourseTime:600,
			commentOverlayDown:600,
			database:{}

		}
       

		
		 
		function init(){
			/*
				@@Todo:
					initial data-biding
			*/
			//init modules
			
			Functionality.dataUtil.getProgress(); //just for desmontration,will be clear

			DataContorller.CourseController.getCoursesTableByDay(1);
			//init the necessary elements,variables
			var sideBarBtn=$("ul.buttons"),
				logoBtn=$(".navigation .logo"),
				courseTable=$("table.courseTable"),
				addCourseBtn=$("a.addCourseBtn"),
				commentsSwitch=$(".iphone_switch"),
				seeAllCourseBtn=$("a.seeAllCourses"),
				seeMoreReviewBtn=$("a.seeMoreReviewBtn"),
				addReviewBtn=$("a.addReviewBtn");

		
			//init the basic functionality
        
	        //navgation,a bit ugly here
	        function _navDelegate(e){
	        	console.log($(this).attr('class'))
	            $( "."+$(this).attr('class')+"Content" ).ScrollTo({
	                            duration: constants.navTime
	                           
	              });	        	
	        }
	        sideBarBtn.children().click(_navDelegate);
	        logoBtn.on("click",_navDelegate); //logo needs navigtion,too

	        //comment switch
	        commentsSwitch.on("click",function(e){
	        	var cache=$(this),
	        		commentOverlay=$(".commentOverlay");
	        	cache.toggleClass("iphone_switch_off");
	        	if (commentOverlay.css("display")=="none"){
	        		 
	        		commentOverlay.clearQueue().show("slide", { direction: "up",easing:"easeOutQuint" }, constants.commentOverlayDown); 
	        	}
	        	else{
	        		commentOverlay.hide("slide", { direction: "up",easing:"easeOutQuint" }, constants.commentOverlayDown); 
	        	}
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
})();



/*
//extend Functionality
Functionality.toArray = function(list) {
  return Array.prototype.slice.call(list || [], 0);
};
Functionality.getDay=function(dayNum){
	switch(dayNum){
		case 1:
			return "monday";
		case 2:
			return "tuesday";
		case 3:
			return "wednesday";
		case 4:
			return "thrusday";
		case 5:
			return "friday";
		case 6:
			return "saturday";
		case 7:
			return "sunday";
		case 0:
			return "stream";
			
	}
}
Functionality.loadTemplateAsync=function(options){
	if(!Functionality.templateCache[options.path]){
		$("#tmpResult").load(options.path,function(){
			Functionality.templateCache[options.path]=$("#tmpResult").html();
			options.callback&&options.callback();
		});
		
	}
};
Functionality.loadTemplateSync=function(options){
		
		//See if we've already load this template
		if(!Functionality.templateCache[options.path]){
			$.ajax({
				type:"GET",
				async:false,
				url:options.path,
				dataType:"text",
				success:function(data){

					Functionality.templateCache[options.path]=data;
					return data;
				}
			});
		}
		else{
			return Functionality.templateCache[options.path];
		}
}*/

