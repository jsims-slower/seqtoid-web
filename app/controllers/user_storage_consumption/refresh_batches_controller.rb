module UserStorageConsumption
  class RefreshBatchesController < BaseController
    # GET /user_storage_consumption/refresh_batch
    def show
      batch = latest_batch
      render json: { batch: batch ? serialize_batch(batch) : nil }
    end

    # POST /user_storage_consumption/refresh_batch
    def create
      batch = RefreshBatchEnqueuer.call
      render json: { batch: serialize_batch(batch) }, status: :created
    rescue RefreshBatchEnqueuer::BatchInProgressError => e
      render json: { error: e.message }, status: :unprocessable_entity
    rescue RefreshBatchEnqueuer::EnqueueError => e
      render json: { error: e.message }, status: :internal_server_error
    end

    private

    def latest_batch
      UserStorageConsumptionRefreshBatch.order(created_at: :desc).first
    end

    def serialize_batch(batch)
      {
        id: batch.id,
        status: batch.status,
        totalJobs: batch.total_jobs,
        processedJobs: batch.processed_jobs,
        errorCount: batch.error_count,
        startedAt: format_datetime(batch.started_at),
        completedAt: format_datetime(batch.completed_at),
        createdAt: format_datetime(batch.created_at),
        updatedAt: format_datetime(batch.updated_at),
      }
    end
  end
end
