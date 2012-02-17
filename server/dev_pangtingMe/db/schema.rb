# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20120210010925) do

  create_table "course_catagories", :force => true do |t|
    t.string  "name",     :limit => 20, :null => false
    t.integer "parentId"
  end

  create_table "course_catagories_courses", :force => true do |t|
    t.integer "course_id"
    t.integer "course_catagory_id"
  end

  create_table "courses", :force => true do |t|
    t.string   "courseName", :limit => 50,                                     :null => false
    t.string   "place",      :limit => 100,                                    :null => false
    t.datetime "startTime",                 :default => '2012-02-10 00:39:52'
    t.datetime "endTime"
    t.string   "teacher",    :limit => 20,  :default => "nil_teacher"
    t.text     "reason",                                                       :null => false
    t.integer  "upNum",                     :default => 0
    t.integer  "downNum",                   :default => 0
    t.integer  "day",                                                          :null => false
    t.integer  "school_id",                                                    :null => false
    t.datetime "created_at",                                                   :null => false
    t.datetime "updated_at",                                                   :null => false
  end

  create_table "courses_course_catagories", :force => true do |t|
    t.integer "course_id"
    t.integer "course_catagory_id"
  end

  create_table "progress_comments", :force => true do |t|
    t.integer  "progress_id",                                                :null => false
    t.integer  "timePoint"
    t.string   "comment",     :limit => 150, :default => "nothing here >_<"
    t.datetime "created_at",                                                 :null => false
    t.datetime "updated_at",                                                 :null => false
  end

  create_table "progresses", :force => true do |t|
    t.integer  "width",      :default => 0
    t.integer  "course_id",                 :null => false
    t.datetime "created_at",                :null => false
    t.datetime "updated_at",                :null => false
  end

  create_table "remarks", :force => true do |t|
    t.string   "userName",   :default => "Nil_userName", :null => false
    t.text     "content",                                :null => false
    t.integer  "upNum",      :default => 0
    t.integer  "downNum",    :default => 0
    t.integer  "course_id",                              :null => false
    t.datetime "created_at",                             :null => false
    t.datetime "updated_at",                             :null => false
  end

  create_table "reviews", :force => true do |t|
    t.integer  "course_id",                              :null => false
    t.string   "userName",   :default => "Nil_userName", :null => false
    t.text     "content",    :default => "Nil_content",  :null => false
    t.integer  "upNum",      :default => 0
    t.integer  "downNum",    :default => 0
    t.datetime "created_at",                             :null => false
    t.datetime "updated_at",                             :null => false
  end

  create_table "schools", :force => true do |t|
    t.string   "name",       :limit => 30, :null => false
    t.datetime "created_at",               :null => false
    t.datetime "updated_at",               :null => false
  end

end
