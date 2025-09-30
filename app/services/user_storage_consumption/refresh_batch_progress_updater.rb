module UserStorageConsumption
  class RefreshBatchProgressUpdater
    include Callable

    def initialize(batch_id, success: true)
      @batch_id = batch_id
      @success = success
    end

    def call
      return unless batch_id

      batch = UserStorageConsumptionRefreshBatch.find_by(id: batch_id)
      return unless batch

      batch.with_lock do
        apply_updates(batch)
        batch.save!
      end
    end

    private

    attr_reader :batch_id, :success

    def apply_updates(batch)
      increment_counters(batch)
      finalize_batch(batch)
    end

    def increment_counters(batch)
      if success
        batch.processed_jobs = batch.processed_jobs + 1
      else
        batch.error_count = batch.error_count + 1
      end
    end

    def finalize_batch(batch)
      return unless batch.processing?
      return unless jobs_complete?(batch)

      batch.status = batch.error_count.positive? ? :failed : :completed
      batch.completed_at ||= Time.zone.now
    end

    def jobs_complete?(batch)
      (batch.processed_jobs + batch.error_count) >= batch.total_jobs
    end
  end
end
