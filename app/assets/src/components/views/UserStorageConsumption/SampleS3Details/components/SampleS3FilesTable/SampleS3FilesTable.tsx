import React from "react";
import {
  SampleS3File,
  SampleS3Row,
} from "~/components/views/UserStorageConsumption/SampleS3Details/types";
import styles from "./sample_s3_files_table.scss";

interface SampleS3FilesTableProps {
  rows: SampleS3Row[];
}

const SampleS3FilesTable: React.FC<SampleS3FilesTableProps> = ({ rows }) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr className={styles.headerRow}>
          <th className={styles.thSampleId}>Sample ID</th>
          <th className={styles.thSampleName}>Sample Name</th>
          <th className={styles.thCreatedAt}>Created At</th>
          <th className={styles.thTotalFiles}>Total Files</th>
          <th className={styles.thTotalSize}>Total Size</th>
          <th className={styles.thDisplayName}>Display Name</th>
          <th className={styles.thFileSize}>File Size</th>
        </tr>
      </thead>
      {rows.map(sample => {
        const hasFiles = sample.sampleS3Files.length > 0;
        const s3Files: Array<SampleS3File | null> = hasFiles
          ? sample.sampleS3Files
          : [null];
        const rowSpan = Math.max(sample.sampleS3Files.length, 1);
        const sampleName = sample.sampleName || "N/A";
        const projectName = sample.projectName || "N/A";

        return (
          <tbody key={sample.sampleId}>
            {s3Files.map((file, index) => {
              const displayName = file?.displayName ?? "N/A";

              return (
                <tr key={`${sample.sampleId}-${index}`}>
                  {index === 0 && (
                    <td rowSpan={rowSpan} className={styles.tdSampleId}>
                      {sample.sampleId}
                    </td>
                  )}
                  {index === 0 && (
                    <td rowSpan={rowSpan} className={styles.tdSampleName}>
                      <span className={styles.sampleName} title={sampleName}>
                        {sampleName}
                      </span>
                      <br />
                      <span className={styles.projectName} title={projectName}>
                        Project: {projectName}
                      </span>
                    </td>
                  )}
                  {index === 0 && (
                    <td rowSpan={rowSpan} className={styles.tdCreatedAt}>
                      {sample.sampleCreatedAt}
                    </td>
                  )}
                  {index === 0 && (
                    <td rowSpan={rowSpan} className={styles.tdTotalFiles}>
                      {sample.totalSampleS3Files}
                    </td>
                  )}
                  {index === 0 && (
                    <td rowSpan={rowSpan} className={styles.tdTotalSize}>
                      {sample.totalSampleS3FilesSize}
                    </td>
                  )}
                  <td className={styles.tdDisplayName}>
                    <span className={styles.displayName} title={displayName}>
                      {displayName}
                    </span>
                  </td>
                  <td className={styles.tdFileSize}>
                    {file?.fileSize ?? "N/A"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        );
      })}
    </table>
  );
};

export default SampleS3FilesTable;
