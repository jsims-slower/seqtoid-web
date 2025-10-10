module UserStorageConsumption
  class PipelineRunsQueryService
    SORTABLE_COLUMNS = Set[
      "time_to_finalized",
      "executed_at",
      "job_status",
      "technology",
      "wdl_version",
      "deprecated",
    ].freeze

    def paginated_pipeline_runs(page:, sort_by: nil, sort_dir: nil)
      scope = PipelineRun
              .left_joins(sample: [:project, :user])
              .select(
                "pipeline_runs.*",
                "samples.name AS sample_name",
                "projects.id AS project_id",
                "projects.name AS project_name",
                "users.id AS user_id",
                "users.name AS user_name",
                "users.email AS user_email"
              )

      scope = apply_sort(scope, sort_by, sort_dir)
      scope.page(page)
    end

    def pipeline_runs_summary
      row = PipelineRun.pick(
        Arel.sql("COUNT(*) AS total_runs"),
        Arel.sql("COALESCE(SUM(time_to_finalized), 0) / NULLIF(COUNT(*), 0) AS average_runtime_seconds"),
        Arel.sql("COALESCE(MAX(time_to_finalized), 0) AS slowest_runtime_seconds"),
        Arel.sql("SUM(CASE WHEN deprecated THEN 1 ELSE 0 END) AS total_deprecated")
      )

      {
        total_runs: row[0].to_i,
        average_runtime_seconds: row[1].to_f,
        slowest_runtime_seconds: row[2].to_f,
        total_deprecated: row[3].to_i,
      }
    end

    def average_pipeline_runtime_seconds
      total, count = PipelineRun.pick(
        Arel.sql("COALESCE(SUM(time_to_finalized), 0)"),
        Arel.sql("COUNT(*)")
      ) || [0, 0]

      count.to_i.zero? ? 0 : total.to_f / count.to_i
    end

    private

    def apply_sort(scope, sort_by, sort_dir)
      if SORTABLE_COLUMNS.include?(sort_by)
        direction = sort_dir == "asc" ? "ASC" : "DESC"
        scope.order("#{scope.klass.table_name}.#{sort_by} #{direction}")
      else
        scope.order("#{scope.klass.table_name}.id DESC")
      end
    end
  end
end
