class CreateCourseCatagories < ActiveRecord::Migration
  def change
    create_table :course_catagories do |t|
      t.string :name,limit:20,null:false
      t.integer :parentId
    end
  end
end
