# == Schema Information
#
# Table name: remarks
#
#  id         :integer         not null, primary key
#  userName   :string(255)     default("Nil_userName"), not null
#  content    :text            not null
#  upNum      :integer         default(0)
#  downNum    :integer         default(0)
#  course_id  :integer         not null
#  created_at :datetime        not null
#  updated_at :datetime        not null
#

class Remark < ActiveRecord::Base
	belongs_to:course
end
