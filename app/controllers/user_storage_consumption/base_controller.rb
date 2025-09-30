module UserStorageConsumption
  class BaseController < ApplicationController
    include ActionView::Helpers::NumberHelper

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
  end
end
