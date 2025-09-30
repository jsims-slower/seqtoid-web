class CreateUserStorageConsumptionRefreshBatches < ActiveRecord::Migration[7.0]
  def change
    create_table :user_storage_consumption_refresh_batches do |t|
      t.integer :total_jobs, null: false, default: 0
      t.integer :processed_jobs, null: false, default: 0
      t.integer :error_count, null: false, default: 0
      t.string :status, null: false, default: 'pending'
      t.datetime :started_at
      t.datetime :completed_at

      t.timestamps
    end
  end
end
