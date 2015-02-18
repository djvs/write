class Video < ActiveRecord::Base
#  attr_accessible :enabled, :site_id, :site_name, :title, :user_id
  def as_json(opts)
    {
        id: self.id.to_s,
        enabled: enabled,
        site_id: site_id,
        site_name: site_name,
        title: title
    }
  end
end
