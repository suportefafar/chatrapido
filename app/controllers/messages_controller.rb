class MessagesController < ApplicationController
  def create
    @room = Room.find_by!(token: params[:room_token])
    @message = @room.messages.build(message_params)
    @message.sender_identifier = session[:sender_identifier]

    if @message.save
      head :no_content
    else
      head :unprocessable_entity
    end
  end

  private

  def message_params
    params.require(:message).permit(:content, :file)
  end
end
