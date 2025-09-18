FactoryBot.define do
  factory :user_storage_consumption_snapshot do
    snapshot_date { "2025-09-18" }
    total_users { 1 }
    total_samples { 10 }
    total_input_files { 20 }
    total_input_files_size { 100_000 }
  end
end
