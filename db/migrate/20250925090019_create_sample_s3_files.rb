class CreateSampleS3Files < ActiveRecord::Migration[7.0]
  def change
    create_table :sample_s3_files do |t|
      t.references :sample, null: false, foreign_key: true
      t.string :key, null: false
      t.string :display_name, null: false
      t.bigint :size, null: false

      t.timestamps
    end

    add_index :sample_s3_files, [:sample_id, :key], unique: true
  end
end
