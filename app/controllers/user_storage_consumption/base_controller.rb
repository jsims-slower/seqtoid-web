module UserStorageConsumption
  class BaseController < ApplicationController
    include ActionView::Helpers::NumberHelper

    DEFAULT_DATE_FORMAT = "%Y-%m-%d".freeze
    DEFAULT_DATETIME_FORMAT = "%Y-%m-%d %H:%M:%S".freeze

    before_action :admin_required

    private

    def assign_pagination_data(scope)
      @page = scope.current_page
      @total_pages = scope.total_pages
    end

    def query_service
      @query_service ||= UserStorageConsumption::QueryService.new
    end

    def parse_float_param(value, default)
      return default if value.blank?

      parsed = Float(value)
      parsed >= 0 ? parsed : default
    rescue ArgumentError, TypeError
      default
    end

    def parse_integer_param(value, default)
      return default if value.blank?

      parsed = Integer(value)
      parsed >= 0 ? parsed : default
    rescue ArgumentError, TypeError
      default
    end

    def megabytes_to_bytes(value)
      return if value.blank?

      (value.to_f * 1.megabyte).to_i
    end

    def format_datetime(value, format: DEFAULT_DATETIME_FORMAT)
      format_time(value, format)
    end

    def format_date(value, format: DEFAULT_DATE_FORMAT)
      format_time(value, format)
    end

    def format_time(value, format)
      return if value.blank?

      time = value.respond_to?(:in_time_zone) ? value.in_time_zone : Time.zone.parse(value.to_s)

      time&.strftime(format)
    rescue ArgumentError
      nil
    end

    def runtime_hours(seconds)
      hours = seconds.to_f / 3600
      "#{hours.round(2)} hours"
    end
  end
end
