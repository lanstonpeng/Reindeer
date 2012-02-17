class CoursesCourseCatagories < ActiveRecord::Migration
  def up
  	create_table :courses_course_catagories do |t|
		t.integer :course_id
		t.integer :course_catagory_id
	end
  end

  def down
  	drop_table :courses_course_catagories
  end
end
