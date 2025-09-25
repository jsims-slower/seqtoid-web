import React from "react";
import NumberTile from "~/components/common/UserStorageConsumption/NumberTile";
import styles from "./summary_tiles.scss";

type SummaryTotals = {
  totalSamples: number;
  totalSampleS3Files: number;
  totalSampleS3Size: string;
};

interface SummaryTilesProps {
  totals: SummaryTotals;
}

const SummaryTiles: React.FC<SummaryTilesProps> = ({ totals }) => {
  const { totalSamples, totalSampleS3Files, totalSampleS3Size } = totals;

  return (
    <div className={styles.tilesContainer}>
      <NumberTile title="Total Samples" value={totalSamples} />
      <NumberTile title="Sample S3 Files" value={totalSampleS3Files} />
      <NumberTile title="Sample S3 Storage" value={totalSampleS3Size} />
    </div>
  );
};

export default SummaryTiles;
