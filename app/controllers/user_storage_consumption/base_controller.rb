class UserStorageConsumption::BaseController < ApplicationController
  include ActionView::Helpers::NumberHelper

  before_action :admin_required

  private

  def assign_pagination_data(scope)
    @page = scope.current_page
    @per_page = scope.limit_value
    @total_count = scope.total_count
  end
end
