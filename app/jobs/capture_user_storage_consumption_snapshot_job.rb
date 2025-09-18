class CaptureUserStorageConsumptionSnapshotJob
  extend InstrumentedJob

  @queue = :capture_user_storage_consumption_snapshot

  def self.perform
    date = Time.zone.today

    Rails.logger.info("Starting to capture user storage consumption snapshot on #{date.strftime('%Y-%m-%d')}")

    snapshot = UserStorageConsumptionSnapshot.find_or_initialize_by(snapshot_date: date)
    snapshot_data = UserStorageConsumptionQueryService.new.total_data
    snapshot.assign_attributes(
      total_users: snapshot_data[:total_users],
      total_samples: snapshot_data[:total_samples],
      total_input_files: snapshot_data[:total_input_files],
      total_input_files_size: snapshot_data[:total_input_files_size]
    )
    snapshot.save!

    Rails.logger.info("Finished capturing user storage consumption snapshot.")
  rescue StandardError => e
    LogUtil.log_error(
      "Unexpected error encountered during CaptureUserStorageConsumptionSnapshotJob.",
      exception: e
    )
    raise e
  end
end
