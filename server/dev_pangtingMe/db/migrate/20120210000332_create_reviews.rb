class CreateReviews < ActiveRecord::Migration
  def change
    create_table :reviews do |t|
      t.integer :course_id,null:false
      t.string :userName,default:"Nil_userName",null:false
      t.text   :content,default:"Nil_content",null:false
      t.integer :upNum,default:0
      t.integer :downNum,default:0
      t.timestamps
    end
  end
end
