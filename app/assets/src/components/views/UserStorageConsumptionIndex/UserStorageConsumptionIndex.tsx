import React from "react";
import ChartTile from "~/components/common/UserStorageConsumption/ChartTile";
import NumberTile from "~/components/common/UserStorageConsumption/NumberTile";
import cs from "./user_storage_consumption_index.scss";

export interface UserStorageConsumptionIndexProps {
  users: Array<{
    id: number;
    email: string;
    name: string;
    sampleCount: number;
    inputFileCount: number;
    totalInputFilesSize: string;
  }>;
  page: number;
  perPage: number;
  totalCount: number;
  searchBy?: string;
  totalUsers: number;
  totalSamples: number;
  totalInputFiles: number;
  totalInputFilesSize: string;
  snapshotData: Array<{
    snapshotDate: string;
    totalUsers: number;
    totalSamples: number;
    totalInputFiles: number;
    totalInputFilesSize: number;
  }>;
}

export const UserStorageConsumptionIndex: React.FC<
  UserStorageConsumptionIndexProps
> = ({
  users,
  page,
  perPage,
  totalCount,
  searchBy,
  totalUsers,
  totalSamples,
  totalInputFiles,
  totalInputFilesSize,
  snapshotData,
}) => {
  if (!users || users.length === 0) {
    return <div className={cs.emptyState}>No users found.</div>;
  }

  const chartLabels = snapshotData.map(d => d.snapshotDate);

  const CHART_THEME = {
    borderColor: "#a9bdfc",
    backgroundColor: "#2b52cd",
    tension: 0.4,
  };

  const usersData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Users",
        data: snapshotData.map(d => d.totalUsers),
        ...CHART_THEME,
      },
    ],
  };

  const samplesData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Samples",
        data: snapshotData.map(d => d.totalSamples),
        ...CHART_THEME,
      },
    ],
  };

  const inputFilesData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Input Files",
        data: snapshotData.map(d => d.totalInputFiles),
        ...CHART_THEME,
      },
    ],
  };

  const inputFilesSizeData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Input Files Size",
        data: snapshotData.map(d => d.totalInputFilesSize / 1_000_000), // Convert to MB
        ...CHART_THEME,
      },
    ],
  };

  return (
    <div className={cs.wrapper}>
      <h1>User Storage Consumption</h1>
      <div className={cs.tilesContainer}>
        <div className={cs.tileItem}>
          <NumberTile title="Total Users" value={totalUsers} />
          <ChartTile title="Last 7 Days" data={usersData} />
        </div>
        <div className={cs.tileItem}>
          <NumberTile title="Total Samples" value={totalSamples} />
          <ChartTile title="Last 7 Days" data={samplesData} />
        </div>
        <div className={cs.tileItem}>
          <NumberTile title="Total Input Files" value={totalInputFiles} />
          <ChartTile title="Last 7 Days" data={inputFilesData} />
        </div>
        <div className={cs.tileItem}>
          <NumberTile
            title="Total Input Files Size"
            value={totalInputFilesSize}
          />
          <ChartTile title="Last 7 Days (MB)" data={inputFilesSizeData} />
        </div>
      </div>
      <table className={cs.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Name</th>
            <th>Total Samples</th>
            <th>Total Input Files</th>
            <th>Total Input Files Size</th>
            <th>Action</th>
          </tr>
        </thead>
        {users.map(
          ({
            id,
            email,
            name,
            sampleCount,
            inputFileCount,
            totalInputFilesSize,
          }) => (
            <tbody key={id}>
              <tr>
                <td>{id}</td>
                <td>{email}</td>
                <td>{name}</td>
                <td>{sampleCount}</td>
                <td>{inputFileCount}</td>
                <td>{totalInputFilesSize}</td>
                <td>
                  <a href={`/user_storage_consumption/${id}`}>Details</a>
                </td>
              </tr>
            </tbody>
          ),
        )}
      </table>
      <div className={cs.pagination}>
        {page > 1 && (
          <a
            href={`/user_storage_consumption?page=${
              page - 1
            }&per_page=${perPage}${searchBy ? `&search_by=${searchBy}` : ""}`}
          >
            Prev
          </a>
        )}
        Page {page}
        {page * perPage < totalCount && (
          <a
            href={`/user_storage_consumption?page=${
              page + 1
            }&per_page=${perPage}${searchBy ? `&search_by=${searchBy}` : ""}`}
          >
            Next
          </a>
        )}
      </div>
    </div>
  );
};
