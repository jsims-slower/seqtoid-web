import React from "react";
import { FlaggedFile } from "../../types";
import cs from "../../user_storage_consumption_flagged_files.scss";
import CompositeCell from "./components/CompositeCell";
import tableStyles from "./flagged_files_table.scss";

interface FlaggedFilesTableProps {
  files: FlaggedFile[];
  subtitle: string;
}

export const FlaggedFilesTable: React.FC<FlaggedFilesTableProps> = ({
  files,
  subtitle,
}) => {
  if (!files.length) {
    return (
      <section className={tableStyles.flaggedSection}>
        <div className={tableStyles.flaggedSectionHeader}>{subtitle}</div>
        <div className={cs.emptyState}>
          No files meet the selected thresholds.
        </div>
      </section>
    );
  }

  return (
    <section className={tableStyles.flaggedSection}>
      <div className={tableStyles.flaggedSectionHeader}>{subtitle}</div>
      <table className={tableStyles.table}>
        <thead>
          <tr>
            <th>File ID</th>
            <th>File Name</th>
            <th>File Type</th>
            <th>Size</th>
            <th>Created</th>
            <th>Source</th>
            <th>User</th>
            <th>Sample</th>
            <th>Project</th>
          </tr>
        </thead>
        {files.map(file => {
          const {
            id,
            name,
            fileType,
            sizeHuman,
            createdAt,
            sourceType,
            userId,
            userName,
            userEmail,
            sampleId,
            sampleName,
            projectId,
            projectName,
          } = file;

          const userPrimary = userName || "N/A";
          const userSecondary = [
            `Email: ${userEmail || "N/A"}`,
            `ID: ${userId ?? "N/A"}`,
          ];

          const samplePrimary = sampleName || "N/A";
          const sampleSecondary = [`ID: ${sampleId ?? "N/A"}`];

          const projectPrimary = projectName || "N/A";
          const projectSecondary = [`ID: ${projectId ?? "N/A"}`];

          return (
            <tbody key={`flagged-${id}`}>
              <tr>
                <td>{id}</td>
                <td className={tableStyles.tdFileName}>{name ?? "N/A"}</td>
                <td>{fileType ?? "N/A"}</td>
                <td>{sizeHuman ?? "N/A"}</td>
                <td>{createdAt ?? "N/A"}</td>
                <td>{sourceType ?? "N/A"}</td>
                <td>
                  <CompositeCell
                    primary={userPrimary}
                    secondaryParts={userSecondary}
                  />
                </td>
                <td>
                  <CompositeCell
                    primary={samplePrimary}
                    secondaryParts={sampleSecondary}
                    primaryClassName={`${tableStyles.samplePrimary} ${tableStyles.truncate}`}
                    secondaryClassName={tableStyles.sampleSecondary}
                  />
                </td>
                <td>
                  <CompositeCell
                    primary={projectPrimary}
                    secondaryParts={projectSecondary}
                  />
                </td>
              </tr>
            </tbody>
          );
        })}
      </table>
    </section>
  );
};

export default FlaggedFilesTable;
