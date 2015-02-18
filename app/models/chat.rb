class Chat < ActiveRecord::Base
#  attr_accessible :message, :chatroom_id, :user_id
  belongs_to :chatroom
  belongs_to :user


  def as_json(opts)  
    {
        id: id,
        chatroom_id: chatroom_id,
        user: user.as_json(""),
        message: message,
        created_at: created_at,
        updated_at: updated_at
    }
  end
end
