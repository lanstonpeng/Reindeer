class CreateCourses < ActiveRecord::Migration
  def change
    create_table :courses do |t|
      t.string :courseName,limit:50,null:false
      t.string :place,limit:100,null:false
      t.datetime :startTime,default:Time.now
      t.datetime :endTime
      t.string :teacher,limit:20,default:"nil_teacher"
      t.text :reason,null:false
      t.integer :upNum,default:0
      t.integer :downNum,default:0
      t.integer :day,null:false
      t.integer :school_id,null:false
      t.timestamps
    end
    #add_index :courses, [:user_id, :created_at]
  end
end
