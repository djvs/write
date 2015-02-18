class AddMerchToUsers < ActiveRecord::Migration
  def change
    add_column :users, :merch, :string
  end
end
