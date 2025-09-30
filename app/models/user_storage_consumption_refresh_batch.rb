class UserStorageConsumptionRefreshBatch < ApplicationRecord
  STATUSES = {
    pending: "pending",
    in_progress: "in_progress",
    completed: "completed",
    failed: "failed",
  }.freeze

  PROCESSING_STATUSES = [:pending, :in_progress].freeze

  enum status: STATUSES

  validates :total_jobs, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :processed_jobs, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :error_count, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :status, presence: true

  scope :processing, -> { where(status: PROCESSING_STATUSES) }

  def processing?
    status.in?(PROCESSING_STATUSES.map(&:to_s))
  end
end
