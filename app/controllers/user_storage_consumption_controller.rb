class UserStorageConsumptionController < ApplicationController
  before_action :admin_required
  before_action :set_user, only: :show

  # GET /user_storage_consumption
  def index
    users_scope = User.then { |rel| filter_by_search(rel, params[:search_by]) }
    paginated_users = paginated_users_with_stats(users_scope)

    @search_by = params[:search_by].presence
    @users_data = format_users_for_index(paginated_users)
    @total_users = users_scope.count
    @total_samples = Sample.count
    @total_input_files = InputFile.count
    @total_input_files_size = InputFile.sum(:storage_size)

    set_pagination_data(paginated_users)
  end

  # GET /user_storage_consumption/:id
  def show
    @user_details = format_user_for_show
    @sample_file_rows = format_sample_file_rows(paginated_samples)

    set_pagination_data(paginated_samples)
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def filter_by_search(scope, raw_query)
    q = raw_query.to_s.strip
    return scope if q.blank?

    like = "%#{ActiveRecord::Base.sanitize_sql_like(q)}%"

    if q.match?(/\A\d+\z/)
      scope.where('users.email ILIKE :like OR users.id = :id', like: like, id: q.to_i)
    else
      scope.where('users.email ILIKE :like', like: like)
    end
  end

  def paginated_users_with_stats(scope)
    scope
      .left_joins(samples: :input_files)
      .select(
        'users.*',
        'COUNT(DISTINCT samples.id) AS samples_count',
        'COUNT(DISTINCT input_files.id) AS input_files_count',
        'COALESCE(SUM(input_files.storage_size), 0) AS total_input_files_size'
      )
      .group('users.id')
      .order(id: :desc)
      .page(params[:page])
      .per(params[:per_page])
  end

  def format_users_for_index(users)
    users.map do |u|
      {
        id: u.id,
        email: u.email,
        name: u.name,
        sampleCount: u.attributes['samples_count'].to_i,
        inputFileCount: u.attributes['input_files_count'].to_i,
        totalInputFilesSize: u.attributes['total_input_files_size'].to_i,
      }
    end
  end

  def paginated_samples
    @paginated_samples ||= @user
                           .samples
                           .includes(:project, :input_files)
                           .order(created_at: :desc)
                           .page(params[:page])
                           .per(params[:per_page])
  end

  def format_user_for_show
    total_samples = @user.samples.count

    total_input_files, total_input_files_size = InputFile
                                                .joins(:sample)
                                                .where(samples: { user_id: @user.id })
                                                .pick(
                                                  Arel.sql('COUNT(*)'),
                                                  Arel.sql('COALESCE(SUM(storage_size), 0)')
                                                ) || [0, 0]

    {
      id: @user.id,
      email: @user.email,
      name: @user.name,
      totalSamples: total_samples,
      totalInputFiles: total_input_files,
      totalInputFilesSize: total_input_files_size,
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
      sampleCreatedAt: sample.created_at.strftime('%Y-%m-%d'),
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
      fileSize: file&.storage_size,
      sourceType: file&.source_type,
    }
  end

  def set_pagination_data(paginated_scope)
    @page = paginated_scope.current_page
    @per_page = paginated_scope.limit_value
    @total_count = paginated_scope.total_count
  end
end
