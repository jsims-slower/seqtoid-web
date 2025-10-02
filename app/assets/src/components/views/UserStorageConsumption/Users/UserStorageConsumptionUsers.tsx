import React from "react";
import Pagination from "~/components/common/UserStorageConsumption/Pagination";
import cs from "~/components/views/UserStorageConsumption/user_storage_consumption.scss";
import SearchBar from "./components/SearchBar";
import UsersTable from "./components/UsersTable";
import { UserStorageConsumptionUsersProps } from "./types";

export const UserStorageConsumptionUsers: React.FC<
  UserStorageConsumptionUsersProps
> = ({ users, page, totalPages, searchBy, sortBy, sortDir }) => (
  <div className={cs.wrapper}>
    <div className={cs.header}>
      <a href="/user_storage_consumption" className={cs.backLink}>
        &#129168; Back to dashboard
      </a>
      <h1>Users</h1>
    </div>

    <SearchBar searchBy={searchBy} />

    {users && users.length > 0 ? (
      <>
        <UsersTable users={users} sortBy={sortBy} sortDir={sortDir} />
        <Pagination
          page={page}
          totalPages={totalPages}
          baseUrl="/user_storage_consumption/users"
        />
      </>
    ) : (
      <div className={cs.emptyState}>No users found.</div>
    )}
  </div>
);
