
import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { PriceHistory } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PriceHistoryChartProps {
  priceHistory: PriceHistory[];
}

type ChartType = 'line' | 'bar';

const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({ priceHistory }) => {
  const [chartType, setChartType] = useState<ChartType>('line');

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const sortedHistory = [...priceHistory].sort((a, b) =>
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const cleanedHistory = sortedHistory.filter(item => item.price > 10 && item.price < 100000);

  const labels = cleanedHistory.map(item => formatDate(item.timestamp));
  const prices = cleanedHistory.map(item => item.price);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Price (₹)',
        data: prices,
        borderColor: 'rgb(37, 99, 235)',
        backgroundColor: 'rgba(37, 99, 235, 0.5)',
        tension: 0.2,
      },
    ],
  };

  const options: ChartOptions<'line' | 'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        min: 100,
        max: 100000,
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Price History',
      },
    },
  };

  return (
    <div className="w-full h-[400px]">
      <div className="flex justify-end mb-2">
        <button
          className="px-2 py-1 text-sm border rounded mr-2"
          onClick={() => setChartType('line')}
        >
          Line
        </button>
        <button
          className="px-2 py-1 text-sm border rounded"
          onClick={() => setChartType('bar')}
        >
          Bar
        </button>
      </div>
      {chartType === 'line' ? (
        <Line options={options} data={chartData} />
      ) : (
        <Bar options={options} data={chartData} />
      )}
    </div>
  );
};

export default PriceHistoryChart;
