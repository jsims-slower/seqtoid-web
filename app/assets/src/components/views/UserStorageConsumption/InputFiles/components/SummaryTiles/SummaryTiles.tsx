import React from "react";
import NumberTile from "~/components/common/UserStorageConsumption/NumberTile";
import { parseValueWithUnit } from "~/components/common/UserStorageConsumption/NumberTile/utils";
import { InputFilesSummary } from "~/components/views/UserStorageConsumption/InputFiles/types";
import styles from "./summary_tiles.scss";

interface SummaryTilesProps {
  totals: Pick<
    InputFilesSummary,
    "totalSamples" | "totalInputFiles" | "totalInputFilesSize"
  >;
}

const SummaryTiles: React.FC<SummaryTilesProps> = ({ totals }) => {
  const { totalSamples, totalInputFiles, totalInputFilesSize } = totals;
  const totalInputFilesSizeParsed = parseValueWithUnit(totalInputFilesSize);

  return (
    <div className={styles.tilesContainer}>
      <NumberTile title="Total Samples" value={totalSamples} />
      <NumberTile title="Total Input Files" value={totalInputFiles} />
      <NumberTile
        title="Total Input Files Size"
        value={totalInputFilesSizeParsed.value}
        unit={totalInputFilesSizeParsed.unit}
      />
    </div>
  );
};

export default SummaryTiles;
