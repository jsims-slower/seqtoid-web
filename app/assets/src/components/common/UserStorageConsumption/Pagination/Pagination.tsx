import React from "react";
import cs from "./pagination.scss";

interface PaginationProps {
  page: number;
  totalPages: number;
  baseUrl: string;
}

type PaginationItem =
  | {
      kind: "nav";
      id: string;
      label: string;
      targetPage: number;
      disabled: boolean;
    }
  | {
      kind: "page";
      id: string;
      pageNumber: number;
      isCurrent: boolean;
    }
  | {
      kind: "ellipsis";
      id: string;
    };

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  baseUrl,
}) => {
  const generatePageUrl = (newPage: number) => {
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set("page", newPage.toString());
    return `${baseUrl}?${currentParams.toString()}`;
  };

  const clampedTotalPages = Math.max(totalPages, 1);
  const clampedPage = Math.min(Math.max(page, 1), clampedTotalPages);

  const items: PaginationItem[] = [
    {
      kind: "nav",
      id: "prev",
      label: "Prev",
      targetPage: clampedPage - 1,
      disabled: clampedPage <= 1,
    },
    {
      kind: "page",
      id: "page-1",
      pageNumber: 1,
      isCurrent: clampedPage === 1,
    },
  ];

  if (clampedPage > 2) {
    items.push({ kind: "ellipsis", id: "ellipsis-left" });
  }

  if (clampedPage !== 1 && clampedPage !== clampedTotalPages) {
    items.push({
      kind: "page",
      id: `page-${clampedPage}`,
      pageNumber: clampedPage,
      isCurrent: true,
    });
  }

  if (clampedPage < clampedTotalPages - 1) {
    items.push({ kind: "ellipsis", id: "ellipsis-right" });
  }

  if (clampedTotalPages > 1) {
    items.push({
      kind: "page",
      id: `page-${clampedTotalPages}`,
      pageNumber: clampedTotalPages,
      isCurrent: clampedPage === clampedTotalPages,
    });
  }

  items.push({
    kind: "nav",
    id: "next",
    label: "Next",
    targetPage: clampedPage + 1,
    disabled: clampedPage >= clampedTotalPages,
  });

  return (
    <div className={cs.pagination}>
      {items.map(item => {
        if (item.kind === "ellipsis") {
          return (
            <span key={item.id} className={cs.ellipsis}>
              …
            </span>
          );
        }

        if (item.kind === "page") {
          const pageClassName = item.isCurrent
            ? `${cs.item} ${cs.current}`
            : cs.item;

          return (
            <a
              key={item.id}
              className={pageClassName}
              href={generatePageUrl(item.pageNumber)}
              aria-current={item.isCurrent ? "page" : undefined}
            >
              {item.pageNumber}
            </a>
          );
        }

        if (item.disabled) {
          return (
            <span key={item.id} className={`${cs.item} ${cs.disabled}`}>
              {item.label}
            </span>
          );
        }

        return (
          <a
            key={item.id}
            className={cs.item}
            href={generatePageUrl(item.targetPage)}
          >
            {item.label}
          </a>
        );
      })}
    </div>
  );
};
