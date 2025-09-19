import React from "react";
import NumberTile from "~/components/common/UserStorageConsumption/NumberTile";
import { FlaggedFilesSummary } from "~/components/views/UserStorageConsumption/FlaggedFiles/types";
import styles from "./summary_tiles.scss";

interface SummaryTilesProps {
  summary: FlaggedFilesSummary;
}

export const SummaryTiles: React.FC<SummaryTilesProps> = ({ summary }) => {
  const {
    flaggedCount,
    flaggedTotalSize,
    flaggedAverageFileSize,
    impactedUsers,
    impactedProjects,
  } = summary;

  return (
    <div className={styles.tilesContainer}>
      <NumberTile
        title="Large & Old Files"
        value={flaggedCount}
        variant="warning"
      />
      <NumberTile title="Storage At Risk" value={flaggedTotalSize} />
      <NumberTile
        title="Average Flagged File Size"
        value={flaggedAverageFileSize}
      />
      <NumberTile title="Impacted Users" value={impactedUsers} />
      <NumberTile title="Impacted Projects" value={impactedProjects} />
    </div>
  );
};

export default SummaryTiles;
