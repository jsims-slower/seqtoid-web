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
      @total_users = stats_query_service.total_user_count
      @total_samples = stats_query_service.total_sample_count

      @total_input_files = stats_query_service.total_input_file_count
      @total_input_files_size = number_to_human_size(stats_query_service.total_input_file_size)

      @total_sample_s3_files = stats_query_service.total_sample_s3_file_count
      @total_sample_s3_storage_size = number_to_human_size(stats_query_service.total_sample_s3_size)

      @average_pipeline_runtime = runtime_hours(pipeline_runs_query_service.average_pipeline_runtime_seconds)
      @average_workflow_runtime = runtime_hours(workflow_runs_query_service.average_workflow_runtime_seconds)
      @snapshot_data = format_snapshot_data(stats_query_service.snapshots)
    end

    def assign_flagged_files_data
      min_size_mb = DEFAULT_MIN_SIZE_MB
      older_than_months = DEFAULT_OLDER_THAN_MONTHS

      min_size_bytes = (min_size_mb.to_f * 1.megabyte).to_i
      older_than_timestamp = older_than_months.months.ago

      @flagged_files_count = flagged_files_query_service.flagged_files_count(min_size_bytes, older_than_timestamp)
      @flagged_files_description = flagged_files_description(min_size_mb, older_than_months)
    end

    def format_snapshot_data(snapshots)
      snapshots.map do |s|
        {
          snapshotDate: format_date(s.snapshot_date, format: "%m-%d"),
          totalUsers: s.total_users,
          totalSamples: s.total_samples,
          totalInputFiles: s.total_input_files,
          totalInputFilesSize: s.total_input_files_size,
        }
      end
    end

    def flagged_files_description(min_size_mb, older_than_months)
      month_label = older_than_months == 1 ? "1 month" : "#{older_than_months} months"
      "files larger than #{min_size_mb} MB and older than #{month_label}"
    end

    def stats_query_service
      @stats_query_service ||= UserStorageConsumption::StatsQueryService.new
    end

    def flagged_files_query_service
      @flagged_files_query_service ||= UserStorageConsumption::FlaggedFilesQueryService.new
    end

    def pipeline_runs_query_service
      @pipeline_runs_query_service ||= UserStorageConsumption::PipelineRunsQueryService.new
    end

    def workflow_runs_query_service
      @workflow_runs_query_service ||= UserStorageConsumption::WorkflowRunsQueryService.new
    end
  end
end
