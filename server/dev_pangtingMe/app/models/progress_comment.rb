# == Schema Information
#
# Table name: progress_comments
#
#  id          :integer         not null, primary key
#  progress_id :integer         not null
#  timePoint   :integer
#  comment     :string(150)     default("nothing here >_<")
#  created_at  :datetime        not null
#  updated_at  :datetime        not null
#

class ProgressComment < ActiveRecord::Base
	belongs_to:progress
end
