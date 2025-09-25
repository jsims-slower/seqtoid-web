class SyncSampleS3FilesJob
  extend InstrumentedJob

  @queue = :sync_sample_s3_files

  def self.perform(sample_id)
    sample = Sample.find(sample_id)
    prefix = sample.sample_path
    prefix = prefix.end_with?("/") ? prefix : "#{prefix}/"

    s3_objects = []
    AwsClient[:s3].list_objects_v2(bucket: SAMPLES_BUCKET_NAME, prefix: prefix).each do |resp|
      resp.contents.each do |object|
        next if object.key.end_with?("/")

        display_name = object.key.delete_prefix(prefix)
        display_name = File.basename(object.key) if display_name.blank?

        s3_objects << {
          key: object.key,
          display_name: display_name,
          size: object.size,
        }
      end
    end

    upsert_sample_files(sample, s3_objects)
  rescue ActiveRecord::RecordNotFound => e
    LogUtil.log_error("SyncSampleS3FilesJob: Sample not found", exception: e, sample_id: sample_id)
    raise
  rescue StandardError => e
    LogUtil.log_error("SyncSampleS3FilesJob: Error syncing sample files", exception: e, sample_id: sample_id)
    raise
  end

  def self.upsert_sample_files(sample, files)
    SampleS3File.transaction do
      sample.sample_s3_files.destroy_all

      return if files.blank?

      timestamp = Time.current
      new_records = files.map do |file|
        sample.sample_s3_files.build(
          key: file[:key],
          display_name: file[:display_name],
          size: file[:size],
          created_at: timestamp,
          updated_at: timestamp
        )
      end

      SampleS3File.import(new_records, validate: true, all_or_none: true)
    end
  end
end
