class CreateProgressComments < ActiveRecord::Migration
  def change
    create_table :progress_comments do |t|
      t.integer :progress_id,null:false
      t.integer :timePoint
      t.string  :comment,default:"nothing here >_<",limit:150
      t.timestamps
    end
  end
end
