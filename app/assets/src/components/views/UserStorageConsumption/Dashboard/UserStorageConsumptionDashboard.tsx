import React from "react";
import Pagination from "~/components/common/UserStorageConsumption/Pagination";
import cs from "~/components/views/UserStorageConsumption/user_storage_consumption.scss";
import SearchBar from "./components/SearchBar";
import SummaryTiles from "./components/SummaryTiles";
import UsersTable from "./components/UsersTable";
import { UserStorageConsumptionDashboardProps } from "./types";

export const UserStorageConsumptionDashboard: React.FC<
  UserStorageConsumptionDashboardProps
> = ({
  users,
  page,
  totalPages,
  searchBy,
  sortBy,
  sortDir,
  totalUsers,
  totalSamples,
  totalInputFiles,
  totalInputFilesSize,
  totalSampleS3Files,
  totalSampleS3StorageSize,
  flaggedFilesCount,
  snapshotData,
}) => {
  if (!users || users.length === 0) {
    return <div className={cs.emptyState}>No users found.</div>;
  }

  return (
    <div className={cs.wrapper}>
      <h1>User Storage Consumption</h1>

      <SummaryTiles
        totalUsers={totalUsers}
        totalSamples={totalSamples}
        totalInputFiles={totalInputFiles}
        totalInputFilesSize={totalInputFilesSize}
        totalSampleS3Files={totalSampleS3Files}
        totalSampleS3StorageSize={totalSampleS3StorageSize}
        flaggedFilesCount={flaggedFilesCount}
        snapshotData={snapshotData}
      />

      <SearchBar searchBy={searchBy} />

      <UsersTable users={users} sortBy={sortBy} sortDir={sortDir} />

      <Pagination
        page={page}
        totalPages={totalPages}
        baseUrl="/user_storage_consumption"
      />
    </div>
  );
};
