class RoomsController < ApplicationController
  def index
  end

  def create
    @room = Room.create!
    redirect_to room_path(@room.token)
  end

  def show
    @room = Room.find_by!(token: params[:token])
    @messages = @room.messages.order(created_at: :desc).limit(100).reverse
    
    session[:sender_identifier] ||= SecureRandom.uuid
  end

  def join
    token = params[:token].to_s.upcase.strip
    if token.present? && Room.exists?(token: token)
      redirect_to room_path(token)
    else
      redirect_to root_path, alert: "Sala não encontrada ou código inválido."
    end
  end
end
