class Attending < ActiveRecord::Base
#  attr_accessible :chatroom_id, :user_id
  belongs_to :user
  belongs_to :chatroom


  def as_json(opts)
    {
        id: id,
        user: user.as_json(""),
        chatroom_id: chatroom_id,
        created_at: created_at,
        updated_at: updated_at
    }
  end
end
