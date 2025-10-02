import React from "react";
import ChartTile from "~/components/common/UserStorageConsumption/ChartTile";
import NumberTile from "~/components/common/UserStorageConsumption/NumberTile";
import cs from "~/components/views/UserStorageConsumption/user_storage_consumption.scss";
import RefreshBatchTile from "./components/RefreshBatchTile";
import { UserStorageConsumptionDashboardProps } from "./types";
import summaryStyles from "./user_storage_consumption_dashboard.scss";

const CHART_THEME = {
  borderColor: "#a9bdfc",
  backgroundColor: "#2b52cd",
  tension: 0.4,
};

export const UserStorageConsumptionDashboard: React.FC<
  UserStorageConsumptionDashboardProps
> = ({
  totalUsers,
  totalSamples,
  totalInputFiles,
  totalInputFilesSize,
  totalSampleS3Files,
  totalSampleS3StorageSize,
  flaggedFilesCount,
  snapshotData,
}) => {
  const chartLabels = snapshotData.map(datum => datum.snapshotDate);

  const usersData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Users",
        data: snapshotData.map(datum => datum.totalUsers),
        ...CHART_THEME,
      },
    ],
  };

  const samplesData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Samples",
        data: snapshotData.map(datum => datum.totalSamples),
        ...CHART_THEME,
      },
    ],
  };

  const inputFilesData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Input Files",
        data: snapshotData.map(datum => datum.totalInputFiles),
        ...CHART_THEME,
      },
    ],
  };

  const inputFilesSizeData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Input Files Size",
        data: snapshotData.map(datum => datum.totalInputFilesSize / 1_000_000),
        ...CHART_THEME,
      },
    ],
  };

  return (
    <div className={cs.wrapper}>
      <div className={cs.header}>
        <h1>User Storage Consumption</h1>
      </div>
      <div className={summaryStyles.tilesContainer}>
        <div className={summaryStyles.tileItem}>
          <NumberTile
            title="Total Users"
            value={totalUsers}
            link={{
              href: "/user_storage_consumption/users",
              label: "View details 🢒",
            }}
          />
          <ChartTile title="Last 7 Days" data={usersData} />
        </div>
        <div className={summaryStyles.tileItem}>
          <NumberTile title="Total Samples" value={totalSamples} />
          <ChartTile title="Last 7 Days" data={samplesData} />
        </div>
        <div className={summaryStyles.tileItem}>
          <NumberTile title="Total Input Files" value={totalInputFiles} />
          <ChartTile title="Last 7 Days" data={inputFilesData} />
        </div>
        <div className={summaryStyles.tileItem}>
          <NumberTile
            title="Total Input Files Size"
            value={totalInputFilesSize}
          />
          <ChartTile title="Last 7 Days (MB)" data={inputFilesSizeData} />
        </div>
        <div className={summaryStyles.tileItem}>
          <NumberTile
            title="Total Sample S3 Files"
            value={totalSampleS3Files}
          />
        </div>
        <div className={summaryStyles.tileItem}>
          <NumberTile
            title="Sample S3 Storage"
            value={totalSampleS3StorageSize}
          />
        </div>
        <div className={summaryStyles.tileItem}>
          <NumberTile
            title="Large & Old Files"
            value={flaggedFilesCount}
            link={{
              href: "/user_storage_consumption/flagged_files",
              label: "View details 🢒",
            }}
            variant="warning"
          />
        </div>
        <div className={summaryStyles.tileItem}>
          <div className={summaryStyles.placeholderTile}>
            <div className={summaryStyles.placeholderTitle}>Placeholder</div>
            <div className={summaryStyles.placeholderDescription}>
              Future metrics will appear here.
            </div>
          </div>
        </div>
        <div
          className={`${summaryStyles.tileItem} ${summaryStyles.tileItemWide}`}
        >
          <RefreshBatchTile />
        </div>
        <div
          className={`${summaryStyles.tileItem} ${summaryStyles.tileItemWide}`}
        >
          <div className={summaryStyles.placeholderTile}>
            <div className={summaryStyles.placeholderTitle}>Placeholder</div>
            <div className={summaryStyles.placeholderDescription}>
              Additional storage insights coming soon.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
