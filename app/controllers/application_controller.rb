class ApplicationController < ActionController::Base
  layout 'blankhtml'
  before_filter :headersetc

  def forem_user
    current_user
  end

  helper_method :forem_user

  protect_from_forgery 

  def headersetc
    response.headers["Cache-Control"] = "no-cache, no-store, max-age=0, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "Fri, 01 Jan 1990 00:00:00 GMT"

  end

  def angular
    render :layout => "angular", :text => ""
  end

  def index
    render :layout => false
  end

  def index2
    @subs = Sub.order("created_at DESC").page params[:page]   
  end

  def safesanitize(str)
    str.gsub!(/<object[^>]*>/,'')
    str.gsub!(/<\/object>/,'')
    str.gsub!(/<iframe[^>]*youtube.com\/embed.([-_a-zA-Z0-9]{11})[^>]*><.iframe>/,  '%%%YT%%\1%%')
    str.gsub!(/<embed [^>]*src=.http:\/\/www.youtube.com\/v\/([-_a-zA-Z0-9]{11})[^>]*>/, '%%%YT%%\1%%')
    str.gsub!(/<iframe [^>]*src=.http:\/\/player.vimeo.com\/video\/([0-9]*)[^>]*><\/iframe>/, '%%%VM%%\1%%')
    str.gsub!(/<iframe [^>]*src=.http:\/\/blip.tv\/play\/([-_a-zA-Z0-9]*)\.html[^>]*>/, '%%%BLP%%\1%%')
    str.gsub!(/<iframe [^>]*src=.http.?:\/\/w.soundcloud.com\/([^"]*)"[^>]*>/, '%%%SNDCLD%%\1%SNDCLD%')


    str = Sanitize.clean(str,
    :elements => ['p','a','img','blockquote','strong','em','span','strike','sub','super','table','caption','tstr','tr','th','td','br','div'],
    :attributes => {
      :all => ['style','align','border','alt','title','width','height'],
      'table' => ['cellpadding','cellspacing','summary'],
      'a' => ['href','target'],
      'img' => ['src']
    },
    :protocols => {:all => {'href' => ['http','https','mailto']}}
	)


    str.gsub!(/%%%YT%%([^%]*)%%/,'<iframe width="560" height="315" src="http://www.youtube.com/embed/\1" frameborder="0" allowfullscreen></iframe>')
    str.gsub!(/%%%VM%%([^%]*)%%/,'<iframe src="http://player.vimeo.com/video/\1?color=ff9933" width="400" height="225" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>')
    str.gsub!(/%%%BLP%%([^%]*)%%/,'<iframe src="http://blip.tv/play/\1.html?p=1" width="550" height="339" frameborder="0" allowfullscreen></iframe><embed type="application/x-shockwave-flash" src="http://a.blip.tv/api.swf?#\1" style="display:none"></embed>')
    str.gsub!(/%%%SNDCLD%%(.*)%SNDCLD%/,'<iframe width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/\1"></iframe>')

    return str
  end

 

  def format(str)
	safesanitize(str)
  end
	
  def after_sign_in_path_for(resource)
    "/home" 
  end
  def after_sign_up_path_for(resource)
    "/home"
  end
  def after_sign_out_path_for(resource)
    "/home"
  end

  def authenticate_admin
    if current_user != nil and (current_user.email == "wordslinger@ymail.com" or current_user.email == "rjq@gmx.com" )
      return true
    else
      raise ActionController::RoutingError.new('Not Found')
    end
  end
end
