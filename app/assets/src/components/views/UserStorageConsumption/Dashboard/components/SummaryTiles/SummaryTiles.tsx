import React from "react";
import ChartTile from "~/components/common/UserStorageConsumption/ChartTile";
import NumberTile from "~/components/common/UserStorageConsumption/NumberTile";
import { DashboardSnapshotDatum } from "~/components/views/UserStorageConsumption/Dashboard/types";
import styles from "./summary_tiles.scss";

interface SummaryTilesProps {
  totalUsers: number;
  totalSamples: number;
  totalInputFiles: number;
  totalInputFilesSize: string;
  averageFileSize: string;
  averageFilesPerUser: string;
  flaggedFilesCount: number;
  snapshotData: DashboardSnapshotDatum[];
}

const CHART_THEME = {
  borderColor: "#a9bdfc",
  backgroundColor: "#2b52cd",
  tension: 0.4,
};

const SummaryTiles: React.FC<SummaryTilesProps> = ({
  totalUsers,
  totalSamples,
  totalInputFiles,
  totalInputFilesSize,
  averageFileSize,
  averageFilesPerUser,
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
    <div className={styles.tilesContainer}>
      <div className={styles.tileItem}>
        <NumberTile title="Total Users" value={totalUsers} />
        <ChartTile title="Last 7 Days" data={usersData} />
      </div>
      <div className={styles.tileItem}>
        <NumberTile title="Total Samples" value={totalSamples} />
        <ChartTile title="Last 7 Days" data={samplesData} />
      </div>
      <div className={styles.tileItem}>
        <NumberTile title="Total Input Files" value={totalInputFiles} />
        <ChartTile title="Last 7 Days" data={inputFilesData} />
      </div>
      <div className={styles.tileItem}>
        <NumberTile
          title="Total Input Files Size"
          value={totalInputFilesSize}
        />
        <ChartTile title="Last 7 Days (MB)" data={inputFilesSizeData} />
      </div>
      <div className={styles.tileItem}>
        <NumberTile title="Average File Size" value={averageFileSize} />
      </div>
      <div className={styles.tileItem}>
        <NumberTile
          title="Average Files per User"
          value={averageFilesPerUser}
        />
      </div>
      <div className={styles.tileItem}>
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
    </div>
  );
};

export default SummaryTiles;
