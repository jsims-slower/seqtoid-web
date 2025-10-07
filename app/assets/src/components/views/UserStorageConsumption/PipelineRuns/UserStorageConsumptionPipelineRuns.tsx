import React from "react";
import Pagination from "~/components/common/UserStorageConsumption/Pagination";
import cs from "~/components/views/UserStorageConsumption/user_storage_consumption.scss";
import PipelineRunsTable from "./components/PipelineRunsTable";
import SummaryTiles from "./components/SummaryTiles";
import { UserStorageConsumptionPipelineRunsProps } from "./types";

export const UserStorageConsumptionPipelineRuns: React.FC<
  UserStorageConsumptionPipelineRunsProps
> = ({
  pipelineRuns,
  summary,
  page,
  totalPages,
  sortBy,
  sortDir,
}) => {
  const hasRuns = pipelineRuns && pipelineRuns.length > 0;

  return (
    <div className={cs.wrapper}>
      <div className={cs.header}>
        <a href="/user_storage_consumption" className={cs.backLink}>
          &#129168; Back to dashboard
        </a>
        <h1>Pipeline Runs</h1>
      </div>

      <SummaryTiles summary={summary} />

      {hasRuns ? (
        <>
          <PipelineRunsTable
            runs={pipelineRuns}
            sortBy={sortBy ?? undefined}
            sortDir={sortDir ?? undefined}
          />
          {totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              baseUrl="/user_storage_consumption/pipeline_runs"
            />
          )}
        </>
      ) : (
        <div className={cs.emptyState}>No pipeline runs found.</div>
      )}
    </div>
  );
};

export default UserStorageConsumptionPipelineRuns;
