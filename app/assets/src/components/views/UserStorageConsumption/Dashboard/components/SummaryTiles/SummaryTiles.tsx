import React from "react";
import ChartTile from "~/components/common/UserStorageConsumption/ChartTile";
import NumberTile from "~/components/common/UserStorageConsumption/NumberTile";
import RefreshBatchTile from "../RefreshBatchTile";
import { DashboardSnapshotDatum } from "~/components/views/UserStorageConsumption/Dashboard/types";
import styles from "./summary_tiles.scss";

interface SummaryTilesProps {
  totalUsers: number;
  totalSamples: number;
  totalInputFiles: number;
  totalInputFilesSize: string;
  totalSampleS3Files: number;
  totalSampleS3StorageSize: string;
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
        <NumberTile title="Total Sample S3 Files" value={totalSampleS3Files} />
      </div>
      <div className={styles.tileItem}>
        <NumberTile
          title="Sample S3 Storage"
          value={totalSampleS3StorageSize}
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
      <div className={styles.tileItem}>
        <div className={styles.placeholderTile}>
          <div className={styles.placeholderTitle}>Placeholder</div>
          <div className={styles.placeholderDescription}>Future metrics will appear here.</div>
        </div>
      </div>
      <div className={`${styles.tileItem} ${styles.tileItemWide}`}>
        <RefreshBatchTile />
      </div>
      <div className={`${styles.tileItem} ${styles.tileItemWide}`}>
        <div className={styles.placeholderTile}>
          <div className={styles.placeholderTitle}>Placeholder</div>
          <div className={styles.placeholderDescription}>
            Additional storage insights coming soon.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryTiles;
