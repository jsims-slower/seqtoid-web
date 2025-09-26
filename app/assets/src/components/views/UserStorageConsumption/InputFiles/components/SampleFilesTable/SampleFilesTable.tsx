import React from "react";
import {
  SampleFileRow,
  SampleInputFile,
} from "~/components/views/UserStorageConsumption/InputFiles/types";
import styles from "./sample_files_table.scss";

interface SampleFilesTableProps {
  rows: SampleFileRow[];
}

const SampleFilesTable: React.FC<SampleFilesTableProps> = ({ rows }) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr className={styles.headerRow}>
          <th className={styles.thSampleId}>Sample ID</th>
          <th className={styles.thSampleName}>Sample Name</th>
          <th className={styles.thCreatedAt}>Created At</th>
          <th className={styles.thTotalFiles}>Total Files</th>
          <th className={styles.thTotalSize}>Total Size</th>
          <th className={styles.thFileId}>File ID</th>
          <th className={styles.thFileName}>File Name</th>
          <th className={styles.thFileType}>File Type</th>
          <th className={styles.thFileSize}>File Size</th>
          <th className={styles.thSourceType}>Source Type</th>
        </tr>
      </thead>
      {rows.map(sample => {
        const hasFiles = sample.inputFiles.length > 0;
        const inputFiles: Array<SampleInputFile | null> = hasFiles
          ? sample.inputFiles
          : [null];
        const rowSpan = Math.max(sample.inputFiles.length, 1);
        const sampleName = sample.sampleName || "N/A";
        const projectName = sample.projectName || "N/A";

        return (
          <tbody key={sample.sampleId}>
            {inputFiles.map((file, index) => {
              const fileName = file?.fileName ?? "N/A";

              return (
                <tr
                  key={
                    file?.fileId
                      ? `${sample.sampleId}-${file.fileId}`
                      : `no-files-${sample.sampleId}-${index}`
                  }
                >
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
                      {sample.totalInputFiles}
                    </td>
                  )}
                  {index === 0 && (
                    <td rowSpan={rowSpan} className={styles.tdTotalSize}>
                      {sample.totalInputFilesSize}
                    </td>
                  )}
                  <td className={styles.tdFileId}>{file?.fileId ?? "N/A"}</td>
                  <td className={styles.tdFileName}>
                    <span className={styles.fileName} title={fileName}>
                      {fileName}
                    </span>
                  </td>
                  <td className={styles.tdFileType}>
                    {file?.fileType ?? "N/A"}
                  </td>
                  <td className={styles.tdFileSize}>
                    {file?.fileSize ?? "N/A"}
                  </td>
                  <td className={styles.tdSourceType}>
                    {file?.sourceType ?? "N/A"}
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

export default SampleFilesTable;
