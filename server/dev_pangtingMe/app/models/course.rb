# == Schema Information
#
# Table name: courses
#
#  id         :integer         not null, primary key
#  courseName :string(50)      not null
#  place      :string(100)     not null
#  startTime  :datetime        default(2012-02-10 00:39:52 UTC)
#  endTime    :datetime
#  teacher    :string(20)      default("nil_teacher")
#  reason     :text            not null
#  upNum      :integer         default(0)
#  downNum    :integer         default(0)
#  day        :integer         not null
#  school_id  :integer         not null
#  created_at :datetime        not null
#  updated_at :datetime        not null
#

class Course < ActiveRecord::Base
	#attr_acessssible:
	#validates :courseName, presence: true
	has_many:remarks
	has_many:reviews
	has_one:progress
	has_and_belongs_to_many:course_catagories
	belongs_to:school
end
