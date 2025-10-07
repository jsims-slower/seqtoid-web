import React from "react";
import CompositeCell from "~/components/common/UserStorageConsumption/CompositeCell";
import SortableHeader from "~/components/common/UserStorageConsumption/SortableHeader";
import { PipelineRunRow } from "~/components/views/UserStorageConsumption/PipelineRuns/types";
import styles from "./pipeline_runs_table.scss";

interface PipelineRunsTableProps {
  runs: PipelineRunRow[];
  sortBy?: string;
  sortDir?: string;
}

const baseUrl = "/user_storage_consumption/pipeline_runs";

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
          columnKey="time_to_finalized"
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
        runtimeHours,
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
                maxWidth="20rem"
              />
            </td>
            <td>
              <CompositeCell
                primary={userName || userEmail || "N/A"}
                secondaryParts={[
                  `Email: ${userEmail ?? "N/A"}`,
                  `ID: ${userId ?? "N/A"}`,
                ]}
                maxWidth="20rem"
              />
            </td>
            <td>
              <CompositeCell
                primary={projectName}
                secondaryParts={[`ID: ${projectId ?? "N/A"}`]}
                maxWidth="20rem"
              />
            </td>
            <td>{runtimeHours || "—"}</td>
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
