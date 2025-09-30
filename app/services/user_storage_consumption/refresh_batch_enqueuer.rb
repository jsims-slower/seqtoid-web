module UserStorageConsumption
  class RefreshBatchEnqueuer
    include Callable

    class BatchInProgressError < StandardError; end
    class EnqueueError < StandardError; end

    def call
      check_processing_batch!

      batch = UserStorageConsumptionRefreshBatch.create!(status: "pending")

      if total_jobs.zero?
        batch.update!(
          total_jobs: 0,
          status: :completed,
          started_at: Time.zone.now,
          completed_at: Time.zone.now
        )
        return batch
      end

      batch.update!(
        total_jobs: total_jobs,
        started_at: Time.zone.now
      )

      enqueue_sample_jobs(batch)
      enqueue_input_file_jobs(batch)

      batch.in_progress!
      batch
    rescue BatchInProgressError
      raise
    rescue StandardError => e
      batch&.update!(status: :failed, completed_at: Time.zone.now)
      raise EnqueueError, e.message
    end

    private

    def check_processing_batch!
      raise BatchInProgressError, "A refresh batch is already in progress" if processing_batch_exists?
    end

    def processing_batch_exists?
      UserStorageConsumptionRefreshBatch.processing.exists?
    end

    def total_jobs
      @total_jobs ||= Sample.count + InputFile.count
    end

    def enqueue_sample_jobs(batch)
      Sample.in_batches(of: 1000, load: false) do |relation|
        relation.pluck(:id).each do |sample_id|
          Resque.enqueue(SyncSampleS3FilesJob, sample_id, batch.id)
        end
      end
    end

    def enqueue_input_file_jobs(batch)
      InputFile.in_batches(of: 1000, load: false) do |relation|
        relation.pluck(:id).each do |input_file_id|
          Resque.enqueue(UpdateInputFileStorageSizeJob, input_file_id, batch.id)
        end
      end
    end
  end
end
