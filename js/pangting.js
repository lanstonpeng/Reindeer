
//@@Namespace:Functionality===================================================================================================
var Functionality={
	lookupJSON:function(json){
		//I make a sugar here
		//e.g:
		//Functionality.lookupJSON(json).where('upNum=5'),but it's slow
		//so,there's still a fast version here
		//e.g:
		//Functionality.lookupJSON(json).where('upNum',5)
		if (json instanceof Array){
			function _where(arg1,arg2){
				if(arguments.length>1){
					for(var i=0,len=json.length;i<len;i++){
						if(json[i][arg1]==arg2){
							return json[i];
						}
					}
					return {};
				}
				else{ //sugar here!
					/*
					for(var i=0,len<json.length;i<len;i++){
						var arg1=arguments[0].split('=')[0],
							
					}*/
				}
			}

			return {
				where:_where
			}
		}
		else{
			return json;
		}

		
	},
	toArray:function(list) {
 		return Array.prototype.slice.call(list || [], 0);
	},

	//store template here
	templateCache:{},
	//data modle caching 
	//@@Namespace:Model Module
	modelCache:{
		course:{
			/*
			monday:{
				
			},
			tuesday:{
				
			}*/
		}
		 
	},
	loadTemplateSync:function(options){
		var that=this,
			template="";
		//See if we've already load this template
		if(!that.templateCache[options.path]){
			$.ajax({
				type:"GET",
				async:false,
				url:options.path,
				dataType:"text",
				success:function(data){

					that.templateCache[options.path]=data;
					template=data;
				}
			});
		}
		else{
			return that.templateCache[options.path];
		}
		return template;

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
	formatJsonForMustache:function(data){
		console.log(JSON.stringify(data))
		return JSON.parse('{"token":'+JSON.stringify(data)+"}");

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
						gettable:"/courses/top/#day",
						getalltable:"/courses/top/all/"

					}
				},
				templatePath:{
					courseTable:"templates/tmpl-course-table.js",
					courseDetail:"templates/tmpl-course-details.js"
					 
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
					beforeSend:options.beforeSend,
					error:options.error
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

//@Namespace:UI ===================================================================================================
var UI={
	bindTemplate:function(options){
		var bindTarget=options.target;
		bindTarget.html(options.content);
	}
};
UI.Course=(function(){
	var courseTable=$("table.courseTable"),
		couresDetailtemplatePath=Functionality.dataUtil.config.templatePath.courseDetail;
	
 

	function bindTableEvent(options){


		courseTable.find("tbody tr").click(function(e){
	 	 //@@Todo:clear it

    	var details=$(this).parent().parent().parent().find(".details"),
  			courseId=this.dataset.courseid;
  		
  		//bind course detail every time the user click the tr
		(function bindCourseDetails(courseId,days){
			var template=Functionality.loadTemplateSync({path:couresDetailtemplatePath}),
				courseCache=Functionality.modelCache.course[days];
				data=Functionality.lookupJSON(courseCache).where('id',courseId),
				d=Mustache.render(template, data);
			
			$(details[0]).html(d);
			 
			
		})(courseId,options.days);
	     
	     
	      	  
	    //The animation part
	    if (details){
	        if(details.hasClass("detailsHidden1")){
	           
	            $(details[0]).removeClass("detailsHidden1");
	            $(details[1]).removeClass("detailsHidden2");
	        }
	        else{
	         
	          $(details[0]).removeClass("detailsHidden1");
	          $(details[1]).removeClass("detailsHidden2");
	          $(details[0]).addClass("detailsHidden1");
	          $(details[1]).addClass("detailsHidden2");
	          setTimeout(function(){
	            $(details[0]).removeClass("detailsHidden1");
	          	$(details[1]).removeClass("detailsHidden2");
	          },500); 
	        }
	      }	        	
	    });
	};

	var bindTable=function(options){
		UI.bindTemplate(options);

		bindTableEvent(options);
	};


	return {
		//bindTableEvent:bindTableEvent,
		bindTable:bindTable
		//bindCourseDetails:bindCourseDetails
	}

})();

//@@Namespace: Controller===================================================================================================
var DataContorller={};
DataContorller.CourseController=(function(){
	var dataUtil=Functionality.dataUtil,
		couresTableTemplatePath=dataUtil.config.templatePath.courseTable;
		
		//template=Functionality.templateCache[couresTableTemplatePath];
	
	var getCoursesTableByDay=function(day){

			//Load template Sync
			var template=Functionality.loadTemplateSync({path:couresTableTemplatePath});
			/*
			//not really necessary here,but maybe it works to imporve the speed somehow
			Functionality.loadTemplateSync({path:couresDetailtemplatePath});
			*/
			var days=Functionality.getDay(day);

			function _success(data){
				 	//console.log(data,template);
				 	//cache the course data
				 	Functionality.modelCache.course[days]=data;

					data=Functionality.formatJsonForMustache(data);

				 	var d=Mustache.render(template, data),
				 		target=$("."+days+"Content .courseTable tbody");
				 	
				  


				 	//That's the View taking place
				 	UI.Course.bindTable({content:d,target:target,days:days});
				 	//UI.Course.bindTableEvent();
			};

			//check if there's a cache here,but worth nothing at this moment
			

			if (!Functionality.modelCache.course[days]){
				dataUtil.request({
					type:"GET",
					url:dataUtil.config.router.domain+dataUtil.config.router.course.gettable.replace("#day",day||1),
					beforeSend:function(){
						//console.log(this.url);
						//template=template||Functionality.templateCache[couresTableTemplatePath];
					},
					success:_success,
					error:function(e){
						console.log("course table request error[e.responseText]: ",e.responsText);
					}
				});					

			}
			else{
				_success(Functionality.modelCache.course[days])

			}

				
		},//---getCoursesTableByDay end ---

		getAllTopCoursesTable=function(){
			Functionality.loadTemplateSync({path:couresTableTemplatePath});
		};


	

	return {
		getCoursesTableByDay:getCoursesTableByDay,
		getAllTopCoursesTable:getAllTopCoursesTable
	}

})();



//Core,only pangting object expose to the global envirnment ===================================================================================================
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
	        	//console.log($(this).attr('class'))
	        	 
	             
	            $.scrollTo($( "."+$(this).attr('class')+"Content" ),{
	                            duration: constants.navTime,
	                            easing:'jswing'          
	            });
	        };
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

	        // //courseTable Click EventBinding
	        // courseTable.find("tbody tr").click(function(e){
         // 	 //@@Todo:clear it
	        //   var details=$(this).parent().parent().parent().find(".details");
	          
	        //   if (details){
	        //       //get the course id
	        //       console.log(e.currentTarget)
	        //     //show the details
	        //     if(details.hasClass("detailsHidden1")){
	        //         console.log("remove") 
	        //         $(details[0]).removeClass("detailsHidden1");
	        //         $(details[1]).removeClass("detailsHidden2");
	        //     }
	        //     else{
	        //       console.log("adding")
	        //       $(details[0]).removeClass("detailsHidden1");
	        //       $(details[1]).removeClass("detailsHidden2");
	        //       $(details[0]).addClass("detailsHidden1");
	        //       $(details[1]).addClass("detailsHidden2");
	        //       //get data
	        //       setTimeout(function(){
	        //         $(details[0]).removeClass("detailsHidden1");
	        //       	$(details[1]).removeClass("detailsHidden2");
	        //       },500); 
	               
	                   
	        //     }

	        //   }	        	

	        // });

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

