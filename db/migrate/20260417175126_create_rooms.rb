class CreateRooms < ActiveRecord::Migration[8.1]
  def change
    create_table :rooms do |t|
      t.string :token
      t.datetime :last_activity_at

      t.timestamps
    end
    add_index :rooms, :token, unique: true
  end
end
