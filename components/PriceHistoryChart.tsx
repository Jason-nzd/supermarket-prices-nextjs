import React from 'react';
import { DatedPrice } from '../typings';
import { printPrice } from '../utilities';
import { CategoryScale, Chart, LinearScale, PointElement, LineElement } from 'chart.js';
import { Line } from 'react-chartjs-2';

interface Props {
  priceHistory: DatedPrice[];
}

function PriceHistoryChart({ priceHistory }: Props) {
  // Initialize chart.js line chart
  Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

  // Separate data fields for x and y chart axis
  let dateDataOnly: string[] = [];
  let priceDataOnly: number[] = [];
  priceHistory.forEach((datedPrice) => {
    // Remove day and year from date label
    dateDataOnly.push(datedPrice.date.slice(4, datedPrice.date.length - 5));
    priceDataOnly.push(datedPrice.price);
  });

  // Add a new chart point highlighting today's price
  dateDataOnly.push('Today');
  priceDataOnly.push(priceDataOnly[priceDataOnly.length - 1]);

  // Prepare chart data for chart.js line chart
  const chartData = {
    labels: dateDataOnly,
    datasets: [
      {
        label: 'Price Dataset',
        data: priceDataOnly,
        fill: true,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  // Display chart only if 2 or more data points exist
  if (priceHistory.length > 1) {
    return (
      <div className='bg-white rounded-b-2xl p-2'>
        <Line data={chartData} />
      </div>
    );
  } else {
    // No Price History to display
    return <div></div>;
  }
}

export default PriceHistoryChart;
