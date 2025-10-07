import React from "react";
import cs from "./search_bar.scss";

interface AdvancedFilters {
  keyword?: string;
  minSamples?: number;
  minInputFiles?: number;
  minTotalInputFileSizeMb?: number;
  minSampleS3Files?: number;
  minTotalSampleS3StorageMb?: number;
}

interface SearchBarProps {
  filters?: AdvancedFilters;
}

export const SearchBar: React.FC<SearchBarProps> = ({ filters }) => {
  const formRef = React.useRef<HTMLFormElement>(null);

  const hasAdvancedDefaults = React.useMemo(() => {
    if (!filters) {
      return false;
    }

    return [
      filters.minSamples,
      filters.minInputFiles,
      filters.minTotalInputFileSizeMb,
      filters.minSampleS3Files,
      filters.minTotalSampleS3StorageMb,
    ].some(value => value !== null && value !== undefined);
  }, [filters]);

  const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(
    hasAdvancedDefaults
  );

  React.useEffect(() => {
    if (hasAdvancedDefaults) {
      setShowAdvancedFilters(true);
    }
  }, [hasAdvancedDefaults]);

  const handleClearFilters = React.useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    const filterKeys = [
      "search_by",
      "min_samples",
      "min_input_files",
      "min_total_input_file_size_mb",
      "min_sample_s3_files",
      "min_total_sample_s3_storage_mb",
      "page",
    ];

    filterKeys.forEach((key) => params.delete(key));

    const queryString = params.toString();
    const targetUrl = queryString
      ? `/user_storage_consumption/users?${queryString}`
      : "/user_storage_consumption/users";

    if (formRef.current) {
      formRef.current.reset();
    }

    window.location.href = targetUrl;
  }, []);

  return (
    <form
      action="/user_storage_consumption/users"
      method="get"
      ref={formRef}
      className={cs.searchContainer}
    >
      <div className={cs.searchControls}>
        <div className={cs.searchInputGroup}>
          <input
            type="text"
            name="search_by"
            placeholder="Search by user ID, name, or email"
            defaultValue={filters?.keyword ?? ""}
            className={cs.searchInput}
          />
          <button type="submit" className={cs.searchButton}>
            Search
          </button>
        </div>
        <button
          type="button"
          className={cs.advancedButton}
          onClick={() => setShowAdvancedFilters((prev) => !prev)}
          aria-expanded={showAdvancedFilters}
        >
          {showAdvancedFilters ? "Hide advanced" : "Advanced"}
        </button>
      </div>

      {showAdvancedFilters && (
        <div className={cs.advancedFilters}>
          <div className={cs.filterField}>
            <label htmlFor="min_samples">Total samples ≥</label>
            <input
              id="min_samples"
              name="min_samples"
              type="number"
              min={0}
              step="1"
              defaultValue={filters?.minSamples ?? 0}
              className={cs.numberInput}
            />
          </div>
          <div className={cs.filterField}>
            <label htmlFor="min_input_files">Total input files ≥</label>
            <input
              id="min_input_files"
              name="min_input_files"
              type="number"
              min={0}
              step="1"
              defaultValue={filters?.minInputFiles ?? 0}
              className={cs.numberInput}
            />
          </div>
          <div className={cs.filterField}>
            <label htmlFor="min_total_input_file_size_mb">
              Total input file size ≥ (MB)
            </label>
            <input
              id="min_total_input_file_size_mb"
              name="min_total_input_file_size_mb"
              type="number"
              min={0}
              step="1"
              defaultValue={filters?.minTotalInputFileSizeMb ?? 0}
              className={cs.numberInput}
            />
          </div>
          <div className={cs.filterField}>
            <label htmlFor="min_sample_s3_files">
              Sample S3 files ≥
            </label>
            <input
              id="min_sample_s3_files"
              name="min_sample_s3_files"
              type="number"
              min={0}
              step="1"
              defaultValue={filters?.minSampleS3Files ?? 0}
              className={cs.numberInput}
            />
          </div>
          <div className={cs.filterField}>
            <label htmlFor="min_total_sample_s3_storage_mb">
              Sample S3 storage ≥ (MB)
            </label>
            <input
              id="min_total_sample_s3_storage_mb"
              name="min_total_sample_s3_storage_mb"
              type="number"
              min={0}
              step="1"
              defaultValue={filters?.minTotalSampleS3StorageMb ?? 0}
              className={cs.numberInput}
            />
          </div>
          <div className={cs.actionButtons}>
            <button type="submit" className={cs.applyButton}>
              Apply filters
            </button>
            <button
              type="button"
              className={cs.clearButton}
              onClick={handleClearFilters}
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </form>
  );
};
