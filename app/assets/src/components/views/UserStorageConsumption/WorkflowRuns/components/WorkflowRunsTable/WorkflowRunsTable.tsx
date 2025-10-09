import React from "react";
import CompositeCell from "~/components/common/UserStorageConsumption/CompositeCell";
import SortableHeader from "~/components/common/UserStorageConsumption/SortableHeader";
import { WorkflowRunRow } from "~/components/views/UserStorageConsumption/WorkflowRuns/types";
import styles from "./workflow_runs_table.scss";

interface WorkflowRunsTableProps {
  runs: WorkflowRunRow[];
  sortBy?: string;
  sortDir?: string;
}

const baseUrl = "/user_storage_consumption/workflow_runs";

export const WorkflowRunsTable: React.FC<WorkflowRunsTableProps> = ({
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
          columnKey="status"
          columnLabel="Status"
          sortBy={sortBy}
          sortDir={sortDir}
          baseUrl={baseUrl}
        />
        <SortableHeader
          columnKey="workflow"
          columnLabel="Workflow"
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
        status,
        workflow,
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
            <td>{status || "—"}</td>
            <td>{workflow || "—"}</td>
            <td>{wdlVersion || "—"}</td>
            <td>{deprecated ? "Yes" : "No"}</td>
          </tr>
        </tbody>
      ),
    )}
  </table>
);

export default WorkflowRunsTable;
