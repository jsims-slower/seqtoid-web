class UserStorageConsumptionSnapshot < ApplicationRecord
  validates :snapshot_date, presence: true, uniqueness: true
  validates :total_users, presence: true
  validates :total_samples, presence: true
  validates :total_input_files, presence: true
  validates :total_input_files_size, presence: true
end
