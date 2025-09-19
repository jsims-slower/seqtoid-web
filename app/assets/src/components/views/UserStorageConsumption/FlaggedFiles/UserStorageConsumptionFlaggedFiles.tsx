import React from "react";
import FilterForm from "./components/FilterForm";
import FlaggedFilesTable from "./components/FlaggedFilesTable";
import SummaryTiles from "./components/SummaryTiles";
import {
  FlaggedFile,
  FlaggedFilesSummary,
  FlaggedFilesThresholds,
} from "./types";
import cs from "./user_storage_consumption_flagged_files.scss";

export interface UserStorageConsumptionFlaggedFilesProps {
  flaggedFiles: FlaggedFile[];
  thresholds: FlaggedFilesThresholds;
  summary: FlaggedFilesSummary;
}

export const UserStorageConsumptionFlaggedFiles: React.FC<
  UserStorageConsumptionFlaggedFilesProps
> = ({ flaggedFiles, thresholds, summary }) => {
  const { minSizeMb, olderThanMonths, limit } = thresholds;

  const subtitle = `Files larger than ${minSizeMb} MB or older than ${olderThanMonths} months (top ${limit})`;

  return (
    <div className={cs.wrapper}>
      <div className={cs.header}>
        <a href="/user_storage_consumption" className={cs.backLink}>
          &#129168; Back to dashboard
        </a>
        <h1>Flagged Files</h1>
      </div>

      <SummaryTiles summary={summary} />

      <section className={cs.filterSection}>
        <FilterForm
          thresholds={thresholds}
          actionUrl="/user_storage_consumption/flagged_files"
        />
      </section>

      <FlaggedFilesTable files={flaggedFiles} subtitle={subtitle} />
    </div>
  );
};

export default UserStorageConsumptionFlaggedFiles;
