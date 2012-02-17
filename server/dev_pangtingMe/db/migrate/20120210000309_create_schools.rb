class CreateSchools < ActiveRecord::Migration
  def change
    create_table :schools do |t|
      t.string :name, limit:30,null:false
      t.timestamps
    end
  end
end
