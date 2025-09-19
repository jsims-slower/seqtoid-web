import React from "react";
import { SampleFileRow } from "~/components/views/UserStorageConsumption/UserDetails/types";
import styles from "./sample_files_table.scss";

interface SampleFilesTableProps {
  rows: SampleFileRow[];
}

const SampleFilesTable: React.FC<SampleFilesTableProps> = ({ rows }) => {
  const groupedBySample = rows.reduce<Record<number, SampleFileRow[]>>(
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
          <th className={styles.thFileId}>File ID</th>
          <th className={styles.thFileName}>File Name</th>
          <th className={styles.thFileType}>File Type</th>
          <th className={styles.thFileSize}>File Size</th>
          <th className={styles.thSourceType}>Source Type</th>
        </tr>
      </thead>
      {sampleIds.map(sampleId => {
        const sampleRows = groupedBySample[sampleId];

        return (
          <tbody key={sampleId}>
            {sampleRows.map((row, index) => (
              <tr key={`${row.sampleId}-${row.fileId}`}>
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
                <td className={styles.tdFileId}>{row.fileId}</td>
                <td className={styles.tdFileName}>{row.fileName ?? "N/A"}</td>
                <td className={styles.tdFileType}>{row.fileType ?? "N/A"}</td>
                <td className={styles.tdFileSize}>{row.fileSize ?? "N/A"}</td>
                <td className={styles.tdSourceType}>
                  {row.sourceType ?? "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        );
      })}
    </table>
  );
};

export default SampleFilesTable;
