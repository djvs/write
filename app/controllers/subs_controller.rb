class SubsController < InheritedResources::Base
  before_filter :authenticate_user!, :only => [:edit, :new, :delete]

  def list
    @subs = Sub.includes(:tags).order("created_at DESC")
    render text: @subs.page(params[:page]).per(25).map{|x| x.as_json("user") }.to_json
  end

  def show
    @sub = Sub.includes(:tags,:comments).find(params[:id]) 
    render text: @sub.as_json("comments user").to_json
  end

  def edit
    if params[:id].nil? 
        @sub = Sub.new
        @sub.user = current_user
    else
        @sub = Sub.find(params[:id])
        raise SecurityError if @sub.user != current_user
    end
    @sub.name = params[:name]
    @sub.body = safesanitize(params[:body])
    @sub.save
    render text: @sub.id.to_s
  end

  def subredir
    if request.user_agent.to_s.include?('facebook') or request.remote_ip == "158.222.231.120"
	@sub = Sub.find(params[:id])
        @sub.body = ActionView::Base.full_sanitizer.sanitize(@sub.body)
        render layout: 'fbblank'
    else
        redirect_to "/#/poem/" + params[:id].to_s, status: 303
    end
  end 

=begin
  def new
    @sub = Sub.new
    @sub.name = params[:name]
    @sub.body = safesanitize(params[:body])
    @sub.user_id = current_user.id
    @sub.save

    render text: "Success".to_json
  end
=end


  def delete
    @sub = Sub.find(params[:id])
    raise SecurityError if @sub.user_id != current_user.id
    @sub.destroy
    render text: "Success".to_json
  end

end
