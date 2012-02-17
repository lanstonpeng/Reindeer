# == Schema Information
#
# Table name: schools
#
#  id         :integer         not null, primary key
#  name       :string(30)      not null
#  created_at :datetime        not null
#  updated_at :datetime        not null
#

class School < ActiveRecord::Base
	has_many:courses
end
