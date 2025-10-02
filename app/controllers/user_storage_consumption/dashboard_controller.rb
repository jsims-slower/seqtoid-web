module UserStorageConsumption
  class DashboardController < BaseController
    include FlaggedFilesDefaults

    # GET /user_storage_consumption
    def index
      assign_stats_data
      assign_flagged_files_data
    end

    private

    def assign_stats_data
      consumption_stats = query_service.consumption_stats
      @total_users = consumption_stats[:total_users]
      @total_samples = consumption_stats[:total_samples]
      @total_input_files = consumption_stats[:total_input_files]
      @total_input_files_size = number_to_human_size(consumption_stats[:total_input_files_size])
      @total_sample_s3_files = consumption_stats[:total_s3_files]
      @total_sample_s3_storage_size = number_to_human_size(consumption_stats[:total_s3_files_size])
      @snapshot_data = format_snapshot_data(query_service.snapshots)
    end

    def assign_flagged_files_data
      min_size_bytes = (DEFAULT_MIN_SIZE_MB.to_f * 1.megabyte).to_i
      older_than_timestamp = DEFAULT_OLDER_THAN_MONTHS.months.ago

      @flagged_files_count = query_service.flagged_files_count(min_size_bytes, older_than_timestamp)
    end

    def format_snapshot_data(snapshots)
      snapshots.map do |s|
        {
          snapshotDate: s.snapshot_date.strftime("%m-%d"),
          totalUsers: s.total_users,
          totalSamples: s.total_samples,
          totalInputFiles: s.total_input_files,
          totalInputFilesSize: s.total_input_files_size,
        }
      end
    end
  end
end
