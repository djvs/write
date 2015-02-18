class PartialController < ApplicationController
  def partial
    if ["profile","poemform","headerboxes"].include?(params[:partial])
      render params[:partial], :layout => false
    else
      render text: "No such partial.".to_json
    end
  end
end
