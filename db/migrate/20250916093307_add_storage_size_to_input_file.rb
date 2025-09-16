class AddStorageSizeToInputFile < ActiveRecord::Migration[7.0]
  def change
    add_column :input_files, :storage_size, :bigint, comment: "Storage size in bytes"
  end
end
