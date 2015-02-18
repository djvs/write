class ChangeSubjectTypeInComments < ActiveRecord::Migration
  def change
    change_column(:comments, :subject_type, :string, default: "")
  end
end
