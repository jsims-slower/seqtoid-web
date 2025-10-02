import React from "react";
import Pagination from "~/components/common/UserStorageConsumption/Pagination";
import cs from "~/components/views/UserStorageConsumption/user_storage_consumption.scss";
import SampleS3FilesTable from "./components/SampleS3FilesTable";
import SummaryTiles from "./components/SummaryTiles";
import { UserStorageConsumptionSampleS3DetailsProps } from "./types";

export const UserStorageConsumptionSampleS3Details: React.FC<
  UserStorageConsumptionSampleS3DetailsProps
> = ({ user, sampleS3FileRows, page, totalPages }) => {
  const {
    id,
    email,
    name,
    totalSamples,
    totalSampleS3Files,
    totalSampleS3Size,
  } = user;

  if (!sampleS3FileRows || sampleS3FileRows.length === 0) {
    return (
      <div className={cs.emptyState}>
        User has no sample S3 files.{" "}
        <a href={`/user_storage_consumption/users/${id}/sample_s3_files`}>
          Retry
        </a>
      </div>
    );
  }

  return (
    <div className={cs.wrapper}>
      <div className={cs.header}>
        <a href="/user_storage_consumption/users" className={cs.backLink}>
          &#129168; Back to users
        </a>
        <h1>
          {name} ({email})
        </h1>
      </div>
      <SummaryTiles
        totals={{
          totalSamples,
          totalSampleS3Files,
          totalSampleS3Size,
        }}
      />

      <SampleS3FilesTable userId={id} rows={sampleS3FileRows} />
      <Pagination
        page={page}
        totalPages={totalPages}
        baseUrl={`/user_storage_consumption/users/${id}/sample_s3_files`}
      />
    </div>
  );
};
