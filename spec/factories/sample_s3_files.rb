FactoryBot.define do
  factory :sample_s3_file do
    association :sample
    sequence(:key) { |n| "samples/1/1/results/output_#{n}.txt" }
    sequence(:display_name) { |n| "output_#{n}.txt" }
    size { 1024 }
  end
end
