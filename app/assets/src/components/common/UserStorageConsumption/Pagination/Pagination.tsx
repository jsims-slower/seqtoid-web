import React from "react";
import cs from "./pagination.scss";

interface PaginationProps {
  page: number;
  perPage: number;
  totalCount: number;
  baseUrl: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  perPage,
  totalCount,
  baseUrl,
}) => {
  const generatePageUrl = (newPage: number) => {
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set("page", newPage.toString());
    return `${baseUrl}?${currentParams.toString()}`;
  };

  return (
    <div className={cs.pagination}>
      {page > 1 && <a href={generatePageUrl(page - 1)}>Prev</a>}
      <span className={cs.pageInfo}>Page {page}</span>
      {page * perPage < totalCount && (
        <a href={generatePageUrl(page + 1)}>Next</a>
      )}
    </div>
  );
};
