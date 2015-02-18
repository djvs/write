class Chatroom < ActiveRecord::Base
#  attr_accessible :name, :current_users
  has_many :chats
  has_many :attendings
  has_many :users, :through => :attendings

  validates_uniqueness_of :name

  def url
    "/chat/" + self.id.to_s
  end  

  def as_json(opts)
      {
        id: id,
        name: name,
        created_at: created_at,
        updated_at: updated_at,
        current_users: current_users,
        attendings: self.attendings.map{|x|x.as_json({})},
        users: self.attendings.map{|x|x.user}.flatten.map{|x|x.as_json({})},
        chats: chats.map{|x|x.as_json({})}
      }
  end 
end
