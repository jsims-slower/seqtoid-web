class UserStorageConsumptionController < ApplicationController
  include ActionView::Helpers::NumberHelper

  before_action :admin_required
  before_action :set_user, only: :show

  # GET /user_storage_consumption
  def index
    @search_by = params[:search_by].presence

    total_data = query_service.total_data
    @total_users = total_data[:total_users]
    @total_samples = total_data[:total_samples]
    @total_input_files = total_data[:total_input_files]
    @total_input_files_size = number_to_human_size(total_data[:total_input_files_size])

    @snapshot_data = format_snapshot_data(query_service.snapshots)

    users = query_service.paginated_users(@search_by, params[:page])
    @users_data = format_users_for_index(users)

    assign_pagination_data(users)
  end

  # GET /user_storage_consumption/:id
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

  def assign_pagination_data(scope)
    @page = scope.current_page
    @per_page = scope.limit_value
    @total_count = scope.total_count
  end
end
