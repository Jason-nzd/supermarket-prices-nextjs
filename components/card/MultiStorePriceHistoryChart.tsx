import React from 'react';
import { Product } from '../../typings';
import { cleanDate, utcDateToLongDate, utcDateToShortDate } from '../../utilities/utilities';
import { CategoryScale, Chart, LinearScale, PointElement, LineElement, Tooltip } from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';

interface Props {
  countdownProduct?: Product;
  paknsaveProduct?: Product;
  warehouseProduct?: Product;
  newworldProduct?: Product;
}

function MultiStorePriceHistoryChart({
  countdownProduct,
  paknsaveProduct,
  warehouseProduct,
  newworldProduct,
}: Props) {
  // Initialize chart.js line chart
  Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

  // Dates array will share dates from all stores on the X axis
  let sharedDates: Date[] = [];

  // 1st pass - loop through all store price histories to determine shared date array
  [countdownProduct, paknsaveProduct, warehouseProduct]!.forEach((product) => {
    product?.priceHistory.forEach((datedPrice) => {
      // Clean any hours, seconds from store dates (converts '2023-06-18T23:46:27.222Z' to '2023-06-18')
      const cleanedStoreDate = cleanDate(datedPrice.date);

      // Check if store date has already been pushed into the shared date array
      // Use string comparison for better reliability
      let dateAlreadyExists = sharedDates.find((sharedDate) => {
        return sharedDate.toString() == cleanedStoreDate.toString();
      });

      // If store date has not yet been pushed into the shared date array, push it
      if (!dateAlreadyExists) {
        sharedDates.push(cleanedStoreDate);
      }
    });
  });

  // Each store will have it's own Y axis dataset, which is initialized to all zeroes
  // let priceDataCountdown: number[] = new Array(sharedDates.length).fill(0);
  let priceDataCountdown = new Array(sharedDates.length).fill(NaN);
  let priceDataPaknsave = new Array(sharedDates.length).fill(NaN);
  let priceDataWarehouse = new Array(sharedDates.length).fill(NaN);
  let priceDataNewworld = new Array(sharedDates.length).fill(NaN);

  // Debug
  // if (countdownProduct) {
  //   console.log(
  //     'DEBUG: Countdown 1st date: ' +
  //       utcDateToLongDate(countdownProduct?.priceHistory[0].date) +
  //       ' last date: ' +
  //       utcDateToLongDate(
  //         countdownProduct?.priceHistory[countdownProduct?.priceHistory.length - 1].date
  //       ) +
  //       ' - total prices: ' +
  //       countdownProduct?.priceHistory.length
  //   );
  // }

  // Sort dates
  sharedDates.sort((a, b) => {
    return Number(a) - Number(b);
  });

  // 2nd pass - loop through countdown price history and populate full length dataset
  countdownProduct?.priceHistory.forEach((datedPrice) => {
    const cleanedDate = cleanDate(datedPrice.date);
    // console.log(
    //   'CD [' +
    //     index +
    //     '] - ' +
    //     utcDateToShortDate(cleanedDate) +
    //     ' = Shared [' +
    //     sharedDates.findIndex((sharedDate) => {
    //       return sharedDate.toString() == cleanedDate.toString();
    //     }) +
    //     ']'
    // );

    let matchedStoreToSharedIndex = sharedDates.findIndex((sharedDate) => {
      return sharedDate.toString() == cleanedDate.toString();
    });

    if (matchedStoreToSharedIndex >= 0) {
      priceDataCountdown[matchedStoreToSharedIndex] = datedPrice.price;
    }
  });

  // 2nd pass - loop through paknsave price history and populate full length dataset
  paknsaveProduct?.priceHistory.forEach((datedPrice) => {
    const cleanedDate = cleanDate(datedPrice.date);

    let matchedStoreToSharedIndex = sharedDates.findIndex((sharedDate) => {
      return sharedDate.toString() == cleanedDate.toString();
    });

    if (matchedStoreToSharedIndex >= 0) {
      priceDataPaknsave[matchedStoreToSharedIndex] = datedPrice.price;
    }
  });

  // 2nd pass - loop through warehouse price history and populate full length dataset
  warehouseProduct?.priceHistory.forEach((datedPrice) => {
    const cleanedDate = cleanDate(datedPrice.date);

    let matchedStoreToSharedIndex = sharedDates.findIndex((sharedDate) => {
      return sharedDate.toString() == cleanedDate.toString();
    });

    if (matchedStoreToSharedIndex >= 0) {
      priceDataWarehouse[matchedStoreToSharedIndex] = datedPrice.price;
    }
  });

  // 2nd pass - loop through newworld price history and populate full length dataset
  newworldProduct?.priceHistory.forEach((datedPrice) => {
    const cleanedDate = cleanDate(datedPrice.date);

    let matchedStoreToSharedIndex = sharedDates.findIndex((sharedDate) => {
      return sharedDate.toString() == cleanedDate.toString();
    });

    if (matchedStoreToSharedIndex >= 0) {
      priceDataNewworld[matchedStoreToSharedIndex] = datedPrice.price;
    }
  });

  // Create shorter labels for dates
  const dateStringsOnly: string[] = sharedDates.map((date) => {
    return utcDateToLongDate(date);
  });

  // Prepare chart data for chart.js line chart
  const chartData: ChartData<'line'> = {
    labels: dateStringsOnly,
    datasets: [
      {
        label: 'Countdown',
        data: priceDataCountdown,
        borderColor: 'green',
        pointBorderColor: 'green',
        pointBackgroundColor: 'white',
        pointHoverRadius: 6,
        pointHitRadius: 30,
        pointBorderWidth: 3,
        borderWidth: 3,
        tension: 0.2,
        stepped: 'before',
        spanGaps: true,
      },

      {
        label: 'PaknSave',
        data: priceDataPaknsave,
        borderColor: 'yellow',
        pointBorderColor: 'yellow',
        pointBackgroundColor: 'white',
        pointHoverRadius: 6,
        pointHitRadius: 30,
        pointBorderWidth: 3,
        borderWidth: 3,
        tension: 0.2,
        stepped: 'before',
        spanGaps: true,
      },
      {
        label: 'The Warehouse',
        data: priceDataWarehouse,
        borderColor: 'red',
        pointBorderColor: 'red',
        pointBackgroundColor: 'white',
        pointHoverRadius: 6,
        pointHitRadius: 30,
        pointBorderWidth: 3,
        borderWidth: 3,
        tension: 0.2,
        stepped: 'before',
        spanGaps: true,
      },
      {
        label: 'New World',
        data: priceDataNewworld,
        borderColor: 'orange',
        pointBorderColor: 'red',
        pointBackgroundColor: 'white',
        pointHoverRadius: 6,
        pointHitRadius: 30,
        pointBorderWidth: 3,
        borderWidth: 3,
        tension: 0.2,
        stepped: 'before',
        spanGaps: true,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    resizeDelay: 200,
    plugins: {
      tooltip: {
        // callbacks: {
        //   title: () => {
        //     return '';
        //   },
        //   label: function (context: any) {
        //     return ' ' + printPrice(context.parsed.y);
        //   },
        // },
        backgroundColor: 'white',
        titleColor: 'black',
        titleFont: { weight: 'normal' },
        bodyColor: 'black',
        footerColor: 'black',
        // borderColor: trendColour,
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

export default MultiStorePriceHistoryChart;
