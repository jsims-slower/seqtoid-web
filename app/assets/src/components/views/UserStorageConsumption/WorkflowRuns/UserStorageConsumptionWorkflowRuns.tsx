import React from "react";
import Pagination from "~/components/common/UserStorageConsumption/Pagination";
import cs from "~/components/views/UserStorageConsumption/user_storage_consumption.scss";
import WorkflowRunsTable from "./components/WorkflowRunsTable";
import SummaryTiles from "./components/SummaryTiles";
import { UserStorageConsumptionWorkflowRunsProps } from "./types";

export const UserStorageConsumptionWorkflowRuns: React.FC<
  UserStorageConsumptionWorkflowRunsProps
> = ({
  workflowRuns,
  summary,
  page,
  totalPages,
  sortBy,
  sortDir,
}) => {
  const hasRuns = workflowRuns && workflowRuns.length > 0;

  return (
    <div className={cs.wrapper}>
      <div className={cs.header}>
        <a href="/user_storage_consumption" className={cs.backLink}>
          &#129168; Back to dashboard
        </a>
        <h1>Workflow Runs</h1>
      </div>

      <SummaryTiles summary={summary} />

      {hasRuns ? (
        <>
          <WorkflowRunsTable
            runs={workflowRuns}
            sortBy={sortBy ?? undefined}
            sortDir={sortDir ?? undefined}
          />
          {totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              baseUrl="/user_storage_consumption/workflow_runs"
            />
          )}
        </>
      ) : (
        <div className={cs.emptyState}>No workflow runs found.</div>
      )}
    </div>
  );
};

export default UserStorageConsumptionWorkflowRuns;
