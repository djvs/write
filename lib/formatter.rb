#require 'rubygems'
#require 'sanitize'
class Formatter
  def self.format(str)
    str.gsub!(/<object[^>]*>/,'')
    str.gsub!(/<\/object>/,'')
    str.gsub!(/<iframe[^>]*youtube.com[^">]*list=([^">]*)[^>]*><.iframe>/,  '%%%YTPL%%\1%%')
    str.gsub!(/<iframe[^>]*youtube.com\/embed.([-_a-zA-Z0-9]{11})[^>]*><.iframe>/,  '%%%YT%%\1%%')
    str.gsub!(/<embed [^>]*src=.http:\/\/www.youtube.com\/v\/([-_a-zA-Z0-9]{11})[^>]*>/, '%%%YT%%\1%%')
    str.gsub!(/<iframe [^>]*src=.http:\/\/player.vimeo.com\/video\/([0-9]*)[^>]*><\/iframe>/, '%%%VM%%\1%%')
    str.gsub!(/<iframe [^>]*src=.http:\/\/blip.tv\/play\/([-_a-zA-Z0-9]*)\.html[^>]*>/, '%%%BLP%%\1%%')

    str = Sanitize.clean(str,
    :elements => ['p','a','img','blockquote','strong','em','span','strike','sub','super','table','caption','tstr','tr','th','td','br'],
    :attributes => {
      :all => ['style','align','border','alt','title','width','height'],
      'table' => ['cellpadding','cellspacing','summary'],
      'a' => ['href','target'],
      'img' => ['src']
    },
    :protocols => {:all => 
			{'href' => ['http','https','mailto']
			}
		  }
    )


    str.gsub!(/%%%YTPL%%([^%]*)%%/,'<iframe width="560" height="315" src="http://www.youtube.com/embed/videoseries?list=\1" frameborder="0" allowfullscreen></iframe>')
    str.gsub!(/%%%YT%%([^%]*)%%/,'<iframe width="560" height="315" src="http://www.youtube.com/embed/\1" frameborder="0" allowfullscreen></iframe>')
    str.gsub!(/%%%VM%%([^%]*)%%/,'<iframe src="http://player.vimeo.com/video/\1?color=ff9933" width="400" height="225" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>')
    str.gsub!(/%%%BLP%%([^%]*)%%/,'<iframe src="http://blip.tv/play/\1.html?p=1" width="550" height="339" frameborder="0" allowfullscreen></iframe><embed type="application/x-shockwave-flash" src="http://a.blip.tv/api.swf?#\1" style="display:none"></embed>')
    return str.html_safe
	


 
  end
end
