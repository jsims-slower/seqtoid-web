module UserStorageConsumption
  class SampleS3FilesController < BaseController
    SAMPLE_S3_FILES_CHUNK_SIZE = 10

    before_action :set_user
    before_action :require_sample!, only: :load_more

    # GET /user_storage_consumption/users/:user_id/sample_s3_files
    def index
      stats = query_service.user_sample_s3_stats(@user.id)
      @user_details = format_user_for_sample_s3(@user, stats)

      samples = query_service.paginated_sample_s3_files(@user, params[:page])
      @sample_s3_file_rows = format_sample_s3_file_rows(samples)

      assign_pagination_data(samples)
    end

    # GET /user_storage_consumption/users/:user_id/samples/:sample_id/sample_s3_files/load_more
    def load_more
      page = params[:page].to_i
      page = 1 if page < 1

      files_scope = ordered_sample_s3_files(@sample)
      paginated_files = files_scope.page(page).per(SAMPLE_S3_FILES_CHUNK_SIZE)
      formatted_files = paginated_files.map { |file| format_sample_s3_file_data(file) }

      render json: {
        sampleS3Files: formatted_files,
        nextPage: paginated_files.next_page,
      }
    end

    private

    def set_user
      @user = User.find(params[:user_id])
    end

    def require_sample!
      @sample = @user.samples.find_by(id: params[:sample_id])
      render json: { error: "Sample not found" }, status: :not_found if @sample.blank?
    end

    def format_user_for_sample_s3(user, stats)
      {
        id: user.id,
        email: user.email,
        name: user.name,
        totalSamples: stats[:total_samples],
        totalSampleS3Files: stats[:total_sample_s3_files],
        totalSampleS3Size: number_to_human_size(stats[:total_sample_s3_size]),
      }
    end

    def format_sample_s3_file_rows(samples)
      samples.map { |sample| format_sample_s3_data(sample) }
    end

    def format_sample_s3_data(sample)
      files_scope = ordered_sample_s3_files(sample)
      initial_files = files_scope.page(1).per(SAMPLE_S3_FILES_CHUNK_SIZE)
      formatted_files = initial_files.map { |file| format_sample_s3_file_data(file) }

      {
        sampleId: sample.id,
        sampleName: sample.name,
        projectName: sample.project&.name,
        sampleCreatedAt: sample.created_at.strftime("%Y-%m-%d"),
        totalSampleS3Files: initial_files.total_count,
        totalSampleS3FilesSize: number_to_human_size(files_scope.sum(:size)),
        sampleS3Files: formatted_files,
        nextPage: initial_files.next_page,
      }
    end

    def format_sample_s3_file_data(file)
      {
        displayName: file.display_name,
        fileSize: file.size ? number_to_human_size(file.size) : nil,
      }
    end

    def ordered_sample_s3_files(sample)
      sample.sample_s3_files.order(created_at: :desc)
    end
  end
end
