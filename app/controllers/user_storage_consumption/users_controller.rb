module UserStorageConsumption
  class UsersController < BaseController
    # GET /user_storage_consumption/users
    def index
      @sort_by = params[:sort_by].presence
      @sort_dir = params[:sort_dir].presence
      assign_filter_data
      assign_summary_data
      @users_data = format_users_for_index(users)
      assign_pagination_data(users)
    end

    private

    def assign_summary_data
      summary = users_query_service.users_summary

      @summary_data = {
        totalUsers: summary[:total_users],
        averageSamplesPerUser: summary[:average_samples_per_user],
        averageInputFileSizePerUserBytes: summary[:average_input_file_size_per_user],
        averageSampleS3SizePerUserBytes: summary[:average_sample_s3_size_per_user],
      }
    end

    def users
      @users ||= users_query_service.paginated_users(
        page: params[:page],
        sort_by: @sort_by,
        sort_dir: @sort_dir,
        filters: filters_for_query
      )
    end

    def assign_filter_data
      @filters_for_view = {
        keyword: filter_values[:keyword],
        minSamples: filter_values[:min_samples],
        minInputFiles: filter_values[:min_input_files],
        minTotalInputFileSizeMb: filter_values[:min_total_input_file_size_mb],
        minSampleS3Files: filter_values[:min_sample_s3_files],
        minTotalSampleS3StorageMb: filter_values[:min_total_sample_s3_storage_mb],
      }
    end

    def filter_values
      @filter_values ||= {
        keyword: params[:search_by].presence,
        min_samples: parse_integer_param(params[:min_samples], nil),
        min_input_files: parse_integer_param(params[:min_input_files], nil),
        min_total_input_file_size_mb: parse_float_param(params[:min_total_input_file_size_mb], nil),
        min_sample_s3_files: parse_integer_param(params[:min_sample_s3_files], nil),
        min_total_sample_s3_storage_mb: parse_float_param(params[:min_total_sample_s3_storage_mb], nil),
      }
    end

    def filters_for_query
      @filters_for_query ||= begin
        min_total_input_file_size_bytes = megabytes_to_bytes(
          filter_values[:min_total_input_file_size_mb]
        )
        min_total_sample_s3_size_bytes = megabytes_to_bytes(
          filter_values[:min_total_sample_s3_storage_mb]
        )

        {
          keyword: filter_values[:keyword],
          min_samples: filter_values[:min_samples],
          min_input_files: filter_values[:min_input_files],
          min_total_input_files_size_bytes: min_total_input_file_size_bytes,
          min_sample_s3_files: filter_values[:min_sample_s3_files],
          min_total_sample_s3_size_bytes: min_total_sample_s3_size_bytes,
        }.reject { |_key, value| value.nil? }
      end
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

    def users_query_service
      @users_query_service ||= UserStorageConsumption::UsersQueryService.new
    end
  end
end
