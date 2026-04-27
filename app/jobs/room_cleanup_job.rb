class RoomCleanupJob < ApplicationJob
  queue_as :default

  def perform
    Room.where("last_activity_at < ?", 24.hours.ago).destroy_all
  end
end
