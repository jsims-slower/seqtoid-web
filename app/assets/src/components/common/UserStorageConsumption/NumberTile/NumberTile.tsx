import React from "react";
import cs from "./number_tile.scss";

interface NumberTileProps {
  title: string;
  value: string | number;
  link?: {
    href: string;
    label: string;
  };
  variant?: "default" | "warning";
}

export const NumberTile: React.FC<NumberTileProps> = ({
  title,
  value,
  link,
  variant = "default",
}) => {
  const tileClassName =
    variant === "warning"
      ? `${cs.numberTile} ${cs.numberTileWarning}`
      : cs.numberTile;

  return (
    <div className={tileClassName}>
      <div className={cs.numberTileTitle}>
        <span>{title}</span>
        {link ? (
          <a href={link.href} className={cs.numberTileLink}>
            {link.label}
          </a>
        ) : null}
      </div>
      <div className={cs.numberTileValue}>{value}</div>
    </div>
  );
};
