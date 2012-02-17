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
			mondayNeedUpdated:false,
			tuesdayNeedUpdated:false,
			wednesdayNeedUpdated:false,
			thursdayNeedUpdated:false,
			fridayNeedUpdated:false,
			saturdayNeedUpdated:false,
			sundayNeedUpdated:false

			/*
			monday:{
				
			},
			mondayAll:{
				
			},
			tuesday:{
				
			}*/
		},
		courseReviews:{

			/*
			review22NeedUpdated:false
			*/
		},
		courseRemarks:{
			/*
			remark22NeedUpdated:false
			*/
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
		return {
			token:data
		}
	},
	getDay:function(dayNum){
		var dayArr=[
			"stream",
			"monday",
			"tuesday",
			"wednesday",
			"thursday",
			"friday",
			"saturday",
			"sunday"
		];
		return dayArr[dayNum];
	},
	getNum:function(day){
		var numArr={
			"stream":0,
			"monday":1,
			"tuesday":2,
			"wednesday":3,
			"thursday":4,
			"friday":5,
			"saturday":6,
			"sunday":7
		};
		return numArr[day];
	},
	isAllow:function(options){
		var tempIP="";
		function _getIP(callback){
			//I dont know if it works out
			$.ajax({
				type:"GET",
				url:"http://api.hostip.info/get_html.php",
				async:false,
				success:function(data){
					tempIP=data.match(/IP:.*/)[0].replace("IP: ","");
				},
				error:function(e){
					console.log(e)
				}
			});				
		}
		/*
		I use LocalStorage to store your ip and timestamp here,
		You're free to edit your localStorage to make infinite voting,lol!
		*/
		var obj=localStorage[options.item] && JSON.parse(localStorage[options.item]);

		if (obj){
			_getIP();
			if(!obj[tempIP]){
				obj[tempIP]={} 
			}
			if(obj[tempIP][options.itemId]){
				var flag=Date.now()-obj[tempIP][options.itemId]["voteTime"] > 86400000;
				obj[tempIP][options.itemId]["voteTime"]=Date.now();
				localStorage[options.item]=JSON.stringify(obj);
				return flag;
			}
			else{
				obj[tempIP][options.itemId]={};
				obj[tempIP][options.itemId]["voteTime"]=Date.now();		
				localStorage[options.item]=JSON.stringify(obj);			
				return true;
			}
		}
		else{
			//set ip
			_getIP();
			obj={};
			obj[tempIP]={};
			obj[tempIP][options.itemId]={};
			obj[tempIP][options.itemId]["voteTime"]=Date.now();
			localStorage[options.item]=JSON.stringify(obj);
			return true;
		}

	},
	//Data Binding Module
	dataUtil:(function(){

			var du={},
				privateVar=1; //For demostration
			

			du.config={
				router:{
					domain:"http://localhost:3000/",
					course:{
						add:"",
						destroy:"",
						update:"",
						showall:"",
						gettable:"courses/top/#day",
						getallbyday:"courses/all/#day",
						getprogress:"courses/progress/#courseid",
						getreview:"courses/review/#courseid",
						getallreview:"courses/review/all/#courseid",
						getremark:"courses/remark/#courseid",
						addCourse:"courses/addcourse",
						addReview:"courses/addreview",
						addRemark:"courses/addremark",
						updateNum:"courses/updateNum"

					}
				},
				templatePath:{
					courseTable:"templates/tmpl-course-table.js",
					courseDetail:"templates/tmpl-course-details.js",
					courseReview:"templates/tmpl-course-reviews.js",
					courseAll:"templates/tmpl-course-all.js",
					courseRemark:"templates/tmpl-course-remark.js",
					courseAllReivew:"templates/tmpl-course-reviews-all.js"
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