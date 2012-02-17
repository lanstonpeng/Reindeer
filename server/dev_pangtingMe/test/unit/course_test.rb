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

require 'test_helper'

class CourseTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
