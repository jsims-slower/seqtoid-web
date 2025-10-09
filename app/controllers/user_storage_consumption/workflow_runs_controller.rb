module UserStorageConsumption
  class WorkflowRunsController < BaseController
    # GET /user_storage_consumption/workflow_runs
    def index
      @sort_by = params[:sort_by].presence
      @sort_dir = params[:sort_dir].presence

      runs_scope = workflow_runs_query_service.paginated_workflow_runs(
        page: params[:page],
        sort_by: @sort_by,
        sort_dir: @sort_dir
      )

      assign_pagination_data(runs_scope)

      @workflow_runs = format_workflow_runs(runs_scope)
      @summary = format_summary(workflow_runs_query_service.workflow_runs_summary)
    end

    private

    def format_workflow_runs(runs)
      runs.map do |run|
        runtime_seconds = run.time_to_finalized
        sample = run.sample
        project = sample&.project
        user = run.user

        {
          id: run.id,
          sampleId: run.sample_id,
          sampleName: sample&.name,
          projectId: project&.id,
          projectName: project&.name,
          userId: user&.id,
          userName: user&.name,
          userEmail: user&.email,
          status: run.status,
          workflow: run.workflow,
          wdlVersion: run.wdl_version,
          deprecated: run.deprecated,
          executedAt: executed_timestamp(run),
          runtimeSeconds: runtime_seconds ? runtime_seconds.to_i : 0,
          runtimeHours: runtime_hours(runtime_seconds),
        }
      end
    end

    def format_summary(summary)
      {
        totalRuns: summary[:total_runs].to_i,
        averageRuntimeSeconds: summary[:average_runtime_seconds].to_f,
        slowestRuntimeSeconds: summary[:slowest_runtime_seconds].to_f,
        totalDeprecated: summary[:total_deprecated].to_i,
      }
    end

    def executed_timestamp(run)
      timestamp = run.executed_at || run.created_at
      format_datetime(timestamp, format: "%Y-%m-%d %H:%M")
    end

    def workflow_runs_query_service
      @workflow_runs_query_service ||= UserStorageConsumption::WorkflowRunsQueryService.new
    end
  end
end
