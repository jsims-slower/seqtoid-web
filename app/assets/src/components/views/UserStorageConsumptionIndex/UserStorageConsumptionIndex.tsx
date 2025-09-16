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
    totalInputFilesSize: number;
  }>;
  page: number;
  perPage: number;
  totalCount: number;
  searchBy?: string;
  totalUsers: number;
  totalSamples: number;
  totalInputFiles: number;
  totalInputFilesSize: number;
}

const generateLast7DaysData = (label: string) => {
  const labels: string[] = [];
  const data: number[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    labels.push(
      date.toLocaleDateString(undefined, {
        month: "numeric",
        day: "numeric",
        year: "2-digit",
      }),
    );
    data.push(
      i === 6
        ? Math.floor(Math.random() * 1000)
        : data[5 - i] + Math.floor(Math.random() * 100),
    );
  }
  return {
    labels,
    datasets: [
      {
        label,
        data,
        borderColor: "#a9bdfc",
        backgroundColor: "#2b52cd",
        tension: 0.4,
      },
    ],
  };
};

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
}) => {
  if (!users || users.length === 0) {
    return <div className={cs.emptyState}>No users found.</div>;
  }

  const usersData = generateLast7DaysData("Users");
  const samplesData = generateLast7DaysData("Samples");
  const inputFilesData = generateLast7DaysData("Input Files");
  const inputFilesSizeData = generateLast7DaysData("Input Files Size");

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
          <ChartTile title="Last 7 Days" data={inputFilesSizeData} />
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
