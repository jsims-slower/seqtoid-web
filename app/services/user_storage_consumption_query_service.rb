class UserStorageConsumptionQueryService
  SORTABLE_COLUMNS = Set["samples_count", "input_files_count", "total_input_files_size"].freeze

  def consumption_stats
    total_users = User.count
    total_samples = Sample.count
    total_input_files = InputFile.count
    total_input_files_size = InputFile.sum(:storage_size)
    average_size = total_input_files.positive? ? (total_input_files_size.to_f / total_input_files) : 0
    average_files_per_user = total_users.positive? ? (total_input_files.to_f / total_users) : 0

    {
      total_users: total_users,
      total_samples: total_samples,
      total_input_files: total_input_files,
      total_input_files_size: total_input_files_size,
      average_size: average_size,
      average_files_per_user: average_files_per_user,
    }
  end

  def user_stats(user_id)
    total_samples = Sample.where(user_id: user_id).count
    stats = InputFile
            .joins(:sample)
            .where(samples: { user_id: user_id })
            .pick(
              Arel.sql("COUNT(*)"),
              Arel.sql("COALESCE(SUM(storage_size), 0)")
            )

    total_input_files, total_input_files_size = stats || [0, 0]

    {
      total_samples: total_samples,
      total_input_files: total_input_files,
      total_input_files_size: total_input_files_size,
    }
  end

  def paginated_users(query:, page:, sort_by: nil, sort_dir: nil)
    scope = User
            .search_by(query)
            .left_joins(samples: :input_files)
            .select(
              "users.*",
              "COUNT(DISTINCT samples.id) AS samples_count",
              "COUNT(DISTINCT input_files.id) AS input_files_count",
              "COALESCE(SUM(input_files.storage_size), 0) AS total_input_files_size"
            )
            .group("users.id")

    if SORTABLE_COLUMNS.include?(sort_by)
      direction = sort_dir == "asc" ? "ASC" : "DESC"
      scope = scope.order("#{sort_by} #{direction}")
    else
      scope = scope.order(id: :desc) # Default sort
    end

    scope.page(page)
  end

  def paginated_samples(user, page)
    user
      .samples
      .includes(:project, :input_files)
      .order(created_at: :desc)
      .page(page)
  end

  def snapshots
    UserStorageConsumptionSnapshot.order(snapshot_date: :asc).last(7)
  end

  def flagged_files(min_size_bytes, older_than_timestamp, limit: 100)
    base_flagged_files_scope(min_size_bytes, older_than_timestamp)
      .includes(sample: [:user, :project])
      .order(Arel.sql("input_files.storage_size IS NULL, input_files.storage_size DESC, input_files.created_at ASC"))
      .limit(limit)
  end

  def flagged_files_count(min_size_bytes, older_than_timestamp)
    base_flagged_files_scope(min_size_bytes, older_than_timestamp).count
  end

  def flagged_files_stats(min_size_bytes, older_than_timestamp)
    stats = base_flagged_files_scope(min_size_bytes, older_than_timestamp).pick(
      Arel.sql("COUNT(*)"),
      Arel.sql("COALESCE(SUM(input_files.storage_size), 0)"),
      Arel.sql("COUNT(DISTINCT samples.user_id)"),
      Arel.sql("COUNT(DISTINCT samples.project_id)")
    )

    flagged_count, total_size, users_impacted, projects_impacted = stats || [0, 0, 0, 0]

    {
      flagged_count: flagged_count || 0,
      total_size: total_size || 0,
      users_impacted: users_impacted || 0,
      projects_impacted: projects_impacted || 0,
    }
  end

  private

  def base_flagged_files_scope(min_size_bytes, older_than_timestamp)
    InputFile
      .joins(sample: [:user, :project])
      .where(storage_size: min_size_bytes.., created_at: ..older_than_timestamp)
  end
end
