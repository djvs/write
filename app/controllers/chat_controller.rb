class ChatController < ApplicationController

  def index
    get = Chatroom.all
    render text: get.to_json
  end

  def newroom
    @chatroom = Chatroom.create(:name => params[:name])
    render text: @chatroom.to_json
  end

  def show
    @chatroom = Chatroom.find_by_name(params[:room])
    render text: { chatroom: @chatroom }.to_json 
  end

  def refresh
    @chatroom = Chatroom.find_by_name(params[:room])

    #update user timestamps
    @attending = Attending.where(:user_id => current_user.id, :chatroom_id => @chatroom.id)
    if @attending == []
      @attending = Attending.create(:user_id => current_user.id, :chatroom_id => @chatroom.id)
    else
      @attending.first.touch
    end  

    render text: { chatroom: @chatroom }.to_json
  end
 
  def post
    puts current_user.inspect
    @chat = Chat.new
    if current_user.nil?
        userid = nil
    else
        @chat.user = current_user
        userid = current_user.id
    end
    @chatroom = Chatroom.find_by_name(params[:room])
    @chat.chatroom = @chatroom
    @chat.message = safesanitize(params[:body])
    @chat.save
    @chatroom.touch

    # update user timestamps
    @attending = Attending.where(:user_id => userid, :chatroom_id => @chatroom.id)
    if @attending == []
      @attending = Attending.create(:user_id => userid, :chatroom_id => @chatroom.id)
    else
      @attending.first.touch
    end  

    @chatroom = Chatroom.find_by_name(params[:room])
    render text: "true"
  end

end
