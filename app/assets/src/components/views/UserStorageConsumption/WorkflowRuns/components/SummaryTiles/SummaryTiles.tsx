import React from "react";
import NumberTile from "~/components/common/UserStorageConsumption/NumberTile";
import { WorkflowRunsSummary } from "~/components/views/UserStorageConsumption/WorkflowRuns/types";
import styles from "./summary_tiles.scss";

interface SummaryTilesProps {
  summary: WorkflowRunsSummary;
}

const secondsToHours = (seconds: number) => {
  if (!Number.isFinite(seconds)) {
    return 0;
  }

  const hours = seconds / 3600;
  return Number(hours.toFixed(2));
};

export const SummaryTiles: React.FC<SummaryTilesProps> = ({ summary }) => {
  const {
    totalRuns,
    averageRuntimeSeconds,
    slowestRuntimeSeconds,
    totalDeprecated,
  } = summary;

  const averageRuntimeHours = secondsToHours(averageRuntimeSeconds);
  const slowestRuntimeHours = secondsToHours(slowestRuntimeSeconds);

  return (
    <div className={styles.tilesContainer}>
      <NumberTile title="Total Workflow Runs" value={totalRuns} />
      <NumberTile
        title="Average Runtime"
        value={averageRuntimeHours}
        unit="hrs"
      />
      <NumberTile
        title="Longest Runtime"
        value={slowestRuntimeHours}
        unit="hrs"
      />
      <NumberTile title="Deprecated Runs" value={totalDeprecated} />
    </div>
  );
};

export default SummaryTiles;
