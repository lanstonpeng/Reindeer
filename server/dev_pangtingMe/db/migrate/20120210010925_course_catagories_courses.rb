class CourseCatagoriesCourses < ActiveRecord::Migration
  def up
  	create_table :course_catagories_courses do |t|
		t.integer :course_id
		t.integer :course_catagory_id
	end
  end

  def down
  	drop_table :course_catagories_courses
  end
end
