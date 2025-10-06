module UserStorageConsumption
  class QueryService
    SORTABLE_COLUMNS = Set[
      "samples_count",
      "input_files_count",
      "total_input_files_size",
      "sample_s3_files_count",
      "total_sample_s3_size",
    ].freeze

    def consumption_stats
      total_users = User.count
      total_samples = Sample.count
      total_input_files = InputFile.count
      total_input_files_size = InputFile.sum(:storage_size)
      total_s3_files = SampleS3File.count
      total_s3_files_size = SampleS3File.sum(:size)
      average_workflow_runtime_seconds = average_workflow_runtime

      {
        total_users: total_users,
        total_samples: total_samples,
        total_input_files: total_input_files,
        total_input_files_size: total_input_files_size,
        total_s3_files: total_s3_files,
        total_s3_files_size: total_s3_files_size,
        average_workflow_runtime_seconds: average_workflow_runtime_seconds,
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

      if SORTABLE_COLUMNS.include?(sort_by)
        direction = sort_dir == "asc" ? "ASC" : "DESC"
        scope = scope.order("#{sort_by} #{direction}")
      else
        scope = scope.order(id: :desc) # Default sort
      end

      scope.page(page)
    end

    def users_summary(filters: {})
      scope = users_stats_scope(filters)

      total_users = scope.distinct.count(:id)
      average_samples_per_user =
        scope.average(Arel.sql("COALESCE(sample_stats.samples_count, 0)")) || 0
      average_input_file_size_per_user =
        scope.average(Arel.sql("COALESCE(input_file_stats.total_input_files_size, 0)")) || 0
      average_sample_s3_size_per_user =
        scope.average(Arel.sql("COALESCE(sample_s3_stats.total_sample_s3_size, 0)")) || 0

      {
        total_users: total_users,
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

    def average_workflow_runtime
      pipeline_result = PipelineRun
                        .where(deprecated: false)
                        .where.not(time_to_results_finalized: nil)
                        .select("SUM(time_to_results_finalized) AS total, COUNT(*) AS count")
                        .take

      workflow_result = WorkflowRun
                        .where(deprecated: false)
                        .where.not(time_to_finalized: nil)
                        .select("SUM(time_to_finalized) AS total, COUNT(*) AS count")
                        .take

      total_sum = pipeline_result.total.to_f + workflow_result.total.to_f
      total_count = pipeline_result.count.to_i + workflow_result.count.to_i

      total_count.zero? ? 0 : total_sum / total_count
    end

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
          "COALESCE(sample_stats.samples_count, 0) > ?",
          filters[:min_samples]
        )
      end

      if filters[:min_input_files].present?
        scope = scope.where(
          "COALESCE(input_file_stats.input_files_count, 0) > ?",
          filters[:min_input_files]
        )
      end

      if filters[:min_total_input_files_size_bytes].present?
        scope = scope.where(
          "COALESCE(input_file_stats.total_input_files_size, 0) > ?",
          filters[:min_total_input_files_size_bytes]
        )
      end

      if filters[:min_sample_s3_files].present?
        scope = scope.where(
          "COALESCE(sample_s3_stats.sample_s3_files_count, 0) > ?",
          filters[:min_sample_s3_files]
        )
      end

      if filters[:min_total_sample_s3_size_bytes].present?
        scope = scope.where(
          "COALESCE(sample_s3_stats.total_sample_s3_size, 0) > ?",
          filters[:min_total_sample_s3_size_bytes]
        )
      end

      scope
    end

    def base_flagged_files_scope(min_size_bytes, older_than_timestamp)
      InputFile
        .joins(sample: [:user, :project])
        .where(storage_size: min_size_bytes.., created_at: ..older_than_timestamp)
    end
  end
end
