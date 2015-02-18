class Comment < ActiveRecord::Base
  has_ancestry
  belongs_to :subject, :polymorphic => true
  belongs_to :poster, :class_name => "User", :foreign_key => "user_id"
#  attr_accessible :body, :name, :sub_id, :user_id

  def sanitizedname
    self.safename.to_s.gsub(/[^a-zA-Z0-9_,.\!\@\#\$\%\^\&\*\(\)' -]/,"")
  end

  def safename
    if self.name == nil
      "(no name)"
    else
      self.name
    end
  end

  def as_json(opts)
    {   id: id,
        created_at: created_at,
        updated_at: updated_at,
        postername: poster.safename,
        poster_id: poster.id,
        poster_type: poster.class.name,
        subject_id: subject_id,
        subject_type: subject_type,
        poster: poster.as_json(""),
        name: name,
        body: body,
        classname: "Comment",
        children: self.children.map{ |x| x.as_json("") }
    }
  end

end
