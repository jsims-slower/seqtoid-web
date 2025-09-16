import React from "react";
import cs from "./number_tile.scss";

interface NumberTileProps {
  title: string;
  value: string | number;
}

export const NumberTile: React.FC<NumberTileProps> = ({ title, value }) => {
  return (
    <div className={cs.numberTile}>
      <div className={cs.numberTileTitle}>{title}</div>
      <div className={cs.numberTileValue}>{value}</div>
    </div>
  );
};
