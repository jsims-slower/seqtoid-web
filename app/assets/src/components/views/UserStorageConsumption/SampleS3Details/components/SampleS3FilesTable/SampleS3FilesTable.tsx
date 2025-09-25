import React from "react";
import { SampleS3FileRow } from "~/components/views/UserStorageConsumption/SampleS3Details/types";
import styles from "./sample_s3_files_table.scss";

interface SampleS3FilesTableProps {
  rows: SampleS3FileRow[];
}

const SampleS3FilesTable: React.FC<SampleS3FilesTableProps> = ({ rows }) => {
  const groupedBySample = rows.reduce<Record<number, SampleS3FileRow[]>>(
    (accumulator, row) => {
      const group = accumulator[row.sampleId] || [];
      group.push(row);
      accumulator[row.sampleId] = group;
      return accumulator;
    },
    {},
  );

  const sampleIds = Object.keys(groupedBySample).map(Number);

  return (
    <table className={styles.table}>
      <thead>
        <tr className={styles.headerRow}>
          <th className={styles.thSampleId}>Sample ID</th>
          <th className={styles.thSampleName}>Sample Name</th>
          <th className={styles.thCreatedAt}>Created At</th>
          <th className={styles.thDisplayName}>Display Name</th>
          <th className={styles.thFileSize}>File Size</th>
        </tr>
      </thead>
      {sampleIds.map(sampleId => {
        const sampleRows = groupedBySample[sampleId];

        return (
          <tbody key={sampleId}>
            {sampleRows.map((row, index) => (
              <tr key={`${row.sampleId}-${index}`}>
                {index === 0 && (
                  <td rowSpan={sampleRows.length} className={styles.tdSampleId}>
                    {row.sampleId}
                  </td>
                )}
                {index === 0 && (
                  <td
                    rowSpan={sampleRows.length}
                    className={styles.tdSampleName}
                  >
                    <span className={styles.sampleName}>{row.sampleName}</span>
                    <br />
                    <span className={styles.projectName}>
                      Project: {row.projectName}
                    </span>
                  </td>
                )}
                {index === 0 && (
                  <td
                    rowSpan={sampleRows.length}
                    className={styles.tdCreatedAt}
                  >
                    {row.sampleCreatedAt}
                  </td>
                )}
                <td className={styles.tdDisplayName}>{row.displayName ?? "N/A"}</td>
                <td className={styles.tdFileSize}>{row.fileSize ?? "N/A"}</td>
              </tr>
            ))}
          </tbody>
        );
      })}
    </table>
  );
};

export default SampleS3FilesTable;
