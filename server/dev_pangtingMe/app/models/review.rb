# == Schema Information
#
# Table name: reviews
#
#  id         :integer         not null, primary key
#  course_id  :integer         not null
#  userName   :string(255)     default("Nil_userName"), not null
#  content    :text            default("Nil_content"), not null
#  upNum      :integer         default(0)
#  downNum    :integer         default(0)
#  created_at :datetime        not null
#  updated_at :datetime        not null
#

class Review < ActiveRecord::Base
	belongs_to:course
end
