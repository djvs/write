class Sub < ActiveRecord::Base
  paginates_per 10
  has_ancestry
  belongs_to :user
  has_many :comments, :as => :subject #weird name for the relation bcuz of ancestry
  has_many :tags, :as => :parent
#  attr_accessible :ancestry, :body, :name, :user_id

  def safeurl
    "/poem/" + self.id.to_s
  end

  def safename
    if name.to_s == ""
      "(no name)"
    else
      name
    end
  end

  def safemetadesc
    ActionController::Base.helpers.strip_tags(self.body.to_s).gsub(/[^\r\na-zA-Z0-9_,.\!\@\#\$\%\^\&\*\(\)' -]/,"")[0..165] + "..."
  end
  
  def sanitizedname
    self.safename.to_s.gsub(/[^a-zA-Z0-9_,.\!\@\#\$\%\^\&\*\(\)' -]/,"")
  end

  def as_json(opts) 
    obj = {
        id: id,
        name: name,
        safename: safename,
        safeurl: safeurl,
        body: body,
        tags: self.tags.map{|x|x.as_json},
        user_id: user_id,
        created_at: created_at,
        updated_at: updated_at,
        classname: "Comment",
        commentcount: comments.count
    }
    if opts.include?("comments")
      puts "YEAH ITS INCLUDING THE COMMENTS"
      obj[:comments] = comments.where(:ancestry => nil).map{|x| x.as_json("") }
    end
    if opts.include?("user")
      obj[:user] = user.as_json("")
    end
    obj
  end

end
