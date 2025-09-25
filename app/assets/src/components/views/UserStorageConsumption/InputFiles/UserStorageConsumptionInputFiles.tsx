import React from "react";
import Pagination from "~/components/common/UserStorageConsumption/Pagination";
import cs from "~/components/views/UserStorageConsumption/user_storage_consumption.scss";
import SampleFilesTable from "./components/SampleFilesTable";
import SummaryTiles from "./components/SummaryTiles";
import { UserStorageConsumptionInputFilesProps } from "./types";

export const UserStorageConsumptionInputFiles: React.FC<
  UserStorageConsumptionInputFilesProps
> = ({ summary, sampleFileRows, page, perPage, totalCount }) => {
  const {
    id,
    email,
    name,
    totalSamples,
    totalInputFiles,
    totalInputFilesSize,
  } = summary;

  if (!sampleFileRows || sampleFileRows.length === 0) {
    return (
      <div className={cs.emptyState}>
        User has no input files.{" "}
        <a href={`/user_storage_consumption/users/${id}/input_files`}>Retry</a>
      </div>
    );
  }

  return (
    <div className={cs.wrapper}>
      <div className={cs.header}>
        <a href="/user_storage_consumption" className={cs.backLink}>
          &#129168; Back to dashboard
        </a>
        <h1>
          {name} ({email})
        </h1>
      </div>
      <SummaryTiles
        totals={{
          totalSamples,
          totalInputFiles,
          totalInputFilesSize,
        }}
      />

      <SampleFilesTable rows={sampleFileRows} />
      <Pagination
        page={page}
        perPage={perPage}
        totalCount={totalCount}
        baseUrl={`/user_storage_consumption/users/${id}/input_files`}
      />
    </div>
  );
};
