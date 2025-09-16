import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import React from "react";
import { Line } from "react-chartjs-2";
import cs from "./chart_tile.scss";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface ChartTileProps {
  title: string;
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  };
}

const options = {
  plugins: {
    legend: {
      display: false,
    },
  },
};

export const ChartTile: React.FC<ChartTileProps> = ({ title, data }) => {
  return (
    <div className={cs.chartTile}>
      <div className={cs.chartTileTitle}>{title}</div>
      <div className={cs.chartTileContent}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};
