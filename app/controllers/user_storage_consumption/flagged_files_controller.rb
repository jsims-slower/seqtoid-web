class UserStorageConsumption::FlaggedFilesController < UserStorageConsumption::BaseController
  DEFAULT_MIN_SIZE_MB = 100
  DEFAULT_OLDER_THAN_MONTHS = 6
  DEFAULT_LIMIT = 100

  before_action :set_thresholds, only: :index

  # GET /user_storage_consumption/flagged_files
  def index
    min_size_bytes = (@min_size_mb.to_f * 1.megabyte).to_i
    older_than_timestamp = @older_than_months.positive? ? @older_than_months.months.ago : Time.zone.now

    flagged_files = query_service.flagged_files(min_size_bytes, older_than_timestamp, limit: @limit)
    total_flagged_files = query_service.flagged_files_count(min_size_bytes, older_than_timestamp)

    @flagged_files = format_files(flagged_files)
    @summary = build_summary(total_flagged_files)
  end

  private

  def set_thresholds
    @min_size_mb = parse_float_param(params[:min_size_mb], DEFAULT_MIN_SIZE_MB)
    @older_than_months = parse_integer_param(params[:older_than_months], DEFAULT_OLDER_THAN_MONTHS)
    @limit = parse_integer_param(params[:limit], DEFAULT_LIMIT)

    @thresholds = {
      minSizeMb: @min_size_mb,
      olderThanMonths: @older_than_months,
      limit: @limit,
    }
  end

  def format_files(files)
    files.map do |file|
      sample = file.sample
      project = sample.project
      user = sample.user

      {
        id: file.id,
        name: file.name,
        fileType: file.file_type,
        sizeBytes: file.storage_size,
        sizeHuman: file.storage_size ? number_to_human_size(file.storage_size) : nil,
        createdAt: file.created_at.strftime("%Y-%m-%d"),
        sourceType: file.source_type,
        sampleId: sample.id,
        sampleName: sample.name.to_s,
        sampleCreatedAt: sample.created_at.strftime("%Y-%m-%d"),
        projectId: project.id,
        projectName: project.name.to_s,
        userId: user.id,
        userEmail: user.email.to_s,
        userName: user.name.to_s,
      }
    end
  end

  def build_summary(total_flagged_files)
    consumption_stats = query_service.consumption_stats
    total_files = consumption_stats[:total_input_files]
    total_size = consumption_stats[:total_input_files_size]
    average_size = consumption_stats[:average_size]
    average_files_per_user = consumption_stats[:average_files_per_user]

    {
      flaggedCount: total_flagged_files,
      totalFiles: total_files,
      totalFilesSize: number_to_human_size(total_size),
      averageFileSize: number_to_human_size(average_size),
      averageFilesPerUser: format('%.2f', average_files_per_user),
    }
  end
end
