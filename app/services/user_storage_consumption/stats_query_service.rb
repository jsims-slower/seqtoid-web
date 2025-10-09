module UserStorageConsumption
  class StatsQueryService
    def total_user_count
      User.count
    end

    def total_sample_count
      Sample.count
    end

    def total_input_file_count
      InputFile.count
    end

    def total_input_file_size
      InputFile.sum(:storage_size)
    end

    def total_sample_s3_file_count
      SampleS3File.count
    end

    def total_sample_s3_size
      SampleS3File.sum(:size)
    end

    def snapshots
      UserStorageConsumptionSnapshot.order(snapshot_date: :asc).last(7)
    end

    def snapshot_summary
      {
        total_users: total_user_count,
        total_samples: total_sample_count,
        total_input_files: total_input_file_count,
        total_input_files_size: total_input_file_size,
      }
    end
  end
end
