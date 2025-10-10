module UserStorageConsumption
  class UsersQueryService
    USER_SORTABLE_COLUMNS = Set[
      "samples_count",
      "input_files_count",
      "total_input_files_size",
      "sample_s3_files_count",
      "total_sample_s3_size",
    ].freeze

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

    def user_sample_s3_stats(user_id)
      total_samples = Sample.where(user_id: user_id).count
      stats = SampleS3File
              .joins(:sample)
              .where(samples: { user_id: user_id })
              .pick(
                Arel.sql("COUNT(*)"),
                Arel.sql("COALESCE(SUM(sample_s3_files.size), 0)")
              )

      total_sample_s3_files, total_sample_s3_size = stats || [0, 0]

      {
        total_samples: total_samples,
        total_sample_s3_files: total_sample_s3_files || 0,
        total_sample_s3_size: total_sample_s3_size || 0,
      }
    end

    def paginated_users(page:, sort_by: nil, sort_dir: nil, filters: {})
      scope = users_stats_scope(filters)
              .select(
                "users.*",
                "COALESCE(sample_stats.samples_count, 0) AS samples_count",
                "COALESCE(input_file_stats.input_files_count, 0) AS input_files_count",
                "COALESCE(input_file_stats.total_input_files_size, 0) AS total_input_files_size",
                "COALESCE(sample_s3_stats.sample_s3_files_count, 0) AS sample_s3_files_count",
                "COALESCE(sample_s3_stats.total_sample_s3_size, 0) AS total_sample_s3_size"
              )

      if USER_SORTABLE_COLUMNS.include?(sort_by)
        direction = sort_dir == "asc" ? "ASC" : "DESC"
        scope = scope.order("#{scope.klass.table_name}.#{sort_by} #{direction}")
      else
        scope = scope.order("#{scope.klass.table_name}.id DESC")
      end

      scope.page(page)
    end

    def users_summary
      row = users_stats_scope.pick(
        Arel.sql("COUNT(DISTINCT users.id) AS total_users"),
        Arel.sql("AVG(COALESCE(sample_stats.samples_count, 0)) AS average_samples_per_user"),
        Arel.sql("AVG(COALESCE(input_file_stats.total_input_files_size, 0)) AS average_input_file_size_per_user"),
        Arel.sql("AVG(COALESCE(sample_s3_stats.total_sample_s3_size, 0)) AS average_sample_s3_size_per_user")
      )

      total_users, average_samples_per_user, average_input_file_size_per_user, average_sample_s3_size_per_user =
        row || [0, 0.0, 0.0, 0.0]

      {
        total_users: total_users.to_i,
        average_samples_per_user: average_samples_per_user.to_f,
        average_input_file_size_per_user: average_input_file_size_per_user.to_f,
        average_sample_s3_size_per_user: average_sample_s3_size_per_user.to_f,
      }
    end

    def paginated_samples(user, page)
      user
        .samples
        .includes(:project, :input_files)
        .order(created_at: :desc)
        .page(page)
    end

    def paginated_sample_s3_files(user, page)
      user
        .samples
        .includes(:project, :sample_s3_files)
        .order(created_at: :desc)
        .page(page)
    end

    private

    def users_stats_scope(filters = {})
      samples_join = <<~SQL
        LEFT JOIN (
          SELECT
            samples.user_id AS user_id,
            COUNT(samples.id) AS samples_count
          FROM samples
          GROUP BY samples.user_id
        ) sample_stats ON sample_stats.user_id = users.id
      SQL

      input_files_join = <<~SQL
        LEFT JOIN (
          SELECT
            samples.user_id AS user_id,
            COUNT(input_files.id) AS input_files_count,
            COALESCE(SUM(input_files.storage_size), 0) AS total_input_files_size
          FROM input_files
          INNER JOIN samples ON samples.id = input_files.sample_id
          GROUP BY samples.user_id
        ) input_file_stats ON input_file_stats.user_id = users.id
      SQL

      sample_s3_join = <<~SQL
        LEFT JOIN (
          SELECT
            samples.user_id AS user_id,
            COUNT(sample_s3_files.id) AS sample_s3_files_count,
            COALESCE(SUM(sample_s3_files.size), 0) AS total_sample_s3_size
          FROM sample_s3_files
          INNER JOIN samples ON samples.id = sample_s3_files.sample_id
          GROUP BY samples.user_id
        ) sample_s3_stats ON sample_s3_stats.user_id = users.id
      SQL

      keyword = filters[:keyword]

      scope = User
              .search_by(keyword)
              .joins(samples_join)
              .joins(input_files_join)
              .joins(sample_s3_join)

      if filters[:min_samples].present?
        scope = scope.where(
          "COALESCE(sample_stats.samples_count, 0) >= ?",
          filters[:min_samples]
        )
      end

      if filters[:min_input_files].present?
        scope = scope.where(
          "COALESCE(input_file_stats.input_files_count, 0) >= ?",
          filters[:min_input_files]
        )
      end

      if filters[:min_total_input_files_size_bytes].present?
        scope = scope.where(
          "COALESCE(input_file_stats.total_input_files_size, 0) >= ?",
          filters[:min_total_input_files_size_bytes]
        )
      end

      if filters[:min_sample_s3_files].present?
        scope = scope.where(
          "COALESCE(sample_s3_stats.sample_s3_files_count, 0) >= ?",
          filters[:min_sample_s3_files]
        )
      end

      if filters[:min_total_sample_s3_size_bytes].present?
        scope = scope.where(
          "COALESCE(sample_s3_stats.total_sample_s3_size, 0) >= ?",
          filters[:min_total_sample_s3_size_bytes]
        )
      end

      scope
    end
  end
end
