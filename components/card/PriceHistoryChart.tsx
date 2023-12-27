import React from 'react';
import { DatedPrice } from '../../typings';
import { priceTrend, PriceTrend, printPrice, utcDateToShortDate } from '../../utilities/utilities';
import { CategoryScale, Chart, LinearScale, PointElement, LineElement, Tooltip } from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';

interface Props {
  priceHistory: DatedPrice[];
  lastChecked: Date;
  useLargeVersion: boolean;
}

function PriceHistoryChart({ priceHistory, useLargeVersion = false, lastChecked }: Props) {
  // Initialize chart.js line chart
  Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

  // Separate arrays for x and y chart axis
  let dateStringsOnly: string[] = [];
  let priceDataOnly: number[] = [];

  // Loop through each DatedPrice and remove day and year from date label
  priceHistory.forEach((datedPrice) => {
    dateStringsOnly.push(utcDateToShortDate(datedPrice.date, true));
    priceDataOnly.push(datedPrice.price);
  });

  // Duplicate the most recent price point onto another price point when the product was last checked
  //  this emphasises that the most recent price point is still valid when last checked
  const mostRecentDate = new Date(priceHistory[priceHistory.length - 1].date).toDateString();
  const today = new Date().toDateString();

  if (mostRecentDate !== today) {
    dateStringsOnly.push(utcDateToShortDate(lastChecked, true));
    priceDataOnly.push(priceHistory[priceHistory.length - 1].price);
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

  // Use smaller point radius for denser charts
  let relativePointRadius = 3;
  if (priceHistory.length > 6 && !useLargeVersion) relativePointRadius = 2;
  if (priceHistory.length > 10 && !useLargeVersion) relativePointRadius = 0;

  // Prepare chart data for chart.js line chart
  const chartData: ChartData<'line'> = {
    labels: dateStringsOnly,
    datasets: [
      {
        data: priceDataOnly,
        borderColor: trendColour,
        pointBorderColor: trendColour,
        pointBackgroundColor: 'white',
        pointRadius: relativePointRadius,
        pointHoverRadius: 6,
        pointHitRadius: 30,
        pointBorderWidth: 3,
        borderWidth: 3,
        tension: 0.2,
        stepped: false,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    resizeDelay: 200,
    plugins: {
      tooltip: {
        callbacks: {
          title: () => {
            return '';
          },
          label: function (context: any) {
            return ' ' + printPrice(context.parsed.y);
          },
        },
        backgroundColor: 'white',
        titleColor: 'black',
        titleFont: { weight: 'normal' },
        bodyColor: 'black',
        footerColor: 'black',
        borderColor: trendColour,
        borderWidth: 1,
        padding: 10,
        cornerRadius: 14,
      },
    },
    // scales: {
    //   y: {
    //     // min: 0,
    //     ticks: {
    //       callback(tickValue, index, ticks) {
    //         return printPrice(tickValue as number);
    //       },
    //     },
    //   },
    // },
  };

  return <Line data={chartData} options={options} className='z-40' />;
}

export default PriceHistoryChart;
