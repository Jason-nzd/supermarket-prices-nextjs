import React from 'react';
import { DatedPrice } from '../../typings';
import { priceTrend, PriceTrend, printPrice, utcDateToShortDate } from '../../utilities/utilities';
import { CategoryScale, Chart, LinearScale, PointElement, LineElement } from 'chart.js';
import { Line } from 'react-chartjs-2';

interface Props {
  priceHistory: DatedPrice[];
  lastChecked: Date;
}

function PriceHistoryChart({ priceHistory, lastChecked }: Props) {
  // Initialize chart.js line chart
  Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

  // Separate arrays for x and y chart axis
  let dateStringsOnly: string[] = [];
  let priceDataOnly: number[] = [];

  priceHistory.forEach((datedPrice) => {
    // Remove day and year from date label
    dateStringsOnly.push(utcDateToShortDate(datedPrice.date));
    priceDataOnly.push(datedPrice.price);
  });

  const lastDateString = utcDateToShortDate(lastChecked, true);

  // If only 1 history point is available, add an extra point required for line rendering
  if (priceHistory.length === 1) {
    dateStringsOnly[1] = lastDateString;
    priceDataOnly[1] = priceDataOnly[0];
  } else {
    // Replace the last price date with the last checked date
    dateStringsOnly[dateStringsOnly.length - 1] = lastDateString;
  }

  // Set line colour to green or red depending on price trend
  let trendColour = '';
  switch (priceTrend(priceHistory)) {
    case PriceTrend.Decreased:
      trendColour = 'rgb(0, 255, 0)';
      break;
    case PriceTrend.Increased:
      trendColour = 'rgb(255, 0, 0)';
      break;
    default:
      trendColour = 'rgb(190, 190, 190)';
      break;
  }

  // Prepare chart data for chart.js line chart
  const chartData = {
    labels: dateStringsOnly,
    datasets: [
      {
        label: 'Price History',
        data: priceDataOnly,
        borderColor: trendColour,
        pointBorderColor: trendColour,
        pointBackgroundColor: 'white',
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHitRadius: 30,
        pointBorderWidth: 3,
        //backgroundColor: 'transparent',
        borderWidth: 3,
        tension: 0,
      },
    ],
    options: {
      responsive: true,
      maintainAspectRatio: false,
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

  return <Line data={chartData} className='z-50' />;
}

export default PriceHistoryChart;
