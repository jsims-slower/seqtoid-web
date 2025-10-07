module UserStorageConsumption
  class PipelineRunsController < BaseController
    # GET /user_storage_consumption/pipeline_runs
    def index
      @sort_by = params[:sort_by].presence
      @sort_dir = params[:sort_dir].presence

      runs_scope = query_service.paginated_pipeline_runs(
        page: params[:page],
        sort_by: @sort_by,
        sort_dir: @sort_dir
      )

      assign_pagination_data(runs_scope)

      @pipeline_runs = format_pipeline_runs(runs_scope)
      @summary = format_summary(query_service.pipeline_runs_summary)
    end

    private

    def format_pipeline_runs(runs)
      runs.map do |run|
        runtime_seconds = run.time_to_finalized

        {
          id: run.id,
          sampleId: run.sample_id,
          sampleName: run.attributes["sample_name"],
          projectId: run.attributes["project_id"],
          projectName: run.attributes["project_name"],
          userId: run.attributes["user_id"],
          userName: run.attributes["user_name"],
          userEmail: run.attributes["user_email"],
          jobStatus: run.job_status,
          technology: run.technology,
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
  end
end
