import React from "react";
import cs from "./composite_cell.scss";

interface CompositeCellProps {
  primary: string;
  secondaryParts: string[];
  primaryClassName?: string;
  secondaryClassName?: string;
}

export const CompositeCell: React.FC<CompositeCellProps> = ({
  primary,
  secondaryParts,
  primaryClassName,
  secondaryClassName,
}) => {
  const primaryClasses = [cs.cellPrimary, primaryClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={cs.cellWrapper}>
      <span className={primaryClasses}>{primary}</span>
      {secondaryParts.map((part, index) => {
        const secondaryClasses = [cs.cellSecondary, secondaryClassName]
          .filter(Boolean)
          .join(" ");

        return (
          <span key={`${part}-${index}`} className={secondaryClasses}>
            {part}
          </span>
        );
      })}
    </span>
  );
};

export default CompositeCell;
