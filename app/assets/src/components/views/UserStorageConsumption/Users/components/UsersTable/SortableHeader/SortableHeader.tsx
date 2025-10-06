import React from "react";
import cs from "./sortable_header.scss";

interface SortableHeaderProps {
  columnKey: string;
  columnLabel: string;
  sortBy?: string;
  sortDir?: string;
  searchBy?: string;
}

export const SortableHeader: React.FC<SortableHeaderProps> = ({
  columnKey,
  columnLabel,
  sortBy,
  sortDir,
}) => {
  const isCurrentSort = sortBy === columnKey;
  let nextSortDir = "desc";

  if (isCurrentSort) {
    nextSortDir = sortDir === "asc" ? "desc" : "asc";
  }

  const currentParams = new URLSearchParams(window.location.search);
  currentParams.set("sort_by", columnKey);
  currentParams.set("sort_dir", nextSortDir);
  const url = `/user_storage_consumption/users?${currentParams.toString()}`;

  return (
    <th className={`${cs.sortableHeader} ${isCurrentSort ? cs.active : ""}`}>
      <a href={url}>
        {columnLabel}
        <span className={cs.sortIconContainer}>
          <span
            className={`${cs.sortIcon} ${
              isCurrentSort && sortDir === "asc" ? cs.active : cs.inactive
            }`}
          >
            ▲
          </span>
          <span
            className={`${cs.sortIcon} ${
              isCurrentSort && sortDir === "desc" ? cs.active : cs.inactive
            }`}
          >
            ▼
          </span>
        </span>
      </a>
    </th>
  );
};
