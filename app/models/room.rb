class Room < ApplicationRecord
  has_many :messages, dependent: :destroy

  validates :token, presence: true, uniqueness: true, length: { is: 6 }, format: { with: /\A[A-Z0-9]+\z/ }

  before_validation :generate_token, on: :create

  private

  def generate_token
    self.token ||= loop do
      random_token = SecureRandom.alphanumeric(6).upcase
      break random_token unless Room.exists?(token: random_token)
    end
    self.last_activity_at ||= Time.current
  end
end
