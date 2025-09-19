import React from "react";
import NumberTile from "~/components/common/UserStorageConsumption/NumberTile";
import Pagination from "~/components/common/UserStorageConsumption/Pagination";
import cs from "./user_storage_consumption_user_details.scss";

export interface UserStorageConsumptionUserDetailsProps {
  user: {
    id: number;
    email: string;
    name: string;
    totalSamples: number;
    totalInputFiles: number;
    totalInputFilesSize: string;
  };
  sampleFileRows: Array<{
    sampleId: number;
    sampleName: string;
    projectName: string;
    sampleCreatedAt: string;
    fileId: number;
    fileName: string | null;
    fileType: string | null;
    fileSize: string | null;
    sourceType: string | null;
  }>;
  page: number;
  perPage: number;
  totalCount: number;
}

export const UserStorageConsumptionUserDetails: React.FC<
  UserStorageConsumptionUserDetailsProps
> = ({ user, sampleFileRows, page, perPage, totalCount }) => {
  const {
    id,
    email,
    name,
    totalSamples,
    totalInputFiles,
    totalInputFilesSize,
  } = user;

  if (!sampleFileRows || sampleFileRows.length === 0) {
    return (
      <div className={cs.emptyState}>
        User has no samples.{" "}
        <a href={`/user_storage_consumption/${id}`}>Retry</a>
      </div>
    );
  }

  // Merge sample info cells using rowspan
  // Group rows by sampleId
  const grouped = sampleFileRows.reduce((acc, row) => {
    if (!acc[row.sampleId]) acc[row.sampleId] = [];
    acc[row.sampleId].push(row);
    return acc;
  }, {} as Record<number, typeof sampleFileRows>);
  const sampleIds = Object.keys(grouped);

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
      <div className={cs.tilesContainer}>
        <NumberTile title="Total Samples" value={totalSamples} />
        <NumberTile title="Total Input Files" value={totalInputFiles} />
        <NumberTile
          title="Total Input Files Size"
          value={totalInputFilesSize}
        />
      </div>
      <table className={cs.table}>
        <thead>
          <tr className={cs.headerRow}>
            <th className={cs.thSampleId}>Sample ID</th>
            <th className={cs.thSampleName}>Sample Name</th>
            <th className={cs.thCreatedAt}>Created At</th>
            <th className={cs.thFileId}>File ID</th>
            <th className={cs.thFileName}>File Name</th>
            <th className={cs.thFileType}>File Type</th>
            <th className={cs.thFileSize}>File Size</th>
            <th className={cs.thSourceType}>Source Type</th>
          </tr>
        </thead>
        {sampleIds.map(sampleId => {
          const rows = grouped[Number(sampleId)];
          return (
            <tbody key={sampleId}>
              {rows.map((row, idx) => {
                const {
                  sampleId,
                  fileId,
                  fileName,
                  fileType,
                  fileSize,
                  sourceType,
                  sampleName,
                  projectName,
                  sampleCreatedAt,
                } = row;
                return (
                  <tr key={sampleId + "-" + fileId}>
                    {idx === 0 && (
                      <td rowSpan={rows.length} className={cs.tdSampleId}>
                        {sampleId}
                      </td>
                    )}
                    {idx === 0 && (
                      <td rowSpan={rows.length} className={cs.tdSampleName}>
                        <span className={cs.sampleName}>{sampleName}</span>
                        <br />
                        <span className={cs.projectName}>
                          Project: {projectName}
                        </span>
                      </td>
                    )}
                    {idx === 0 && (
                      <td rowSpan={rows.length} className={cs.tdCreatedAt}>
                        {sampleCreatedAt}
                      </td>
                    )}
                    <td className={cs.tdFileId}>{fileId}</td>
                    <td className={cs.tdFileName}>{fileName ?? "N/A"}</td>
                    <td className={cs.tdFileType}>{fileType ?? "N/A"}</td>
                    <td className={cs.tdFileSize}>{fileSize ?? "N/A"}</td>
                    <td className={cs.tdSourceType}>{sourceType ?? "N/A"}</td>
                  </tr>
                );
              })}
            </tbody>
          );
        })}
      </table>
      <Pagination
        page={page}
        perPage={perPage}
        totalCount={totalCount}
        baseUrl={`/user_storage_consumption/${id}`}
      />
    </div>
  );
};
