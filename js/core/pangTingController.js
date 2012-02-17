var DataContorller={};
DataContorller.CourseController=(function(){
	var dataUtil=Functionality.dataUtil,
		templatePathRoot=dataUtil.config.templatePath,
		couresTableTemplatePath=templatePathRoot.courseTable,
		couresDetailtemplatePath=templatePathRoot.courseDetail,
		courseReviewTemplatePath=templatePathRoot.courseReview,
		courseAllTemplatePath=templatePathRoot.courseAll,
		courseRemarkTemplatePath=templatePathRoot.courseRemark,
		courseReviewAllTemplatePath=templatePathRoot.courseAllReivew;
		

	var routerRoot=dataUtil.config.router,
		domain=routerRoot.domain,
		getTableURL=routerRoot.course.gettable,
		getAllCourseURL=routerRoot.course.getallbyday,
		getRemarkURL=routerRoot.course.getremark,
		getAllReviewURL=routerRoot.course.getallreview;
	
	var addCourseURL=routerRoot.course.addCourse,
		addReviewURL=routerRoot.course.addReview,
		addRemarkURL=routerRoot.course.addRemark;

	var updateNumURL=routerRoot.course.updateNum;

	
	 

	function _xhrErrorHandler(e){
		console.log("xhr request error[e.responseText]: ",e.responsText);
	}
	
		
		//template=Functionality.templateCache[couresTableTemplatePath];
	
	var getCoursesTableByDay=function(options){

			//Load template Sync
			var tableTemplate=Functionality.loadTemplateSync({path:couresTableTemplatePath}),
				detailsTemplate=Functionality.loadTemplateSync({path:couresDetailtemplatePath}),
				day=options.day;


			/*
			//not really necessary here,but maybe it works to imporve the speed somehow
			Functionality.loadTemplateSync({path:couresDetailtemplatePath});
			*/
			var days=Functionality.getDay(day);

			function _courseJsonPatch(data){
				var emptyProgressObj={
					width:0,
					progress_comments:[]
				}
				 for(var i=0,len=data.length;i<len;i++){
				 	if(!data[i].progress) data[i].progress=emptyProgressObj;
				 }
			};

			function _success(data){
				 	_courseJsonPatch(data); //add an empty progress obj here
				 	console.log("courseTable success data: ",data);
				 	//cache the course data
				 	Functionality.modelCache.course[days]=data;
					data=Functionality.formatJsonForMustache(data);
				 	//That's the View taking place
				 	UI.CourseTable.bindEvent({
					 	data:data,
					 	days:days,
					 	tableTemplate:tableTemplate,
					 	detailsTemplate:tableTemplate
					});
					//no need to request from the server 
					Functionality.modelCache.course[days+"NeedUpdated"]=false;
			};

			//check if there's a cache here,but worth nothing at this moment creating the table
			//but it make sense in binding details cause it wont request any course data anymore
			//##warning,If there's something update,you have to update this
			if (!Functionality.modelCache.course[days] || Functionality.modelCache.course[days+"NeedUpdated"]){
				dataUtil.request({
					type:"GET",
					url:domain+getTableURL.replace("#day",day),
					success:_success,
					error:_xhrErrorHandler
				});

				
			}
			else{
				_success(Functionality.modelCache.course[days])

			}

				
		},//---getCoursesTableByDay end ---
		getAllTopCoursesTable=function(options){
			var template=Functionality.loadTemplateSync({path:courseAllTemplatePath}),
				days=options.days,
				day=Functionality.getNum(days);
				
			//console.log(template,days,domain+getAllURL.replace("#day",day))
			function _success(data){
				console.log("get all course data",data)
				Functionality.modelCache.course[days+"All"]=data;
				data=Functionality.formatJsonForMustache(data);
				UI.CourseAll.bindEvent({
					data:data,
					template:template,
					days:days
				});
				Functionality.modelCache.course[days+"NeedUpdated"]=false;

			}

			if(!Functionality.modelCache.course[days+"All"] || Functionality.modelCache.course[days+"NeedUpdated"]){
				dataUtil.request({
					type:"GET",
					url:domain+getAllCourseURL.replace("#day",day),
					success:_success,
					error:_xhrErrorHandler
				})
			}
			else{
				_success(Functionality.modelCache.course[days+"All"])
			}



		},
		//this is where ass hole happens
		getReviewByCourseId=function(options){
			var template=Functionality.loadTemplateSync({path:courseReviewTemplatePath}),
				courseId=options.courseId,
				reviewIdentity="review"+courseId;
				
			//Functionality.modelCache.courseReviews["review"+courseId+"NeedUpdated"] || Functionality.modelCache.courseReviews["review"+courseId+"NeedUpdated"]=false;
			 
			function _success(data){
				Functionality.modelCache.courseReviews[reviewIdentity]=data;
				
				if(!data.length){//no reviews at all
					data[0]={
							userName:"System tips",
							content:"There's no reviews at this moment,click here to write your own",
							display:"none"
						}
					
				}

				data=Functionality.formatJsonForMustache(data);
				
				//asshole damn code!!!
				UI.bindTemplate({
					target:options.target,
					data:data,
					template:template
				});
			}

			if (! Functionality.modelCache.courseReviews[reviewIdentity]){
				dataUtil.request({
					type:"GET",
					url:dataUtil.config.router.domain+dataUtil.config.router.course.getreview.replace("#courseid",courseId),
					success:_success,
					error:function(){
						console.log("error")
					}
				});
			}
			else{
				_success(Functionality.modelCache.courseReviews[reviewIdentity]);
			
			}


		},
		getAllReviewByCourseId=function(options){
			var template=Functionality.loadTemplateSync({path:courseReviewTemplatePath}),
				courseId=options.courseId,
				allreivewIdentity="Allreview"+courseId;

			function _success(data){
				Functionality.modelCache.courseReviews[allreivewIdentity]=data;
				data=Functionality.formatJsonForMustache(data);
				UI.ReviewAll.bindEvent({
					data:data,
					template:template
				});
			}
			if(!Functionality.modelCache.courseReviews[allreivewIdentity]){
				dataUtil.request({
					type:"GET",
					url:domain+getAllReviewURL.replace("#courseid",courseId),
					success:_success,
					error:_xhrErrorHandler
				});
			}
			else{
				_success(Functionality.modelCache.courseReviews[allreivewIdentity]);
			}

		},
		getRemarkByCourseId=function(options){
			var template=Functionality.loadTemplateSync({path:courseRemarkTemplatePath}),
				courseId=options.courseId,
				remarkIdntity="remark"+courseId;
			
			
			function _success(data){
				Functionality.modelCache.courseRemarks[remarkIdntity]=data;

				data=Functionality.formatJsonForMustache(data);
				UI.Remark.bindEvent({
					data:data,
					template:template,
					courseId:options.courseId
				});

			}
			if(!Functionality.modelCache.courseRemarks[remarkIdntity]){
				dataUtil.request({
					type:"GET",
					url:domain+getRemarkURL.replace("#courseid",courseId),
					success:_success,
					error:_xhrErrorHandler
				});
			}
			else{
				_success(Functionality.modelCache.courseRemarks[remarkIdntity]);
			}

		},
		addCourse=function(data,callback){
			console.log("add course receive options",data,domain+addCourseURL);
			dataUtil.request({
				type:'POST',
				url:domain+addCourseURL,
				data:data,
				success:function(result){
					callback && callback();
					console.log("add course successfully",result);
				},
				error:_xhrErrorHandler
			});
			return false;
		},
		updateNum=function(options,callback){
			//console.log("update Num ",options,domain+updateNumURL);	
			dataUtil.request({
				type:"POST",
				url:domain+updateNumURL,
				data:{
					courseId:options.courseId,
					remarkId:options.remarkId,
					reviewId:options.reviewId,
					command:options.command
				},
				success:function(data){
					console.log("updateNum successfully",data);
					callback && callback();
				},
				error:_xhrErrorHandler
			});
		},
		addReview=function(data,callback){
			
		},
		addRemark=function(data,callback){
			console.log("add remark receive data",data,domain+addRemarkURL);
			dataUtil.request({
				type:'POST',
				url:domain+addRemarkURL,
				data:data,
				success:function(result){
					callback&&callback();
					console.log("add remark successfully",result);
				},
				error:_xhrErrorHandler

			})
		}


	

	return {
		initCourseTableByDay:getCoursesTableByDay,
		getCoursesTableByDay:getCoursesTableByDay,
		getCourseReviewByCourseId:getReviewByCourseId,
		getAllTopCoursesTable:getAllTopCoursesTable,
		getAllReviewByCourseId:getAllReviewByCourseId,
		getRemarkByCourseId:getRemarkByCourseId,
		addCourse:addCourse,
		updateNum:updateNum,
		addRemark:addRemark
	}

})();
