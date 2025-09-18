class UserStorageConsumptionQueryService
  def total_data
    {
      total_users: User.count,
      total_samples: Sample.count,
      total_input_files: InputFile.count,
      total_input_files_size: InputFile.sum(:storage_size),
    }
  end

  def user_stats(user_id)
    total_samples = Sample.where(user_id: user_id).count

    total_input_files, total_input_files_size = InputFile
                                                .joins(:sample)
                                                .where(samples: { user_id: user_id })
                                                .pick(
                                                  Arel.sql("COUNT(*)"),
                                                  Arel.sql("COALESCE(SUM(storage_size), 0)")
                                                ) || [0, 0]

    {
      total_samples: total_samples,
      total_input_files: total_input_files,
      total_input_files_size: total_input_files_size,
    }
  end

  def paginated_users(query, page)
    User
      .search_by(query)
      .left_joins(samples: :input_files)
      .select(
        "users.*",
        "COUNT(DISTINCT samples.id) AS samples_count",
        "COUNT(DISTINCT input_files.id) AS input_files_count",
        "COALESCE(SUM(input_files.storage_size), 0) AS total_input_files_size"
      )
      .group("users.id")
      .order(id: :desc)
      .page(page)
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
end
