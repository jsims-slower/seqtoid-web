module UserStorageConsumption
  class WorkflowRunsQueryService
    SORTABLE_COLUMNS = Set[
      "time_to_finalized",
      "executed_at",
      "status",
      "workflow",
      "wdl_version",
      "deprecated",
    ].freeze

    def paginated_workflow_runs(page:, sort_by: nil, sort_dir: nil)
      scope = WorkflowRun.includes(:user, sample: :project)
      scope = apply_sort(scope, sort_by, sort_dir)
      scope.page(page)
    end

    def workflow_runs_summary
      row = WorkflowRun.pick(
        Arel.sql("COUNT(*) AS total_runs"),
        Arel.sql("COALESCE(SUM(time_to_finalized), 0) / NULLIF(COUNT(*), 0) AS average_runtime_seconds"),
        Arel.sql("COALESCE(MAX(time_to_finalized), 0) AS slowest_runtime_seconds"),
        Arel.sql("SUM(CASE WHEN deprecated THEN 1 ELSE 0 END) AS total_deprecated")
      )

      total_runs, average_runtime_seconds, slowest_runtime_seconds, total_deprecated = row || [0, 0.0, 0.0, 0]

      {
        total_runs: total_runs.to_i,
        average_runtime_seconds: average_runtime_seconds.to_f,
        slowest_runtime_seconds: slowest_runtime_seconds.to_f,
        total_deprecated: total_deprecated.to_i,
      }
    end

    def average_workflow_runtime_seconds
      total, count = WorkflowRun.pick(
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
