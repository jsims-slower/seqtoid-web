class UpdateInputFileStorageSizeJob
  extend InstrumentedJob

  @queue = :update_storage_size

  def self.perform(input_file_id)
    input_file = InputFile.find(input_file_id)

    begin
      bucket, key = S3Util.parse_s3_path(input_file.s3_path)
      file_size = S3Util.get_file_size(bucket, key)
      input_file.update(storage_size: file_size)
    rescue StandardError => e
      LogUtil.log_error(
        "UpdateInputFileStorageSizeJob: Failed to update storage_size for InputFile #{input_file_id}: #{e.message}",
        exception: e,
        input_file_id: input_file_id
      )
      raise
    end
  end
end
