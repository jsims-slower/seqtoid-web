FactoryBot.define do
  factory :user_storage_consumption_refresh_batch do
    total_jobs { 10 }
    processed_jobs { 0 }
    error_count { 0 }
    status { 'pending' }
    started_at { nil }
    completed_at { nil }
  end
end
