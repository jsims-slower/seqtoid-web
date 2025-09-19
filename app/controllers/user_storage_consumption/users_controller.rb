class UserStorageConsumption::UsersController < UserStorageConsumption::BaseController
  before_action :set_user

  # GET /user_storage_consumption/users/:id
  def show
    stats = query_service.user_stats(@user.id)
    @user_details = format_user_for_show(@user, stats)

    samples = query_service.paginated_samples(@user, params[:page])
    @sample_file_rows = format_sample_file_rows(samples)

    assign_pagination_data(samples)
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def query_service
    @query_service ||= UserStorageConsumptionQueryService.new
  end

  def format_user_for_show(user, stats)
    {
      id: user.id,
      email: user.email,
      name: user.name,
      totalSamples: stats[:total_samples],
      totalInputFiles: stats[:total_input_files],
      totalInputFilesSize: number_to_human_size(stats[:total_input_files_size]),
    }
  end

  def format_sample_file_rows(samples)
    samples.flat_map { |sample| format_files_for_sample(sample) }
  end

  def format_files_for_sample(sample)
    base_data = {
      sampleId: sample.id,
      sampleName: sample.name.to_s,
      projectName: sample.project&.name.to_s,
      sampleCreatedAt: sample.created_at.strftime("%Y-%m-%d"),
    }

    if sample.input_files.any?
      sample.input_files.map { |file| base_data.merge(format_file_data(file)) }
    else
      [base_data.merge(format_file_data(nil))]
    end
  end

  def format_file_data(file)
    {
      fileId: file&.id,
      fileName: file&.name,
      fileType: file&.file_type,
      fileSize: file&.storage_size ? number_to_human_size(file.storage_size) : nil,
      sourceType: file&.source_type,
    }
  end
end
