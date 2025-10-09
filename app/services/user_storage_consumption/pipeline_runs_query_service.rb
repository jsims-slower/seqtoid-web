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
      {
        total_runs: PipelineRun.count,
        average_runtime_seconds: average_pipeline_runtime_seconds,
        slowest_runtime_seconds: PipelineRun.maximum(:time_to_finalized)&.to_f || 0.0,
        total_deprecated: PipelineRun.where(deprecated: true).count,
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
