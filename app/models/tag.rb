class Tag < ActiveRecord::Base
#  attr_accessible :parent_id, :parent_type, :tag, :user_id
  belongs_to :parent, :polymorphic => true
  belongs_to :poster, :class_name => "User", :foreign_key => "user_id"
end
