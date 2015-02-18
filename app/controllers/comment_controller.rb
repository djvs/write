class CommentController < ApplicationController
  before_filter :authenticate_user!

  def comment
	#this code may be confusingly worded.  Ancestry uses parent to refer to the e 
    if ["Sub","User","Comment"].include?(params[:pclass])
      commentee = params[:pclass].dup.constantize.find(params[:pid])
      c = Comment.new
      if params[:pclass] == "Comment"
        puts "???" + commentee.inspect
          c.subject = commentee.subject
          c.parent = commentee
      else 
          c.subject_type = params[:pclass]
          c.subject_id = params[:pid]
      end
      #c.subject.update_attribute(:commentcount, c.subject.commentcount + 1)
      c.poster = current_user
      c.body = safesanitize(params[:comment])
      c.save
      puts " COMMENT POSTED " + c.inspect

      render :text => c.as_json("").to_json and return
    end

    render :text => "Sorry, your comment could not be posted.  Something probably went wrong, or maybe you're just not logged in anymore?" and return
  end    

  def edit
    
  end

  def delete
    comment = Comment.find(params[:id])

    comment.descendants.delete_all

    if current_user.id == comment.poster.id
      comment.destroy
      render :text => "Comment deleted" and return
    else
      render :text => "Comment not deleted.  Are you sure you have permission?" and return
    end 
  end


end
