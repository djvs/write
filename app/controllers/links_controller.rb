class LinksController < ApplicationController
  def index
    @links = Link.all
    render text: @links.to_json
  end
end
