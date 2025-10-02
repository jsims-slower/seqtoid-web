module UserStorageConsumption
  class UsersController < BaseController
    # GET /user_storage_consumption/users
    def index
      @search_by = params[:search_by].presence
      @sort_by = params[:sort_by].presence
      @sort_dir = params[:sort_dir].presence
      @users_data = format_users_for_index(users)
      assign_pagination_data(users)
    end

    private

    def users
      @users ||= query_service.paginated_users(
        query: @search_by,
        page: params[:page],
        sort_by: @sort_by,
        sort_dir: @sort_dir
      )
    end

    def format_users_for_index(users)
      users.map do |user|
        {
          id: user.id,
          email: user.email,
          name: user.name,
          sampleCount: user.attributes["samples_count"].to_i,
          inputFileCount: user.attributes["input_files_count"].to_i,
          totalInputFilesSize: number_to_human_size(user.attributes["total_input_files_size"].to_i),
          sampleS3FileCount: user.attributes["sample_s3_files_count"].to_i,
          totalSampleS3StorageSize: number_to_human_size(user.attributes["total_sample_s3_size"].to_i),
        }
      end
    end
  end
end
