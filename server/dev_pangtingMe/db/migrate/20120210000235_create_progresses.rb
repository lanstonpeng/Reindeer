class CreateProgresses < ActiveRecord::Migration
  def change
    create_table :progresses do |t|
      t.integer :width,default:0
  	  t.integer :course_id,null:false
      t.timestamps
    end
  end
end
