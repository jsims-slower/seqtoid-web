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
      {
        total_runs: WorkflowRun.count,
        average_runtime_seconds: average_workflow_runtime_seconds,
        slowest_runtime_seconds: WorkflowRun.maximum(:time_to_finalized)&.to_f || 0.0,
        total_deprecated: WorkflowRun.where(deprecated: true).count,
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
