import React from 'react';
import { DatedPrice } from '../typings';
import { priceTrendingDown, printPrice } from '../utilities';
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

  // Replace the latest date name with 'Today'
  dateDataOnly[dateDataOnly.length - 1] = 'Today';

  // Set line colour to green or red depending on price trend
  const trendColour = priceTrendingDown(priceHistory) ? 'rgb(0, 255, 0)' : 'rgb(255, 0, 0)';

  // Prepare chart data for chart.js line chart
  const chartData = {
    labels: dateDataOnly,
    datasets: [
      {
        label: 'Price History',
        data: priceDataOnly,
        // fill: true,
        borderColor: trendColour,
        pointBorderColor: trendColour,
        pointBackgroundColor: 'white',
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHitRadius: 30,
        pointBorderWidth: 3,
        backgroundColor: 'transparent',
        borderWidth: 3,
        tension: 0,
      },
    ],
    options: {
      y: {
        grid: {
          color: 'black',
          borderDash: [5, 2],
          borderColor: 'black',
          tickColor: 'red',
          tickWidth: 2,
        },

        ticks: {
          color: 'red',
          font: {
            weight: 'bold',
          },
        },

        title: {
          display: true,
          text: 'Speed (in mph)',
          font: {
            weight: 'bold',
            size: 22,
          },
        },
      },

      // scales: {
      //   yAxes: [
      //     {
      //       ticks: {
      //         beginAtZero: true,
      //         stepSize: 5,
      //         callback: (value: number, index: number, values: number[]) => {
      //           return value + 'k';
      //         },
      //       },
      //     },
      //   ],
      // },
    },
  };

  // Display chart only if 2 or more data points exist
  if (priceHistory.length > 1) {
    return (
      <div className='rounded-b-2xl p-1'>
        <Line data={chartData} />
      </div>
    );
  } else {
    // No Price History to display
    return <div></div>;
  }
}

export default PriceHistoryChart;
