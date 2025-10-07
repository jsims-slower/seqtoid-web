import React from "react";
import cs from "./composite_cell.scss";

interface CompositeCellProps {
  primary?: string | null;
  secondaryParts?: string[];
  minWidth?: string;
  maxWidth?: string;
}

export const CompositeCell: React.FC<CompositeCellProps> = ({
  primary,
  secondaryParts = [],
  minWidth = "12rem",
  maxWidth = "25rem",
}) => {
  const primaryValue = primary ?? "N/A";
  const wrapperStyle = {
    minWidth,
    maxWidth,
    width: maxWidth,
  };

  return (
    <span className={cs.cellWrapper} style={wrapperStyle}>
      <span className={cs.cellPrimary} title={primaryValue}>
        {primaryValue}
      </span>
      {secondaryParts.map((part, index) => (
        <span
          key={`${part}-${index}`}
          className={cs.cellSecondary}
          title={part}
        >
          {part}
        </span>
      ))}
    </span>
  );
};

export default CompositeCell;
