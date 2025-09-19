module UserStorageConsumption
  class DashboardController < BaseController
    include FlaggedFilesDefaults

    # GET /user_storage_consumption
    def index
      assign_query_params
      assign_stats_data
      assign_flagged_files_data

      users = query_service.paginated_users(query: @search_by, page: params[:page], sort_by: @sort_by, sort_dir: @sort_dir)
      @users_data = format_users_for_index(users)

      assign_pagination_data(users)
    end

    private

    def assign_query_params
      @search_by = params[:search_by].presence
      @sort_by = params[:sort_by].presence
      @sort_dir = params[:sort_dir].presence
    end

    def assign_stats_data
      consumption_stats = query_service.consumption_stats
      @total_users = consumption_stats[:total_users]
      @total_samples = consumption_stats[:total_samples]
      @total_input_files = consumption_stats[:total_input_files]
      @total_input_files_size = number_to_human_size(consumption_stats[:total_input_files_size])
      @average_file_size = number_to_human_size(consumption_stats[:average_size])
      @average_files_per_user = format('%.2f', consumption_stats[:average_files_per_user])
      @snapshot_data = format_snapshot_data(query_service.snapshots)
    end

    def assign_flagged_files_data
      min_size_bytes = (DEFAULT_MIN_SIZE_MB.to_f * 1.megabyte).to_i
      older_than_timestamp = DEFAULT_OLDER_THAN_MONTHS.months.ago

      @flagged_files_count = query_service.flagged_files_count(min_size_bytes, older_than_timestamp)
    end

    def format_users_for_index(users)
      users.map do |u|
        {
          id: u.id,
          email: u.email,
          name: u.name,
          sampleCount: u.attributes["samples_count"].to_i,
          inputFileCount: u.attributes["input_files_count"].to_i,
          totalInputFilesSize: number_to_human_size(u.attributes["total_input_files_size"].to_i),
        }
      end
    end

    def format_snapshot_data(snapshots)
      snapshots.map do |s|
        {
          snapshotDate: s.snapshot_date.strftime("%y-%m-%d"),
          totalUsers: s.total_users,
          totalSamples: s.total_samples,
          totalInputFiles: s.total_input_files,
          totalInputFilesSize: s.total_input_files_size,
        }
      end
    end
  end
end
