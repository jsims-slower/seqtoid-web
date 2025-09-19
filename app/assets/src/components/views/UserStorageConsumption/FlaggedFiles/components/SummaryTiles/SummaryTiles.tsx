import React from "react";
import NumberTile from "~/components/common/UserStorageConsumption/NumberTile";
import styles from "./summary_tiles.scss";
import { FlaggedFilesSummary } from "../../types";

interface SummaryTilesProps {
  summary: FlaggedFilesSummary;
}

export const SummaryTiles: React.FC<SummaryTilesProps> = ({ summary }) => {
  const {
    flaggedCount,
    totalFiles,
    totalFilesSize,
    averageFileSize,
    averageFilesPerUser,
  } = summary;

  return (
    <div className={styles.tilesContainer}>
      <NumberTile title="Large & Old Files" value={flaggedCount} />
      <NumberTile title="Total Files" value={totalFiles} />
      <NumberTile title="Total Files Size" value={totalFilesSize} />
      <NumberTile title="Average File Size" value={averageFileSize} />
      <NumberTile title="Average Files per User" value={averageFilesPerUser} />
    </div>
  );
};

export default SummaryTiles;
