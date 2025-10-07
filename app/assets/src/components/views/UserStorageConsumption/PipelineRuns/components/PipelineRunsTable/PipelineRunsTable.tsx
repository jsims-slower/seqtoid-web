import React from "react";
import SortableHeader from "~/components/common/UserStorageConsumption/SortableHeader";
import CompositeCell from "~/components/common/UserStorageConsumption/CompositeCell";
import { PipelineRunRow } from "~/components/views/UserStorageConsumption/PipelineRuns/types";
import styles from "./pipeline_runs_table.scss";

interface PipelineRunsTableProps {
  runs: PipelineRunRow[];
  sortBy?: string;
  sortDir?: string;
}

const baseUrl = "/user_storage_consumption/pipeline_runs";

const formatRuntime = (runtimeSeconds: number) => {
  if (!Number.isFinite(runtimeSeconds) || runtimeSeconds <= 0) {
    return "—";
  }

  const hours = Math.floor(runtimeSeconds / 3600);
  const minutes = Math.floor((runtimeSeconds % 3600) / 60);

  const parts: string[] = [];
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0 || parts.length === 0) {
    parts.push(`${minutes}m`);
  }

  return parts.join(" ");
};

export const PipelineRunsTable: React.FC<PipelineRunsTableProps> = ({
  runs,
  sortBy,
  sortDir,
}) => (
  <table className={styles.table}>
    <thead>
      <tr>
        <th>ID</th>
        <th>Sample</th>
        <th>User</th>
        <th>Project</th>
        <SortableHeader
          columnKey="runtime"
          columnLabel="Runtime"
          sortBy={sortBy}
          sortDir={sortDir}
          baseUrl={baseUrl}
        />
        <SortableHeader
          columnKey="executed_at"
          columnLabel="Executed"
          sortBy={sortBy}
          sortDir={sortDir}
          baseUrl={baseUrl}
        />
        <SortableHeader
          columnKey="job_status"
          columnLabel="Job Status"
          sortBy={sortBy}
          sortDir={sortDir}
          baseUrl={baseUrl}
        />
        <SortableHeader
          columnKey="technology"
          columnLabel="Technology"
          sortBy={sortBy}
          sortDir={sortDir}
          baseUrl={baseUrl}
        />
        <SortableHeader
          columnKey="wdl_version"
          columnLabel="WDL Version"
          sortBy={sortBy}
          sortDir={sortDir}
          baseUrl={baseUrl}
        />
        <SortableHeader
          columnKey="deprecated"
          columnLabel="Deprecated"
          sortBy={sortBy}
          sortDir={sortDir}
          baseUrl={baseUrl}
        />
      </tr>
    </thead>
    {runs.map(
      ({
        id,
        sampleId,
        sampleName,
        userId,
        userName,
        userEmail,
        projectId,
        projectName,
        runtimeSeconds,
        executedAt,
        jobStatus,
        technology,
        wdlVersion,
        deprecated,
      }) => (
        <tbody key={id}>
          <tr>
            <td>{id}</td>
            <td>
              <CompositeCell
                primary={sampleName}
                secondaryParts={[`ID: ${sampleId ?? "N/A"}`]}
              />
            </td>
            <td>
              <CompositeCell
                primary={userName || userEmail || "N/A"}
                secondaryParts={[
                  `Email: ${userEmail ?? "N/A"}`,
                  `ID: ${userId ?? "N/A"}`,
                ]}
              />
            </td>
            <td>
              <CompositeCell
                primary={projectName}
                secondaryParts={[`ID: ${projectId ?? "N/A"}`]}
              />
            </td>
            <td>{formatRuntime(runtimeSeconds)}</td>
            <td>{executedAt || "—"}</td>
            <td>{jobStatus || "—"}</td>
            <td>{technology || "—"}</td>
            <td>{wdlVersion || "—"}</td>
            <td>{deprecated ? "Yes" : "No"}</td>
          </tr>
        </tbody>
      ),
    )}
  </table>
);

export default PipelineRunsTable;
