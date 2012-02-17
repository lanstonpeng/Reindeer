class CreateRemarks < ActiveRecord::Migration
  def change
    create_table :remarks do |t|
      t.string :userName,default:"Nil_userName",null:false
      t.text   :content,null:false
      t.integer  :upNum,default:0
      t.integer  :downNum,default:0
      t.integer  :course_id,null:false
      t.timestamps
    end
    #add_index :remarks, [:user_id, :created_at]
  end
end
