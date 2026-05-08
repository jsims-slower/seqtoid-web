Rails.logger.info "[BOOT] Dumping selected ENV vars before Rails loads:"
ENV.each do |key, value|
  Rails.logger.info "#{key}: #{value}"
end
