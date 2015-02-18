class VideoController < ApplicationController
  def index
    render text: Video.all.map{|x|x.as_json(false)}.to_json
  end

  def new
    video = VideoInfo.new(params[:video])
    if video.provider == "YouTube"
      if current_user
        cuid = current_user.id
      else
        cuid = 0
      end
      newvid = Video.new(:title => video.title, :site_id => video.video_id, :site_name => "youtube", :user_id => cuid, enabled: true).save
    end 
    render text: Video.all.map{|x|x.as_json(false)}.to_json
  end



end
