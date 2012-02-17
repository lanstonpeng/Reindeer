# == Schema Information
#
# Table name: course_catagories
#
#  id       :integer         not null, primary key
#  name     :string(20)      not null
#  parentId :integer
#

class CourseCatagory < ActiveRecord::Base
	has_and_belongs_to_many:courses
end
