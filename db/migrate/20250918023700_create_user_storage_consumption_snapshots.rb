class CreateUserStorageConsumptionSnapshots < ActiveRecord::Migration[7.0]
  def change
    create_table :user_storage_consumption_snapshots do |t|
      t.date :snapshot_date, null: false
      t.integer :total_users, null: false
      t.integer :total_samples, null: false
      t.integer :total_input_files, null: false
      t.bigint :total_input_files_size, null: false

      t.timestamps
    end

    add_index :user_storage_consumption_snapshots, :snapshot_date, unique: true
  end
end
