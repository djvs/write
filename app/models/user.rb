class User < ActiveRecord::Base
  require 'cgi'
  # Include default devise modules. Others available are:
  # :token_authenticatable, :encryptable, :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  # Setup accessible (or protected) attributes for your model
#  attr_accessible :email, :password, :password_confirmation, :remember_me, :pic
  # attr_accessible :title, :body

  has_attached_file :pic, 
    :styles => { :medium => '800x800>', :thumb => '120x120>', :mini => '60x60>' },
    :url => '/images/users/:id/:style.:extension'
  validates_attachment_content_type :pic, :content_type => %w(image/jpeg image/jpg image/png image/gif image/tiff image/bmp)



  has_many :subs
  has_many :tags, :as => :parent
  has_many :comments, :as => :subject
  has_many :posted_comments, :class_name => "Comment"
  has_many :posted_tags, :class_name => "Tag"
  has_many :chats
  has_many :attendings
  has_many :chatrooms, :through => :attendings

  before_save :permalinkupdate
  before_save :giveMeARandomColorForChat


  def as_json_lite(opts)
    as_json(opts) 
  end

  def as_json(opts)
    obj = {
        id: id,
        safename: safename,
        safeurl: safeurl,
        thumb: pic.url("thumb"),
        pic: pic.url(),
        bio: bio.to_s,
        username: username.to_s,
        classname: "User"
    }
    if opts.include?("tags")
      obj['tags'] = tags.where(:parent_id => id).map{|x|[x.as_json]}
    end
    if opts.include?("email")
      obj['email'] = email
    end
    if opts.include?("comments")
      obj['comments'] = comments.where(:ancestry => nil).map{|x|x.subtree.arrange_serializable}
      obj['commentcount'] = comments.count
    end
    obj
  end

  def avatarthumb # for forem
    self.pic.url("thumb")
  end

  def giveMeARandomColorForChat
    require 'colors'
    self.color = Colors.to_a.sample.last
  end

  def permalinkupdate
    unless (self.username == nil or self.username == "" or self.permalink.to_s != "")
      self.permalink = testpermalink(self.username.gsub(/[^a-zA-Z0-9]/,""),nil)
    end
  end
 
  def testpermalink(permalink,extra)
    if extra == nil 
      if User.where(:permalink => permalink) == []
        permalink
      else
        testpermalink(permalink,1)
      end
    else
      pmtest = permalink + extra.to_s
      if User.where(:permalink => pmtest) == []
        pmtest
      else
        testpermalink(permalink,(extra.to_i + 1))
      end
    end
  end

  def safeurl
    if self.username == nil or self.username == ""
      return "/user/id/" + self.id.to_s
    else
      return "/user/" + self.permalink.to_s
    end
  end

  def safename
    if self.username == nil or self.username == ""
      "(no username)"
    else
       self.username
    end
  end
 
  def to_s
    self.safename
  end
 
end
