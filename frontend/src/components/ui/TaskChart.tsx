'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type Props = {
  data: {
    todo: number;
    inProgress: number;
    done: number;
  };
};

export default function TaskChart({ data }: Props) {
  const chartData = {
    labels: ['Todo', 'In Progress', 'Done'],
    datasets: [
      {
        label: 'Jumlah Task',
        data: [data.todo, data.inProgress, data.done],
        backgroundColor: ['#facc15', '#38bdf8', '#4ade80'],
        borderRadius: 6,
      },
    ],
  };

  return <Bar data={chartData} />;
}
