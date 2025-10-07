import React from "react";
import { UsersPageUser } from "~/components/views/UserStorageConsumption/Users/types";
import SortableHeader from "~/components/common/UserStorageConsumption/SortableHeader";
import styles from "./users_table.scss";

interface UsersTableProps {
  users: UsersPageUser[];
  sortBy?: string;
  sortDir?: string;
}

const UsersTable: React.FC<UsersTableProps> = ({ users, sortBy, sortDir }) => (
  <table className={styles.table}>
    <thead>
      <tr>
        <th>ID</th>
        <th>Email</th>
        <th>Name</th>
        <SortableHeader
          columnKey="samples_count"
          columnLabel="Total Samples"
          sortBy={sortBy}
          sortDir={sortDir}
        />
        <SortableHeader
          columnKey="input_files_count"
          columnLabel="Total Input Files"
          sortBy={sortBy}
          sortDir={sortDir}
        />
        <SortableHeader
          columnKey="total_input_files_size"
          columnLabel="Total Input Files Size"
          sortBy={sortBy}
          sortDir={sortDir}
        />
        <SortableHeader
          columnKey="sample_s3_files_count"
          columnLabel="Sample S3 Files"
          sortBy={sortBy}
          sortDir={sortDir}
        />
        <SortableHeader
          columnKey="total_sample_s3_size"
          columnLabel="Sample S3 Storage"
          sortBy={sortBy}
          sortDir={sortDir}
        />
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
        sampleS3FileCount,
        totalSampleS3StorageSize,
      }) => (
        <tbody key={id}>
          <tr>
            <td>{id}</td>
            <td>{email}</td>
            <td>{name}</td>
            <td>{sampleCount}</td>
            <td>{inputFileCount}</td>
            <td>{totalInputFilesSize}</td>
            <td>{sampleS3FileCount}</td>
            <td>{totalSampleS3StorageSize}</td>
            <td>
              <div className={styles.actionButtons}>
                <a
                  href={`/user_storage_consumption/users/${id}/input_files`}
                  className={`${styles.actionButton} ${styles.actionButtonPrimary}`}
                >
                  Input file details
                </a>
                <a
                  href={`/user_storage_consumption/users/${id}/sample_s3_files`}
                  className={`${styles.actionButton} ${styles.actionButtonSecondary}`}
                >
                  Sample S3 details
                </a>
              </div>
            </td>
          </tr>
        </tbody>
      ),
    )}
  </table>
);

export default UsersTable;
