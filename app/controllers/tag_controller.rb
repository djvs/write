class TagController < ApplicationController
  before_filter :authenticate_user!, :only => [:save]  

  def save
    Tag.where(:user_id => current_user.id, :parent_type => params[:type], :parent_id => params[:id]).delete_all

    array = params[:tags].to_s.gsub(/[^a-zA-Z0-9._ ~,-]/,"").split(",").map{|x|x.strip}.uniq
    
    if array != []
      array.each do |t|
        Tag.create(:parent_id => params[:id],
                   :parent_type => params[:type],
                   :user_id => current_user.id,
                   :tag => t)
      end
    end

    if ["Sub","User"].include?(params[:type])
      myclass = params[:type].safe_constantize
      @parent = myclass.find(params[:id])
      render :text => @parent.tags.map{|x|[x.as_json]}.to_json
    else
      render :text => "what u think u doing punk?"
    end
  end

  def get 
    puts Tag.where(:user_id => current_user.id, :parent_type => params[:type], :parent_id => params[:id]).all.inspect
    render text: Tag.where(:user_id => current_user.id, :parent_type => params[:type], :parent_id => params[:id]).map{|x|x.tag}.join(", ")
  end
 
  def index
    @cloud = Tag.all.group_by{|x|x.tag}.map{|k,v|[k,v.count]}.sort_by{ |x| x[1] }.reverse
    render text: @cloud.to_json
  end

  def show
    @subs = Kaminari.paginate_array(Tag.includes(:parent).where(:tag => params[:tag], :parent_type => "Sub").map{|x|x.parent}).page(params[:page]).per(100)
    @users = Kaminari.paginate_array( Tag.includes(:parent).where(:tag => params[:tag], :parent_type => "User").map{|x|x.parent}).page(params[:page]).per(100)
    render text: { subs: @subs.map{|x|x.as_json("user")}, users: @users.map{|x|x.as_json("")} }.to_json
  end
 
  def subs
    @subs = Kaminari.paginate_array(Tag.includes(:parent).where(:tag => params[:tag], :parent_type => "Sub").map{|x|x.parent}).page(params[:page]).per(100)
    render text: @subs.map{|x|x.as_json("")}.to_json
  end

  def users
    @users = Kaminari.paginate_array( Tag.includes(:parent).where(:tag => params[:tag], :parent_type => "User").map{|x|x.parent}).page(params[:page]).per(100)
    render text: @users.map{|x|x.as_json("")}.to_json
  end
end
