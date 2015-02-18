class AddAnonymousToChats < ActiveRecord::Migration
  def change
    add_column :chats, :anonymous, :boolean
  end
end
