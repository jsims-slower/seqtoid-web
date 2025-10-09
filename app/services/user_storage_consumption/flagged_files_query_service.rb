module UserStorageConsumption
  class FlaggedFilesQueryService
    def flagged_files(min_size_bytes, older_than_timestamp, limit: 100)
      base_flagged_files_scope(min_size_bytes, older_than_timestamp)
        .includes(sample: [:user, :project])
        .order(
          Arel.sql(
            "input_files.storage_size IS NULL, input_files.storage_size DESC, input_files.created_at ASC"
          )
        )
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
end
