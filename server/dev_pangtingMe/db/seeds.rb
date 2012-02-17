# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
school1=School.create(name:"GDUT")
school2=School.create(name:"Hacer school")

monday1=school1.courses.create(courseName:"Test courseName",place:"Test 3245place",startTime:Time.now.to_datetime,endTime:Time.now.to_datetime,teacher:"Testghjkher",reason:"Testghjkson",day:1)
monday2=school1.courses.create(courseName:"Twqert345 asdfasdf",place:"Test placsadfe",startTime:Time.now.to_datetime,endTime:Time.now.to_datetime,teacher:"Tezxvher",reason:"Test reason",day:1)
monday3=school1.courses.create(courseName:"Test courzxvzxcvseName",place:"Teasdfsdface",startTime:Time.now.to_datetime,endTime:Time.now.to_datetime,teacher:"Tesfdhgher",reason:"Tesguikhjkson",day:1)

monday1.course_catagories.create(name:"Computer")
monday1.course_catagories.create(name:"Science")

mondayprogress=monday1.create_progress(width:50)
mondayprogress.progress_comments.create(timePoint:4,comment:"youku")
mondayprogress.progress_comments.create(timePoint:30)

monday1.remarks.create(userName:"Test userName",content:"Test content")
monday1.remarks.create(userName:"Test userName",content:"Test content")
monday1.remarks.create(userName:"Test userName",content:"Test content")

monday1.reviews.create(userName:"youku",content:"Hi,I'm rdfhdfhdfheview")
monday1.reviews.create(userName:"asdfasdf",content:"Hi,I'm redfghdfghhhhhhhhhhhhhhhhhhhview")
monday1.reviews.create(userName:"fhdfhdfgh",content:"Hi,I'm fghdfasdffffffffffffffffffffffsadfasdfasdfghdfhdfghdfgh")

