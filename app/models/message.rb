class Message < ApplicationRecord
  belongs_to :room

  has_one_attached :file

  validates :content, length: { maximum: 1000 }
  validates :sender_identifier, presence: true
  validate :content_or_file_present
  validate :file_size_within_limit

  after_create_commit :broadcast_to_room
  after_create_commit :touch_room_activity

  def file_message?
    file.attached?
  end

  private

  def content_or_file_present
    unless content.present? || file.attached?
      errors.add(:base, "Mensagem deve ter conteúdo ou arquivo")
    end
  end

  def file_size_within_limit
    return unless file.attached?

    if file.blob.byte_size > 25.megabytes
      errors.add(:file, "deve ter no máximo 25MB")
    end
  end

  def broadcast_to_room
    broadcast_append_to room, target: "messages"
  end

  def touch_room_activity
    room.update(last_activity_at: Time.current)
  end
end
