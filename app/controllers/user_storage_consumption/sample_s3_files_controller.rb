module UserStorageConsumption
  class SampleS3FilesController < BaseController
    before_action :set_user

    # GET /user_storage_consumption/users/:user_id/sample_s3
    def index
      stats = query_service.user_sample_s3_stats(@user.id)
      @user_details = format_user_for_sample_s3(@user, stats)

      samples = query_service.paginated_sample_s3_files(@user, params[:page])
      @sample_s3_file_rows = format_sample_s3_file_rows(samples)

      assign_pagination_data(samples)
    end

    private

    def set_user
      @user = User.find(params[:user_id])
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
      samples.flat_map { |sample| format_sample_s3_files_for_sample(sample) }
    end

    def format_sample_s3_files_for_sample(sample)
      base_data = {
        sampleId: sample.id,
        sampleName: sample.name.to_s,
        projectName: sample.project&.name.to_s,
        sampleCreatedAt: sample.created_at.strftime("%Y-%m-%d"),
      }

      if sample.sample_s3_files.any?
        sample.sample_s3_files.map { |file| base_data.merge(format_sample_s3_file_data(file)) }
      else
        [base_data.merge(format_sample_s3_file_data(nil))]
      end
    end

    def format_sample_s3_file_data(file)
      {
        displayName: file&.display_name,
        fileSize: file&.size ? number_to_human_size(file.size) : nil,
      }
    end
  end
end
