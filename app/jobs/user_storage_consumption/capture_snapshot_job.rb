module UserStorageConsumption
  class CaptureSnapshotJob
    extend InstrumentedJob

    @queue = :capture_user_storage_consumption_snapshot

    def self.perform
      date = Time.zone.today

      Rails.logger.info("Starting to capture user storage consumption snapshot on #{date.strftime('%Y-%m-%d')}")

      snapshot = UserStorageConsumptionSnapshot.find_or_initialize_by(snapshot_date: date)
      stats_query_service = UserStorageConsumption::StatsQueryService.new

      snapshot.assign_attributes(stats_query_service.snapshot_summary)
      snapshot.save!

      Rails.logger.info("Finished capturing user storage consumption snapshot.")
    rescue StandardError => e
      LogUtil.log_error(
        "Unexpected error encountered during UserStorageConsumption::CaptureSnapshotJob.",
        exception: e
      )
      raise e
    end
  end
end
