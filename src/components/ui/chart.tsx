import type { HTMLAttributes } from 'react';
import { Line } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type LineChartOptions = ChartOptions<'line'>;

interface ChartProps extends HTMLAttributes<HTMLDivElement> {
  data: ChartData<'line'>;
  options?: LineChartOptions;
}

export function Chart({ data, options, ...props }: ChartProps) {
  return (
    <div {...props}>
      <Line data={data} options={options || {}} />
    </div>
  );
}
