import React from "react";
import NumberTile from "~/components/common/UserStorageConsumption/NumberTile";
import { UsersSummary } from "~/components/views/UserStorageConsumption/Users/types";
import styles from "./summary_tiles.scss";

interface SummaryTilesProps {
  summary: UsersSummary;
}

const BYTES_IN_MEGABYTE = 1024 * 1024;

const SummaryTiles: React.FC<SummaryTilesProps> = ({ summary }) => {
  const totalUsers = summary.totalUsers ?? 0;
  const averageSamplesPerUser = Number(
    (summary.averageSamplesPerUser ?? 0).toFixed(1),
  );
  const averageInputFileSizePerUserMb = Number(
    ((summary.averageInputFileSizePerUserBytes ?? 0) / BYTES_IN_MEGABYTE).toFixed(
      2,
    ),
  );
  const averageSampleS3SizePerUserMb = Number(
    ((summary.averageSampleS3SizePerUserBytes ?? 0) / BYTES_IN_MEGABYTE).toFixed(
      2,
    ),
  );

  return (
    <div className={styles.tilesContainer}>
      <NumberTile title="Total Users" value={totalUsers} />
      <NumberTile
        title="Average Samples / User"
        value={averageSamplesPerUser}
      />
      <NumberTile
        title="Average Input File Size / User"
        value={averageInputFileSizePerUserMb}
        unit="MB"
      />
      <NumberTile
        title="Average S3 Storage / User"
        value={averageSampleS3SizePerUserMb}
        unit="MB"
      />
    </div>
  );
};

export default SummaryTiles;
