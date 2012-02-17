# == Schema Information
#
# Table name: progresses
#
#  id         :integer         not null, primary key
#  width      :integer         default(0)
#  course_id  :integer         not null
#  created_at :datetime        not null
#  updated_at :datetime        not null
#

class Progress < ActiveRecord::Base
	has_many:progress_comments
	belongs_to:course
end
