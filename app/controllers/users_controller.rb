class UsersController < ApplicationController
  before_filter :authenticate_user!, :only => [:edit]


  def me
    if current_user == nil
      render :text => "false"
    else
      render :text => current_user.as_json("tags email").to_json
    end
  end

  def index
    render text: User.all.reverse.map{|x|x.as_json('index')}.to_json
  end

  def show
    if params[:ursid] != nil
      user = User.includes(:tags).find(params[:ursid])
    elsif params[:ursername] != nil
      user = User.includes(:tags).find_by_permalink(params[:ursername])
    else
      raise SecurityError
    end
    raise SecurityError if user.nil?
    subs = user.subs.order("created_at DESC")

    render text: { user: user.as_json("tags"), subs: subs.map{|x|x.as_json("") } }.to_json
  end

  def subs
    if params[:ursid] != nil
      @user = User.find(params[:ursid])
    elsif params[:ursername] != nil
      @user = User.find_by_permalink(params[:ursername])
    else
      @user = nil
    end

    if @user != nil
      @subs = @user.subs.order("created_at DESC").page params[:page]
    end
    render text: @subs.map{|x|x.as_json("comments")}.to_json
  end

  def edit 
    u = current_user
    if params[:username].to_s != ""
      u.username = params[:username]
    end
    if params[:bio].to_s != ""
      current_user.update_attribute("bio", safesanitize(params[:bio]))
    end
    if params[:pic] != nil
      current_user.pic = params[:pic]
    end
    current_user.save

    render text: current_user.as_json("tags email").to_json
  end

  def login
    u = User.find_by_email(params[:email].downcase)
    if u.valid_password?(params[:password])
      sign_in u
      render text: u.as_json("email").to_json and return
    else
      raise SecurityError
    end
  end

  def logout
    sign_out current_user
    render text: "true"
  end

  def signup
    u = User.new
    u.username = params[:username]
    u.email = params[:email]
    u.password = params[:password]
    u.password_confirmation = params[:password_confirmation]
    u.save
    sign_in u
    render text: u.as_json("email").to_json
  end

  def forgotpw
    u = User.find_by_email(params[:email])
    u.send_reset_password_instructions
    render text: "true"
  end

end
