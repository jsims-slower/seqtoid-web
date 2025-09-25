class SampleS3File < ApplicationRecord
  belongs_to :sample

  validates :key, presence: true, uniqueness: { scope: :sample_id }
  validates :display_name, presence: true
  validates :size, presence: true, numericality: { greater_than_or_equal_to: 0 }
end
