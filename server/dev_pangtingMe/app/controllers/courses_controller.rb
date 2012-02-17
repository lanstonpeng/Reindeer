class CoursesController < ApplicationController

	@@successCode="zws"
	@@failedCode="psy"

	def show	 
		render :json => Course.find(params[:id])
	end
	
	def getCourseByDay
		render :json => Course.where("day = ?",params[:day]).limit(5).order('upNum desc').to_json(:include => {:progress =>{ :include => :progress_comments}},:except=>[:created_at,:updated_at],:inclue=>[:id])
	end

	def getAllCourseByDay
		render :json => Course.where("day = ?",params[:day]).order('upNum desc').to_json(except:[:created_at,:updated_at])

	end

	#warning ,this stupid  code is such an ass-hole
	def getAllTopCourses
		render :json => Course.where("day=1").limit(5).order('upNum desc').to_json(except:[:created_at,:update_at])+Courses.where("day = 2").limit(5).order('upNum desc').to_json(except:[:created_at,:update_at])+Courses.where("day = 3").limit(5).order('upNum desc').to_json(except:[:created_at,:update_at])+Courses.where("day = 4").limit(5).order('upNum desc').to_json(except:[:created_at,:update_at])+Courses.where("day = 5").limit(5).order('upNum desc').to_json(except:[:created_at,:update_at])+Courses.where("day = 6").limit(5).order('upNum desc').to_json(except:[:created_at,:update_at])+Courses.where("day = 7").limit(5).order('upNum desc').to_json(except:[:created_at,:update_at])
	end

	def getProgress
		render :json => Course.find(params[:courseid]).progress.to_json(include:[:progress_comments],except:[:created_at,:updated_at])
	end

	def getReview
		course=Course.find(params[:courseid])
		render :json => course.reviews.order("upNum desc").limit(4).to_json(except:[:created_at,:update_at],:inclue=>[:id])
	end

	def getAllReview
		course=Course.find(params[:courseid])
		render :json => course.reviews.order("upNum desc").to_json(except:[:created_at,:update_at])
	end

	def getRemark
		course=Course.find(params[:courseid])
		render :json => course.remarks.order('upNum desc').to_json(except:[:created_at,:update_at])
	end

	#add new course
	def createCourse

		courseName=params[:courseName]
		place=params[:place]
		teacher=params[:teacher]
		reason=params[:reason]
		schoolId=params[:schoolId]
		day=params[:day]
		startTime=(not params[:startTime].empty?) && Time.parse(params[:startTime]) ||Time.parse("23:59")
		endTime=(not params[:endTime].empty?) &&  Time.parse(params[:endTime]) ||Time.parse("23:59")

		course={
			courseName:courseName,
			place:place,
			teacher:teacher,
			reason:reason,
			day:day,
			schoolId:schoolId,
			startTime:startTime,
			endTime:endTime
		}

		newCourse=School.find(schoolId).courses.new(courseName:courseName,place:place,teacher:teacher,reason:reason,school_id:schoolId,day:day,startTime:startTime,endTime:endTime)
		if newCourse.save
			render :json => { status:@@successCode+" adding course successfully",course:course}
		else
			render :json => {status:@@failedCode+" adding course failed >_<"}
		end

		

	end



	def createRemark
		userName=params[:userName]
		content=params[:content]
		courseId=params[:courseId]

		newRemark=Course.find(courseId).remarks.new(userName:userName,content:content,course_id:courseId)
		if newRemark.save
			render :json => {status:@@successCode+"adding Remark successfully",remark:{
				userName:userName,
				content:content,
				courseId:courseId
			}}
		else
			render :json => {status:@@failedCode +" adding Remark failed >_<" }
		end
	end

	def createReview
		courseId=params[:courseId]
		userName=params[:userName]
		content=params[:content]	

		newReview=Course.find(courseId).reviews.new(userName:userName,content:content,course_id:courseId)
		if newReview.save
			render :json => {status: @@successCode+" adding Review successfully",review:{
				userName:userName,
				content:content,
				courseId:courseId
			}}
		else
			render :json => {status: @@failedCode+" adding Review failed"}
		end
	end

	def createProgressComment
		courseId=params[:courseId]
		timePoint=params[:timePoint]
		comment=params[:comment]

		newProgressComment=Course.find(courseId).progress.progress_comments.new(timePoint:timePoint,comment:comment)
		if newProgressComment.save
			render :json => {status: @@successCode+" adding ProgressComment successfully",progressComment:{
				comment:comment,
				timePoint:timePoint,
				courseId:courseId
			}}
		else
			render :json => {status: @@failedCode+" adding ProgressComment failed"}
		end
	end		

	#update part
	def updateCourse

		courseName=params[:courseName]
		place=params[:place]
		teacher=params[:teacher]
		reason=params[:reason]
		schoolId=params[:schoolId]
		day=params[:day]
		courseId=params[:courseId]
		startTime=params[:startTime] && DateTime.parse(params[:startTime]) ||DateTime.parse("23:59")
		endTime=params[:endTime] &&  DateTime.parse(params[:endTime]) ||DateTime.parse("23:59")
		upNum=params[:upNum]
		downNum=params[:downNum]

		courseItem=School.find(schoolId).courses.find(courseId)
		courseItem.with_lock do
			if courseItem.update_attributes({
					courseName:courseName,
					place:place,
					teacher:teacher,
					reason:reason,
					day:day,
					startTime:startTime,
					endTime:endTime
				})

				#maybe safer by this mean
				if upNum
					courseItem.update_attributes({
						upNum:courseItem.upNum+1
					})
				end
				if downNum
					courseItem.upadte_attributes({
						downNum:courseItem.downNum+1
					})
				end				
				render :json => { status:@@successCode+" updating Course successfully"}

			else
				render :json => {status:@@failedCode +" updating Course failed"}
			end
		end

	
	end

	def updateReview
		courseId=params[:courseId]
		userName=params[:userName]
		content=params[:content]
		reviewId=params[:reviewId]
		upNum=params[:upNum]
		downNum=params[:downNum]
		reviewsItem=Course.find(courseId).reviews.find(reviewId)
		
		reviewsItem.with_lock do
			if  reviewsItem.update_attributes({
					userName:userName,
					content:content
				})
				#maybe safer by this mean
				if upNum
					reviewsItem.update_attributes({
						upNum:reviewsItem.upNum+1
					})
				end
				if downNum
					reviewsItem.upadte_attributes({
						downNum:reviewsItem.downNum+1
					})
				end
				render :json => {status: @@successCode+" updating Review  successfully"}
			else
				render :json => {status: @@failedCode + "updating Review failed"}
			end

		end		

	end

	def updateRemark
		upNum=params[:upNum]
		downNum=params[:downNum]
		courseId=params[:courseId]
		userName=params[:userName]
		content=params[:content]
		remarkId=params[:remarkId]
		remarkItem=Course.find(courseId).remarks.find(remarkId)
		
		remarkItem.with_lock do
			if  remarkItem.update_attributes({
					userName:userName,
					content:content
				})
				#maybe safer by this mean
				if upNum
					remarkItem.update_attributes({
						upNum:remarkItem.upNum+1
					})
				end
				if downNum
					remarkItem.upadte_attributes({
						downNum:remarkItem.downNum+1
					})
				end				
				render :json => {status: @@successCode+" updating Remark  successfully"}
			else
				render :json => {status: @@failedCode + "updating Remark failed"}
			end

		end

	end

	def updateNum
		courseId=params[:courseId]
		remarkId=params[:remarkId]
		reviewId=params[:reviewId]
		command=params[:command]

		course=Course.find(courseId)	
		course.with_lock do
			if reviewId
				reviewItem=course.reviews.find(reviewId)
				reviewItem.update_attribute(
					command,reviewItem[command]+1
				)
				render :json => {status:@@successCode+" updating review #{command} successfully"}
			elsif remarkId
				remarkItem=course.remarks.find(remarkId)
				remarkItem.update_attribute(
					command,remarkItem[command] + 1
				)
				render :json => {status:@@successCode+" updating remark #{command} successfully"}
			else
				course.update_attribute(
					command,course[command]+1
				)
				render :json => {status:@@successCode+" updating course #{command} successfully"}
			end
		end

	end

	def downNum

	end


end
