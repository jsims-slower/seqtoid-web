import React from "react";
import { FlaggedFilesThresholds } from "../../types";
import cs from "./filter_form.scss";

interface FilterFormProps {
  thresholds: FlaggedFilesThresholds;
  actionUrl: string;
}

export const FilterForm: React.FC<FilterFormProps> = ({
  thresholds,
  actionUrl,
}) => {
  const { minSizeMb, olderThanMonths, limit } = thresholds;

  return (
    <form className={cs.filterForm} method="get" action={actionUrl}>
      <div className={cs.filterField}>
        <label htmlFor="min_size_mb">Minimum file size (MB)</label>
        <input
          id="min_size_mb"
          name="min_size_mb"
          type="number"
          min={0}
          step="1"
          defaultValue={Number.isFinite(minSizeMb) ? minSizeMb : 100}
          className={cs.numberInput}
        />
      </div>
      <div className={cs.filterField}>
        <label htmlFor="older_than_months">Older than (months)</label>
        <input
          id="older_than_months"
          name="older_than_months"
          type="number"
          min={0}
          step="1"
          defaultValue={Number.isFinite(olderThanMonths) ? olderThanMonths : 6}
          className={cs.numberInput}
        />
      </div>
      <div className={cs.filterField}>
        <label htmlFor="limit">Max results</label>
        <input
          id="limit"
          name="limit"
          type="number"
          min={1}
          step="1"
          defaultValue={Number.isFinite(limit) ? limit : 100}
          className={cs.numberInput}
        />
      </div>
      <button type="submit" className={cs.applyButton}>
        Apply filters
      </button>
    </form>
  );
};

export default FilterForm;
