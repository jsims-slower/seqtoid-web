class UserStorageConsumption::DashboardController < UserStorageConsumption::BaseController
  before_action :set_query_params

  # GET /user_storage_consumption
  def index
    total_data = query_service.total_data
    @total_users = total_data[:total_users]
    @total_samples = total_data[:total_samples]
    @total_input_files = total_data[:total_input_files]
    @total_input_files_size = number_to_human_size(total_data[:total_input_files_size])

    @snapshot_data = format_snapshot_data(query_service.snapshots)

    users = query_service.paginated_users(query: @search_by, page: params[:page], sort_by: @sort_by, sort_dir: @sort_dir)
    @users_data = format_users_for_index(users)

    assign_pagination_data(users)
  end

  private

  def set_query_params
    @search_by = params[:search_by].presence
    @sort_by = params[:sort_by].presence
    @sort_dir = params[:sort_dir].presence
  end

  def query_service
    @query_service ||= UserStorageConsumptionQueryService.new
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
