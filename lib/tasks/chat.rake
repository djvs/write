namespace :chat do
  desc "TODO"
  task :updateAttending => :environment do
    Attending.where("updated_at < ?", Time.now - 20.minutes).delete_all
    Chat.where("updated_at < ?", Time.now - 24.hours).delete_all
    Chatroom.where("updated_at < ?",Time.now - 24.hours).select{|x|x.chats.count == 0 && ['Lounge','Zebra Room'].exclude?(x.name) }.each{|x|x.delete}

#    @new = Attending.all.group_by{|x|x.chatroom_id}
#    puts @new.inspect
#    @new.each do |chatid,attendings|
#      @chatroom = Chatroom.find(chatid)
#      @chatroom.update_attribute(:current_users,attendings.map{|x| x.user_id}.join(","))
#      puts @chatroom.inspect
#    end
    

  end

end
